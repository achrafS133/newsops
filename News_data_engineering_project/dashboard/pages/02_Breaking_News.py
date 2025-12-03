import streamlit as st
import pandas as pd
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("🚨 Breaking News")

client = get_clickhouse_client()

try:
    # Breaking news logic: High sentiment impact or keywords
    query = """
        SELECT title, publisher, category, sentiment, published_at, url
        FROM news_articles 
        WHERE (
            abs(sentiment) > 0.7 OR
            title ILIKE '%BREAKING%' OR 
            title ILIKE '%URGENT%' OR
            title ILIKE '%ALERT%'
        )
        AND published_at >= now() - INTERVAL 24 HOUR
        ORDER BY published_at DESC
        LIMIT 20
    """
    
    data = client.execute(query)
    df = pd.DataFrame(data, columns=['Title', 'Publisher', 'Category', 'Sentiment', 'Published', 'URL'])
    
    if not df.empty:
        for _, row in df.iterrows():
            sentiment_color = "#ff4b4b" if row['Sentiment'] < 0 else "#00ff88"
            st.markdown(f"""
            <div style="padding: 1rem; border-radius: 10px; background: rgba(255,255,255,0.05); margin-bottom: 1rem; border-left: 5px solid {sentiment_color};">
                <h3 style="margin:0">{row['Title']}</h3>
                <p style="color: #aaa; margin: 0.5rem 0;">{row['Publisher']} • {row['Category']} • {row['Published']}</p>
                <p>Sentiment: <span style="color:{sentiment_color}">{row['Sentiment']:.2f}</span></p>
                <a href="{row['URL']}" target="_blank" style="color: #4da6ff; text-decoration: none;">Read Article →</a>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info("No breaking news detected in the last 24 hours.")

except Exception as e:
    st.error(f"Error fetching breaking news: {e}")
