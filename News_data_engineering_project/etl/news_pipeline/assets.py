from dagster import asset, Output, MetadataValue
import pandas as pd
from gnews import GNews
from textblob import TextBlob
from datetime import datetime
from clickhouse_driver import Client
from neo4j import GraphDatabase
import logging
try:
    from bertopic import BERTopic
except ImportError:
    class BERTopic:
        def __init__(self, *args, **kwargs): pass
        def fit_transform(self, docs): return [0]*len(docs), [0.5]*len(docs)
        def get_topic_info(self): return pd.DataFrame({'Topic': [0, 1], 'Count': [10, 5], 'Name': ['Mock Topic 1', 'Mock Topic 2']})

import spacy
from geopy.geocoders import Nominatim
import json
import os

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.info("Downloading spaCy model...")
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

CONFIG_PATH = "/opt/dagster/app/shared_config/settings.json"

def load_settings():
    try:
        if os.path.exists(CONFIG_PATH):
            with open(CONFIG_PATH, "r") as f:
                return json.load(f)
    except Exception as e:
        logger.warning(f"Failed to load settings: {e}")
    return {}

@asset
def ingest_news():
    """Fetches news from configured categories."""
    settings = load_settings()
    max_results = settings.get("max_articles", 20)
    categories = settings.get("active_categories", ['Technology', 'Business', 'Sports', 'Health', 'Politics'])

    logger.info(f"Fetching news from GNews with max_results={max_results} for categories={categories}...")
    google_news = GNews(language='en', country='US', period='1d', max_results=max_results)
    
    all_data = []
    
    for category in categories:
        try:
            news = google_news.get_news(category)
            for article in news:
                all_data.append({
                    "title": article.get('title', 'No Title'),
                    "description": article.get('description', ''),
                    "published_at": article.get('published date'),
                    "url": article.get('url', ''),
                    "publisher": article.get('publisher', {}).get('title', 'Unknown'),
                    "category": category
                })
        except Exception as e:
            logger.warning(f"Failed to fetch {category}: {e}")
    
    df = pd.DataFrame(all_data)
    df['published_at'] = pd.to_datetime(df['published_at'], errors='coerce').fillna(datetime.now())
    
    logger.info(f"Fetched {len(df)} articles across {len(categories)} categories.")
    return Output(df, metadata={"num_records": len(df), "categories": len(categories)})

@asset
def process_news(ingest_news: pd.DataFrame):
    """Analyzes sentiment using TextBlob."""
    df = ingest_news.copy()
    
    def get_sentiment(text):
        if not text: return 0.0
        return TextBlob(str(text)).sentiment.polarity

    df['sentiment'] = df['title'].apply(get_sentiment)
    df['processed_at'] = datetime.now()
    
    logger.info(f"Processed sentiment for {len(df)} articles.")
    return Output(df, metadata={"avg_sentiment": float(df['sentiment'].mean())})

@asset
def extract_topics(process_news: pd.DataFrame):
    """Extracts topics using BERTopic."""
    df = process_news.copy()
    
    # Use simple keyword-based topic extraction for speed
    documents = df['title'].tolist()  # Only use titles for speed
    
    # Simple topic assignment based on keywords
    def assign_topic(title):
        title_lower = str(title).lower()
        if any(word in title_lower for word in ['tech', 'ai', 'digital', 'cyber']):
            return 0, 'Technology'
        elif any(word in title_lower for word in ['business', 'market', 'economy', 'finance']):
            return 1, 'Business'
        elif any(word in title_lower for word in ['sport', 'game', 'player', 'team']):
            return 2, 'Sports'
        elif any(word in title_lower for word in ['health', 'medical', 'hospital', 'doctor']):
            return 3, 'Health'
        elif any(word in title_lower for word in ['politic', 'government', 'election', 'policy']):
            return 4, 'Politics'
        else:
            return -1, 'General'
    
    topics_labels = [assign_topic(title) for title in documents]
    topics = [t[0] for t in topics_labels]
    topic_labels = {t[0]: t[1] for t in topics_labels}
    
    df['topic_id'] = topics
    
    df['topic_label'] = df['topic_id'].map(topic_labels)
    
    unique_topics = len(set(topics))
    logger.info(f"Extracted {unique_topics} topics using fast keyword matching.")
    return Output(df, metadata={"num_topics": unique_topics})

@asset
def extract_locations(extract_topics: pd.DataFrame):
    """Extracts locations using spaCy NER."""
    df = extract_topics.copy()
    
    def get_locations(text):
        if not text: return []
        doc = nlp(str(text))
        return [ent.text for ent in doc.ents if ent.label_ in ['GPE', 'LOC']]
    
    df['locations'] = (df['title'] + ' ' + df['description']).apply(get_locations)
    
    geolocator = Nominatim(user_agent="news_intelligence_platform")
    
    def geocode_location(locations):
        if not locations: return []
        coords = []
        for loc in locations[:2]:
            try:
                location = geolocator.geocode(loc, timeout=5)
                if location:
                    coords.append((location.latitude, location.longitude))
            except Exception as e:
                logger.warning(f"Geocoding failed for {loc}: {e}")
        return coords
    
    df['coordinates'] = df['locations'].apply(geocode_location)
    
    logger.info(f"Extracted locations for {len(df)} articles.")
    return Output(df, metadata={"articles_with_locations": int((df['locations'].str.len() > 0).sum())})

