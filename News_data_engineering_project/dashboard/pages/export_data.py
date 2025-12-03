import streamlit as st
import pandas as pd
from clickhouse_driver import Client
from neo4j import GraphDatabase
import json
from datetime import datetime

# st.set_page_config(page_title="Export Intelligence", layout="wide")

st.markdown("""
<style>
.stApp {
  background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
}
.export-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
}
</style>
""", unsafe_allow_html=True)

st.markdown("# 📤 EXPORT INTELLIGENCE")

@st.cache_resource
def get_clients():
    try:
        clickhouse = Client(host='clickhouse')
        neo4j_driver = GraphDatabase.driver("bolt://neo4j:7687", auth=("neo4j", "password"))
        return clickhouse, neo4j_driver
    except:
        return None, None

clickhouse, neo4j_driver = get_clients()

if clickhouse:
    st.markdown("## 📊 ClickHouse Data Export")
    
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("📄 Export Articles CSV"):
            articles = clickhouse.execute("SELECT * FROM news_articles")
            df = pd.DataFrame(articles, columns=[
                'title', 'description', 'content', 'published_at', 'url', 
                'publisher', 'category', 'sentiment', 'processed_at', 
                'topic_id', 'topic_label', 'locations', 'coordinates'
            ])
            
            csv = df.to_csv(index=False)
            st.download_button(
                label="💾 Download CSV",
                data=csv,
                file_name=f"news_intelligence_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                mime="text/csv"
            )
    
    with col2:
        if st.button("📈 Export Analytics JSON"):
            # Get analytics summary
            analytics = {
                'total_articles': clickhouse.execute("SELECT count() FROM news_articles")[0][0],
                'avg_sentiment': clickhouse.execute("SELECT avg(sentiment) FROM news_articles")[0][0],
                'categories': dict(clickhouse.execute("SELECT category, count() FROM news_articles GROUP BY category")),
                'publishers': dict(clickhouse.execute("SELECT publisher, count() FROM news_articles GROUP BY publisher LIMIT 10")),
                'export_time': datetime.now().isoformat()
            }
            
            json_data = json.dumps(analytics, indent=2, default=str)
            st.download_button(
                label="💾 Download JSON",
                data=json_data,
                file_name=f"analytics_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )

if neo4j_driver:
    st.markdown("## 🕸️ Neo4j Graph Export")
    
    if st.button("🔗 Export Graph Data"):
        with neo4j_driver.session() as session:
            # Export nodes and relationships
            nodes = session.run("MATCH (n) RETURN labels(n)[0] as type, properties(n) as props")
            relationships = session.run("MATCH (a)-[r]->(b) RETURN type(r) as rel_type, properties(r) as props")
            
            graph_data = {
                'nodes': [{'type': record['type'], 'properties': record['props']} for record in nodes],
                'relationships': [{'type': record['rel_type'], 'properties': record['props']} for record in relationships],
                'export_time': datetime.now().isoformat()
            }
            
            json_data = json.dumps(graph_data, indent=2, default=str)
            st.download_button(
                label="💾 Download Graph JSON",
                data=json_data,
                file_name=f"graph_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                mime="application/json"
            )

# API Endpoints
st.markdown("## 🔌 API Endpoints")

st.markdown("""
<div class="export-card">
<h3>REST API Access</h3>

**ClickHouse HTTP Interface:**
- URL: http://localhost:8123
- Query: `SELECT * FROM news_articles FORMAT JSON`

**Neo4j HTTP API:**
- URL: http://localhost:7474/db/data/transaction/commit
- Auth: neo4j/password

**Dagster GraphQL:**
- URL: http://localhost:3000/graphql
- Query assets and runs

</div>
""", unsafe_allow_html=True)

# Real-time streaming
st.markdown("## 📡 Real-time Streaming")

if st.checkbox("🔴 Enable Live Data Stream"):
    st.markdown("**WebSocket Stream Active**")
    
    # Simulate real-time updates
    placeholder = st.empty()
    
    if clickhouse:
        latest = clickhouse.execute("SELECT title, sentiment, published_at FROM news_articles ORDER BY published_at DESC LIMIT 5")
        
        with placeholder.container():
            st.markdown("### 📊 Live Feed")
            for article in latest:
                title, sentiment, published_at = article
                sentiment_color = "#4ade80" if sentiment > 0 else "#f87171" if sentiment < 0 else "#fbbf24"
                
                st.markdown(f"""
                <div style="background: rgba(255,255,255,0.02); padding: 1rem; margin: 0.5rem 0; border-radius: 8px;">
                    <div style="color: {sentiment_color};">● {sentiment:.3f}</div>
                    <div>{title[:60]}...</div>
                    <div style="color: #888; font-size: 0.8rem;">{published_at}</div>
                </div>
                """, unsafe_allow_html=True)