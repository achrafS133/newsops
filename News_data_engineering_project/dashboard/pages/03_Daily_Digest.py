import streamlit as st
import pandas as pd
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("☕ Daily Digest")

client = get_clickhouse_client()

try:
    # Get top article per category for today
    query = """
        SELECT category, title, publisher, sentiment, url
        FROM news_articles
        WHERE published_at >= today()
        ORDER BY abs(sentiment) DESC
        LIMIT 1 BY category
    """
    
    data = client.execute(query)
    df = pd.DataFrame(data, columns=['Category', 'Title', 'Publisher', 'Sentiment', 'URL'])
    
    if not df.empty:
        st.subheader(f"Top Stories for {pd.Timestamp.now().strftime('%B %d, %Y')}")
        
        cols = st.columns(len(df))
        for i, (index, row) in enumerate(df.iterrows()):
            with cols[i % 3]: # Wrap around if many categories
                st.markdown(f"""
                <div class="metric-card" style="text-align: left;">
                    <div class="metric-label">{row['Category']}</div>
                    <h4 style="margin: 0.5rem 0; height: 80px; overflow: hidden;">{row['Title']}</h4>
                    <p style="font-size: 0.8rem; color: #888;">{row['Publisher']}</p>
                    <a href="{row['URL']}" target="_blank">Read More</a>
                </div>
                """, unsafe_allow_html=True)
    else:
        st.info("No articles found for today yet.")

except Exception as e:
    st.error(f"Error generating digest: {e}")
