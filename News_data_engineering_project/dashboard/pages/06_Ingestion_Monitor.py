import streamlit as st
import pandas as pd
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("📥 Ingestion Monitor")

client = get_clickhouse_client()

try:
    # Articles per hour
    query = """
        SELECT toStartOfHour(published_at) as hour, count() as count 
        FROM news_articles 
        WHERE published_at >= now() - INTERVAL 24 HOUR 
        GROUP BY hour 
        ORDER BY hour
    """
    data = client.execute(query)
    df = pd.DataFrame(data, columns=['Hour', 'Articles'])
    
    st.subheader("Ingestion Rate (Last 24 Hours)")
    if not df.empty:
        fig = px.area(df, x='Hour', y='Articles', title="Articles Ingested per Hour")
        fig.update_layout(plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='white')
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.info("No ingestion data for the last 24 hours.")
        
    # Total stats
    total = client.execute("SELECT count() FROM news_articles")[0][0]
    st.metric("Total Articles Ingested", total)

except Exception as e:
    st.error(f"Error fetching ingestion stats: {e}")
