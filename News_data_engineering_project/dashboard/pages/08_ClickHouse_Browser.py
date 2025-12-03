import streamlit as st
import pandas as pd
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("🗄️ ClickHouse Browser")

client = get_clickhouse_client()

query = st.text_area("Enter SQL Query", "SELECT * FROM news_articles LIMIT 10", height=150)

if st.button("Run Query"):
    try:
        data = client.execute(query)
        if data:
            st.success(f"Returned {len(data)} rows.")
            st.dataframe(pd.DataFrame(data), use_container_width=True)
        else:
            st.info("Query returned no results.")
    except Exception as e:
        st.error(f"Query Error: {e}")
