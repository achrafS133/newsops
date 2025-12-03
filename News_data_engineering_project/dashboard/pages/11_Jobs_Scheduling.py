import streamlit as st
from utils import apply_style

apply_style()

st.title("📅 Jobs & Scheduling")

st.markdown("""
<div class="metric-card">
    <h3>Dagster Orchestration</h3>
    <p>Manage your pipelines, schedules, and sensors in the Dagster UI.</p>
    <a href="http://localhost:3000" target="_blank" style="
        display: inline-block;
        padding: 0.5rem 1rem;
        background: #00d4ff;
        color: black;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
        margin-top: 1rem;
    ">Open Dagster UI 🚀</a>
</div>
""", unsafe_allow_html=True)

st.subheader("Active Schedules")
st.info("Fetching schedule status from Dagster... (Mock Data)")

st.table([
    {"Job": "news_pipeline", "Schedule": "Every 15 minutes", "Status": "🟢 Active", "Last Run": "2 mins ago"},
    {"Job": "daily_digest", "Schedule": "Daily @ 8:00 AM", "Status": "🟢 Active", "Last Run": "Yesterday"},
    {"Job": "cleanup_logs", "Schedule": "Weekly", "Status": "⚪ Paused", "Last Run": "3 days ago"},
])
