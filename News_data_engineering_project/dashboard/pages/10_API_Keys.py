import streamlit as st
import json
import os
from utils import apply_style

apply_style()

st.title("🔑 API Keys")

CONFIG_PATH = "/app/shared_config/settings.json"

def load_settings():
    if os.path.exists(CONFIG_PATH):
        with open(CONFIG_PATH, "r") as f:
            return json.load(f)
    return {}

def save_settings(settings):
    os.makedirs(os.path.dirname(CONFIG_PATH), exist_ok=True)
    with open(CONFIG_PATH, "w") as f:
        json.dump(settings, f, indent=4)

settings = load_settings()

st.info("Manage your external API keys here. These are stored securely in the shared configuration.")

with st.form("api_keys_form"):
    openai_key = st.text_input("OpenAI API Key", value=settings.get("openai_api_key", ""), type="password")
    newsapi_key = st.text_input("NewsAPI Key", value=settings.get("newsapi_key", ""), type="password")
    
    submitted = st.form_submit_button("Save Keys")
    if submitted:
        settings["openai_api_key"] = openai_key
        settings["newsapi_key"] = newsapi_key
        save_settings(settings)
        st.success("API Keys saved!")
