import streamlit as st
import pandas as pd
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("📝 Processing Logs")

client = get_clickhouse_client()

try:
    # Check if we have a logs table, otherwise show system query log
    st.info("Showing recent ClickHouse query logs as a proxy for processing logs.")
    
    query = """
        SELECT event_time, query_duration_ms, read_rows, query 
        FROM system.query_log 
        WHERE type = 'QueryFinish' 
        ORDER BY event_time DESC 
        LIMIT 50
    """
    data = client.execute(query)
    df = pd.DataFrame(data, columns=['Time', 'Duration (ms)', 'Read Rows', 'Query'])
    
    st.dataframe(df, use_container_width=True)

except Exception as e:
    st.error(f"Error fetching logs: {e}")
