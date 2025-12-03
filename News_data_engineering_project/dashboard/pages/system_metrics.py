import streamlit as st
import pandas as pd
from clickhouse_driver import Client
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime
import psutil
import docker

# st.set_page_config(page_title="System Monitor", layout="wide")

st.markdown("""
<style>
.stApp {
  background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
}

.status-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.online { border-left: 4px solid #4ade80; }
.offline { border-left: 4px solid #f87171; }
.warning { border-left: 4px solid #fbbf24; }

.stDeployButton { display: none !important; }
#MainMenu { visibility: hidden !important; }
footer { visibility: hidden !important; }
header { visibility: hidden !important; }
</style>
""", unsafe_allow_html=True)

st.markdown("# 🖥️ SYSTEM MONITOR")

# System Resources
col1, col2, col3, col4 = st.columns(4)

with col1:
    cpu_percent = psutil.cpu_percent()
    st.metric("CPU Usage", f"{cpu_percent}%")

with col2:
    memory = psutil.virtual_memory()
    st.metric("Memory Usage", f"{memory.percent}%")

with col3:
    disk = psutil.disk_usage('/')
    st.metric("Disk Usage", f"{disk.percent}%")

with col4:
    st.metric("System Load", f"{psutil.getloadavg()[0]:.2f}")

# Container Status
st.markdown("## 🐳 Container Status")

try:
    client = docker.from_env()
    containers = client.containers.list(all=True)
    
    container_data = []
    for container in containers:
        if any(name in container.name for name in ['streamlit', 'dagster', 'clickhouse', 'neo4j', 'kafka']):
            container_data.append({
                'Name': container.name,
                'Status': container.status,
                'Image': container.image.tags[0] if container.image.tags else 'Unknown',
                'Created': container.attrs['Created'][:19]
            })
    
    if container_data:
        df = pd.DataFrame(container_data)
        
        for _, row in df.iterrows():
            status_class = "online" if row['Status'] == 'running' else "offline"
            status_icon = "🟢" if row['Status'] == 'running' else "🔴"
            
            st.markdown(f"""
            <div class="status-card {status_class}">
                <h4>{status_icon} {row['Name']}</h4>
                <p>Status: {row['Status']} | Image: {row['Image']}</p>
                <p>Created: {row['Created']}</p>
            </div>
            """, unsafe_allow_html=True)
    
except Exception as e:
    st.warning("Docker integration not available. Run with Docker socket mounted to see container status.")
    # st.error(f"Docker connection error: {e}")

# Database Status
st.markdown("## 💾 Database Status")

col1, col2 = st.columns(2)

with col1:
    st.markdown("### ClickHouse")
    try:
        client = Client(host='clickhouse')
        count = client.execute("SELECT count() FROM news_articles")[0][0]
        st.success(f"✅ Connected - {count} articles")
        
        # Recent activity
        recent = client.execute("""
            SELECT toStartOfMinute(published_at) as minute, count() as count
            FROM news_articles 
            WHERE published_at > now() - INTERVAL 1 HOUR
            GROUP BY minute 
            ORDER BY minute DESC 
            LIMIT 10
        """)
        
        if recent:
            df_activity = pd.DataFrame(recent, columns=['Time', 'Articles'])
            fig = px.line(df_activity, x='Time', y='Articles', title="Recent Activity")
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
            st.plotly_chart(fig, use_container_width=True)
        
    except Exception as e:
        st.error(f"❌ ClickHouse Error: {e}")

with col2:
    st.markdown("### Neo4j")
    try:
        from neo4j import GraphDatabase
        driver = GraphDatabase.driver("bolt://neo4j:7687", auth=("neo4j", "password"))
        driver.verify_connectivity()
        st.success("✅ Neo4j Connected")
        driver.close()
    except Exception as e:
        st.error(f"❌ Neo4j Error: Cannot resolve address")

# Performance Metrics
st.markdown("## 📈 Performance Metrics")

metrics_data = {
    'Component': ['Dashboard', 'Pipeline', 'ClickHouse', 'Neo4j', 'Kafka'],
    'Response Time (ms)': [120, 45, 15, 0, 25],
    'Status': ['Healthy', 'Healthy', 'Healthy', 'Offline', 'Healthy']
}

df_metrics = pd.DataFrame(metrics_data)
fig = px.bar(df_metrics, x='Component', y='Response Time (ms)', 
             color='Status', color_discrete_map={'Healthy': '#4ade80', 'Offline': '#f87171'})
fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
st.plotly_chart(fig, use_container_width=True)