from dagster import asset, Output
import pandas as pd
from clickhouse_driver import Client
import logging

logger = logging.getLogger(__name__)

@asset
def detect_breaking_news(load_to_clickhouse):
    """Detects breaking news based on sentiment spikes and keyword analysis."""
    client = Client(host='clickhouse')
    
    # Get recent articles with high impact indicators
    breaking_news = client.execute("""
        SELECT title, publisher, category, sentiment, published_at
        FROM news_articles 
        WHERE (
            sentiment < -0.7 OR sentiment > 0.7 OR
            title LIKE '%BREAKING%' OR 
            title LIKE '%URGENT%' OR
            title LIKE '%ALERT%'
        )
        AND published_at >= now() - INTERVAL 1 HOUR
        ORDER BY published_at DESC
        LIMIT 10
    """)
    
    if breaking_news:
        df_breaking = pd.DataFrame(breaking_news, columns=[
            'Title', 'Publisher', 'Category', 'Sentiment', 'Published'
        ])
        
        logger.info(f"Detected {len(df_breaking)} breaking news items")
        
        return Output(
            df_breaking,
            metadata={
                "breaking_count": len(df_breaking),
                "high_sentiment_count": len(df_breaking[abs(df_breaking['Sentiment']) > 0.7])
            }
        )
    
    logger.info("No breaking news detected")
    return Output(pd.DataFrame(), metadata={"breaking_count": 0})