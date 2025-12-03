import streamlit as st
import pandas as pd
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("📰 All Articles")

client = get_clickhouse_client()

try:
    # Filters
    col1, col2 = st.columns(2)
    with col1:
        categories = client.execute("SELECT DISTINCT category FROM news_articles")
        categories = [c[0] for c in categories]
        selected_category = st.multiselect("Filter by Category", categories)
    
    with col2:
        search_term = st.text_input("Search Title")

    # Query Construction
    query = "SELECT title, category, publisher, published_at, sentiment, url FROM news_articles WHERE 1=1"
    params = {}
    
    if selected_category:
        query += " AND category IN %(categories)s"
        params['categories'] = selected_category
    
    if search_term:
        query += " AND title ILIKE %(search)s"
        params['search'] = f"%{search_term}%"
        
    query += " ORDER BY published_at DESC LIMIT 100"
    
    data = client.execute(query, params)
    df = pd.DataFrame(data, columns=['Title', 'Category', 'Publisher', 'Published', 'Sentiment', 'URL'])
    
    st.dataframe(
        df,
        column_config={
            "URL": st.column_config.LinkColumn("Link"),
            "Sentiment": st.column_config.ProgressColumn(
                "Sentiment",
                help="Sentiment score from -1 to 1",
                min_value=-1,
                max_value=1,
                format="%.2f",
            ),
        },
        hide_index=True,
        use_container_width=True
    )

except Exception as e:
    st.error(f"Error fetching articles: {e}")
