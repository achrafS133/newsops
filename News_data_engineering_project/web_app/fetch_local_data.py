
import json
import os
import pandas as pd
from gnews import GNews
from textblob import TextBlob
from datetime import datetime
import random

def fetch_and_process_data():
    print("Fetching news data from GNews...")
    
    # Configuration matches project settings
    categories = ['Technology', 'Business', 'Sports', 'Health', 'Politics', 'Science']
    google_news = GNews(max_results=10) # 10 per category = 60 articles
    
    all_data = []
    
    for category in categories:
        try:
            print(f"Fetching {category}...")
            news = google_news.get_news(category)
            for article in news:
                title = article.get('title', 'No Title')
                desc = article.get('description', '')
                
                # Sentiment Analysis
                blob = TextBlob(str(title) + " " + str(desc))
                sentiment = blob.sentiment.polarity
                subjectivity = blob.sentiment.subjectivity
                
                # Simple Broker Topic Extraction (from assets.py)
                topic_label = 'General'
                title_lower = str(title).lower()
                if any(word in title_lower for word in ['tech', 'ai', 'digital', 'cyber', 'software']):
                    topic_label = 'Technology'
                elif any(word in title_lower for word in ['business', 'market', 'economy', 'finance', 'stock']):
                    topic_label = 'Business'
                elif any(word in title_lower for word in ['sport', 'game', 'player', 'team', 'match']):
                    topic_label = 'Sports'
                elif any(word in title_lower for word in ['health', 'medical', 'virus', 'doctor']):
                    topic_label = 'Health'
                elif any(word in title_lower for word in ['politic', 'law', 'election', 'government']):
                    topic_label = 'Politics'
                elif any(word in title_lower for word in ['science', 'space', 'nasa', 'research']):
                    topic_label = 'Science'

                # Breaking News Detection (Logic from assets.py)
                breaking_keywords = ['breaking', 'urgent', 'alert', 'emergency', 'crisis', 'developing', 'live']
                is_breaking = False
                if any(k in str(title).lower() for k in breaking_keywords):
                    is_breaking = True
                if abs(sentiment) > 0.5: # Extreme sentiment
                    is_breaking = True

                # Simple Location Extraction (Mocking SpaCy)
                common_locs = ['US', 'USA', 'UK', 'China', 'Japan', 'India', 'Russia', 'Ukraine', 'Gaza', 'Israel', 'London', 'New York', 'California']
                locations = [loc for loc in common_locs if loc in str(title) or loc in str(desc)]

                # FORCE DEMO: Make the first article Breaking News
                if len(all_data) == 0:
                    is_breaking = True
                    sentiment = -0.8 # Force negative sentiment for drama

                all_data.append({
                    "title": title,
                    "description": desc,
                    "published_at": article.get('published date'),
                    "url": article.get('url', ''),
                    "publisher": article.get('publisher', {}).get('title', 'Unknown'),
                    "category": category,
                    "sentiment": sentiment,
                    "subjectivity": subjectivity,
                    "topic_label": topic_label,
                    "is_breaking": is_breaking,
                    "locations": locations
                })
        except Exception as e:
            print(f"Error fetching {category}: {e}")

    df = pd.DataFrame(all_data)
    print(f"Total articles fetched: {len(df)}")
    
    # 1. Metrics.json
    metrics = {
        "totalArticles": len(df),
        "avgSentiment": float(df['sentiment'].mean()) if not df.empty else 0,
        "activeSources": int(df['publisher'].nunique()) if not df.empty else 0
    }
    
    # 2. Articles.json (Limit 50 recent)
    articles = df.to_dict('records')
    
    # 3. Categories.json
    if not df.empty:
        cat_stats = df.groupby('category').agg({
            'title': 'count',
            'sentiment': 'mean'
        }).reset_index().rename(columns={'title': 'count'})
        categories_data = cat_stats.to_dict('records')
    else:
        categories_data = []

    # Ensure output directory exists
    os.makedirs('data', exist_ok=True)
    
    with open('data/metrics.json', 'w') as f:
        json.dump(metrics, f)
    
    with open('data/articles.json', 'w') as f:
        json.dump(articles, f)
        
    with open('data/categories.json', 'w') as f:
        json.dump(categories_data, f)
        
    print("Data successfully saved to data/metrics.json, data/articles.json, and data/categories.json")

if __name__ == "__main__":
    fetch_and_process_data()
