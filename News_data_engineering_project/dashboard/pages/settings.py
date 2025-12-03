import streamlit as st
import json
import os

# Path to the shared configuration file
CONFIG_PATH = "/app/shared_config/settings.json"

def load_settings():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {
        "refresh_interval": "30 seconds",
        "max_articles": 100,
        "sentiment_threshold": 0.5,
        "enable_alerts": True,
        "active_categories": ["Technology", "Business", "Sports", "Health", "Politics"]
    }

def save_settings(settings):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(settings, f, indent=4)

# st.set_page_config(page_title="Settings", layout="wide")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.stApp {
  background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
}

.settings-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem 0;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #ff6b6b, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 2rem;
}

.stDeployButton { display: none !important; }
#MainMenu { visibility: hidden !important; }
footer { visibility: hidden !important; }
header { visibility: hidden !important; }
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="section-title">⚙️ SYSTEM SETTINGS</h1>', unsafe_allow_html=True)

# Load current settings
current_settings = load_settings()

# Pipeline Configuration
st.markdown('<div class="settings-card">', unsafe_allow_html=True)
st.markdown("### 🔧 Pipeline Configuration")

col1, col2 = st.columns(2)

with col1:
    refresh_options = ["30 seconds", "1 minute", "5 minutes"]
    try:
        refresh_index = refresh_options.index(current_settings.get("refresh_interval", "30 seconds"))
    except ValueError:
        refresh_index = 0
        
    refresh_interval = st.selectbox("Dashboard Refresh", refresh_options, index=refresh_index)
    max_articles = st.number_input("Max Articles per Run", min_value=50, max_value=500, value=current_settings.get("max_articles", 100))
    
with col2:
    sentiment_threshold = st.slider("Sentiment Alert Threshold", -1.0, 1.0, float(current_settings.get("sentiment_threshold", 0.5)))
    enable_alerts = st.checkbox("Enable Real-time Alerts", value=current_settings.get("enable_alerts", True))

st.markdown('</div>', unsafe_allow_html=True)

# Data Sources
st.markdown('<div class="settings-card">', unsafe_allow_html=True)
st.markdown("### 📡 Data Sources")

categories = st.multiselect(
    "Active Categories",
    ["Technology", "Business", "Sports", "Health", "Politics", "Science", "Entertainment", "World"],
    default=current_settings.get("active_categories", ["Technology", "Business", "Sports", "Health", "Politics"])
)

st.markdown('</div>', unsafe_allow_html=True)

# System Status
st.markdown('<div class="settings-card">', unsafe_allow_html=True)
st.markdown("### 📊 System Status")

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("ClickHouse", "🟢 Connected", "99.9% uptime")

with col2:
    st.metric("Neo4j", "🟢 Connected", "Active")

with col3:
    st.metric("Dagster", "🟢 Running", "Last run: 2 min ago")

st.markdown('</div>', unsafe_allow_html=True)

if st.button("💾 Save Settings", type="primary"):
    new_settings = {
        "refresh_interval": refresh_interval,
        "max_articles": max_articles,
        "sentiment_threshold": sentiment_threshold,
        "enable_alerts": enable_alerts,
        "active_categories": categories
    }
    save_settings(new_settings)
    st.success("Settings saved successfully!")
    st.balloons()