@asset
def load_to_clickhouse(extract_locations: pd.DataFrame):
    """Loads data into ClickHouse."""
    client = Client(host='clickhouse')
    
    client.execute('DROP TABLE IF EXISTS news_articles')
    client.execute('''
        CREATE TABLE news_articles (
            title String,
            description String,
            content String DEFAULT description,
            published_at DateTime,
            url String,
            publisher String,
            category String,
            sentiment Float32,
            processed_at DateTime,
            topic_id Int32,
            topic_label String,
            locations Array(String),
            coordinates Array(Tuple(Float64, Float64))
        ) ENGINE = MergeTree()
        ORDER BY published_at
    ''')
    
    # Ensure coordinates are properly formatted as list of tuples
    df = extract_locations.copy()
    df['coordinates'] = df['coordinates'].apply(lambda x: [tuple(c) for c in x] if isinstance(x, list) else [])
    
    # Ensure locations and coordinates have the same length to prevent ClickHouse ARRAY JOIN errors
    def sync_arrays(row):
        locs = row['locations'] if isinstance(row['locations'], list) else []
        coords = row['coordinates']
        min_len = min(len(locs), len(coords))
        return locs[:min_len], coords[:min_len]

    # Apply the sync function
    synced = df.apply(sync_arrays, axis=1, result_type='expand')
    df['locations'] = synced[0]
    df['coordinates'] = synced[1]
    
    # Ensure content column exists
    if 'content' not in df.columns:
        df['content'] = df['description']
    
    # Fill NaN values to avoid ClickHouse errors
    df = df.fillna({
        'title': '', 'description': '', 'content': '', 'url': '', 
        'publisher': 'Unknown', 'category': 'General', 'topic_label': 'General'
    })
    
    records = df.to_dict('records')
    
    # Explicitly map columns to ensure order matches
    insert_query = '''
        INSERT INTO news_articles (
            title, description, content, published_at, url, publisher, category, 
            sentiment, processed_at, topic_id, topic_label, locations, coordinates
        ) VALUES
    '''
    
    client.execute(insert_query, records)
    
    logger.info(f"Inserted {len(records)} records into ClickHouse.")
    return Output(None, metadata={"inserted_records": len(records)})

@asset
def detect_breaking_news(process_news: pd.DataFrame):
    """Detects breaking news based on sentiment spikes and keyword analysis."""
    df = process_news.copy()
    
    # Breaking news keywords
    breaking_keywords = ['breaking', 'urgent', 'alert', 'emergency', 'crisis', 'developing']
    
    # Detect breaking news
    def is_breaking(title, sentiment):
        try:
            title_lower = str(title).lower()
            has_keywords = any(keyword in title_lower for keyword in breaking_keywords)
            # Handle potential None/NaN sentiment
            sent_val = float(sentiment) if pd.notnull(sentiment) else 0.0
            extreme_sentiment = abs(sent_val) > 0.5
            return has_keywords or extreme_sentiment
        except Exception:
            return False
    
    df['is_breaking'] = df.apply(lambda row: is_breaking(row['title'], row['sentiment']), axis=1)
    
    breaking_count = df['is_breaking'].sum()
    logger.info(f"Detected {breaking_count} breaking news articles.")
    
    return Output(df, metadata={"breaking_news_count": int(breaking_count)})

@asset
def load_to_neo4j(extract_locations: pd.DataFrame):
    """Loads entities into Neo4j."""
    driver = GraphDatabase.driver("bolt://neo4j:7687", auth=("neo4j", "password"))
    
    def add_article(tx, article):
        tx.run("""
            MERGE (p:Publisher {name: $publisher})
            MERGE (a:Article {url: $url})
            SET a.title = $title, 
                a.sentiment = $sentiment, 
                a.published_at = toString($published_at),
                a.topic_label = $topic_label
            MERGE (p)-[:PUBLISHED]->(a)
            
            MERGE (t:Topic {label: $topic_label})
            MERGE (a)-[:BELONGS_TO]->(t)
            
            FOREACH (loc IN $locations |
                MERGE (l:Location {name: loc})
                MERGE (a)-[:MENTIONS]->(l)
            )
        """, **article)

    with driver.session() as session:
        for _, row in extract_locations.iterrows():
            try:
                article_data = row.to_dict()
                # Convert complex types for Neo4j
                article_data['published_at'] = str(article_data['published_at'])
                session.write_transaction(add_article, article_data)
            except Exception as e:
                logger.error(f"Failed to load article to Neo4j: {e}")

    driver.close()
    logger.info(f"Loaded {len(extract_locations)} articles into Neo4j.")
    return Output(None, metadata={"loaded_records": len(extract_locations)})

