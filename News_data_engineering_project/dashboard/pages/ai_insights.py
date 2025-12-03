import streamlit as st
import pandas as pd
from clickhouse_driver import Client
import plotly.express as px
import plotly.graph_objects as go
from textblob import TextBlob
import numpy as np

# st.set_page_config(page_title="AI Insights", layout="wide")

st.markdown("""
<style>
.stApp {
  background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
}
.insight-card {
  background: linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,212,255,0.1));
  border: 1px solid rgba(0,255,136,0.3);
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem 0;
}
.ai-header {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #00ff88, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 2rem;
}
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="ai-header">🤖 AI INSIGHTS ENGINE</h1>', unsafe_allow_html=True)

@st.cache_resource
def get_client():
    try:
        return Client(host='clickhouse')
    except:
        return None

client = get_client()

if client:
    # AI Sentiment Predictions
    st.markdown("## 🧠 Sentiment Intelligence")
    
    sentiment_data = client.execute("""
        SELECT category, avg(sentiment) as avg_sentiment, count() as articles
        FROM news_articles 
        GROUP BY category
        ORDER BY avg_sentiment DESC
    """)
    
    if sentiment_data:
        df_sentiment = pd.DataFrame(sentiment_data, columns=['Category', 'Sentiment', 'Articles'])
        
        col1, col2 = st.columns(2)
        
        with col1:
            fig = px.scatter(df_sentiment, x='Articles', y='Sentiment', 
                           size='Articles', color='Category',
                           title="Sentiment vs Volume Analysis")
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            # AI Predictions
            st.markdown('<div class="insight-card">', unsafe_allow_html=True)
            st.markdown("### 🔮 AI Predictions")
            
            for _, row in df_sentiment.iterrows():
                trend = "📈 Positive" if row['Sentiment'] > 0.1 else "📉 Negative" if row['Sentiment'] < -0.1 else "➡️ Neutral"
                confidence = min(95, abs(row['Sentiment']) * 100 + 60)
                
                st.markdown(f"""
                **{row['Category']}**: {trend}  
                Confidence: {confidence:.0f}%  
                Volume: {row['Articles']} articles
                """)
            
            st.markdown('</div>', unsafe_allow_html=True)
    
    # Topic Clustering
    st.markdown("## 🎯 Topic Intelligence")
    
    topic_data = client.execute("""
        SELECT topic_label, count() as count, avg(sentiment) as sentiment
        FROM news_articles 
        WHERE topic_label IS NOT NULL
        GROUP BY topic_label
        ORDER BY count DESC
        LIMIT 8
    """)
    
    if topic_data:
        df_topics = pd.DataFrame(topic_data, columns=['Topic', 'Count', 'Sentiment'])
        
        fig = px.treemap(df_topics, path=['Topic'], values='Count',
                        color='Sentiment', color_continuous_scale='RdYlGn',
                        title="AI Topic Clustering")
        fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
        st.plotly_chart(fig, use_container_width=True)
    
    # Anomaly Detection
    st.markdown("## ⚠️ Anomaly Detection")
    
    anomaly_data = client.execute("""
        SELECT title, sentiment, published_at, category
        FROM news_articles 
        WHERE abs(sentiment) > 0.5
        ORDER BY abs(sentiment) DESC
        LIMIT 10
    """)
    
    if anomaly_data:
        st.markdown('<div class="insight-card">', unsafe_allow_html=True)
        st.markdown("### 🚨 Extreme Sentiment Detected")
        
        for article in anomaly_data:
            title, sentiment, published_at, category = article
            alert_type = "🔴 NEGATIVE" if sentiment < -0.5 else "🟢 POSITIVE"
            
            st.markdown(f"""
            **{alert_type}** ({sentiment:.3f})  
            📰 {title[:80]}...  
            📂 {category} | ⏰ {published_at}
            """)
        
        st.markdown('</div>', unsafe_allow_html=True)

else:
    st.error("ClickHouse connection required for AI insights")