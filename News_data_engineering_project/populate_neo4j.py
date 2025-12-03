from neo4j import GraphDatabase
from clickhouse_driver import Client
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def populate_neo4j():
    # Connect to databases
    neo4j_driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "password"))
    clickhouse_client = Client(host='localhost', port=9000)
    
    # Get data from ClickHouse
    articles = clickhouse_client.execute("""
        SELECT title, publisher, sentiment, published_at, topic_label, locations, url
        FROM news_articles 
        LIMIT 50
    """)
    
    logger.info(f"Retrieved {len(articles)} articles from ClickHouse")
    
    with neo4j_driver.session() as session:
        # Clear existing data
        session.run("MATCH (n) DETACH DELETE n")
        
        for article in articles:
            title, publisher, sentiment, published_at, topic_label, locations, url = article
            
            # Create article and relationships
            session.run("""
                MERGE (p:Publisher {name: $publisher})
                MERGE (a:Article {url: $url})
                SET a.title = $title, 
                    a.sentiment = $sentiment, 
                    a.published_at = $published_at,
                    a.topic_label = $topic_label
                MERGE (p)-[:PUBLISHED]->(a)
                
                MERGE (t:Topic {label: $topic_label})
                MERGE (a)-[:BELONGS_TO]->(t)
            """, title=title, publisher=publisher, sentiment=sentiment, 
                published_at=published_at, topic_label=topic_label, url=url)
            
            # Add locations
            if locations:
                for location in locations:
                    session.run("""
                        MATCH (a:Article {url: $url})
                        MERGE (l:Location {name: $location})
                        MERGE (a)-[:MENTIONS]->(l)
                    """, url=url, location=location)
    
    # Verify data
    with neo4j_driver.session() as session:
        result = session.run("MATCH (n) RETURN labels(n)[0] as type, count(n) as count")
        for record in result:
            logger.info(f"{record['type']}: {record['count']} nodes")
    
    neo4j_driver.close()
    logger.info("Neo4j population complete!")

if __name__ == "__main__":
    populate_neo4j()