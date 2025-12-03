import streamlit as st
import pandas as pd
from clickhouse_driver import Client
import plotly.graph_objects as go
import plotly.express as px
import numpy as np
from datetime import datetime, timedelta
import networkx as nx

# st.set_page_config(page_title="Analytics", layout="wide")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.stApp {
  background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
}

.analytics-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin: 1rem 0;
  position: relative;
  overflow: hidden;
}

.analytics-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,150,255,0.1), transparent);
  transition: left 0.6s ease;
}

.analytics-card:hover::before {
  left: 100%;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(45deg, #00d4ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 2rem;
}

.metric-big {
  font-size: 3rem;
  font-weight: 900;
  color: #00d4ff;
  text-align: center;
}

.stDeployButton { display: none !important; }
#MainMenu { visibility: hidden !important; }
footer { visibility: hidden !important; }
header { visibility: hidden !important; }
</style>
""", unsafe_allow_html=True)

st.markdown('<h1 class="section-title">🔬 ADVANCED ANALYTICS</h1>', unsafe_allow_html=True)

@st.cache_resource
def get_clickhouse_client():
    return Client(host='clickhouse')

try:
    client = get_clickhouse_client()
    
    # Advanced Metrics
    st.markdown('<h2 class="section-title">📈 INTELLIGENCE METRICS</h2>', unsafe_allow_html=True)
    
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        total_articles = client.execute("SELECT count() FROM news_articles")[0][0]
        st.markdown(f'<div class="analytics-card"><div class="metric-big">{total_articles:,}</div><p style="text-align:center; color:#888;">Total Articles</p></div>', unsafe_allow_html=True)
    
    with col2:
        avg_sentiment = client.execute("SELECT avg(sentiment) FROM news_articles")[0][0] or 0
        st.markdown(f'<div class="analytics-card"><div class="metric-big">{avg_sentiment:.3f}</div><p style="text-align:center; color:#888;">Global Sentiment</p></div>', unsafe_allow_html=True)
    
    with col3:
        unique_topics = client.execute("SELECT count(DISTINCT topic_id) FROM news_articles WHERE topic_id >= 0")[0][0]
        st.markdown(f'<div class="analytics-card"><div class="metric-big">{unique_topics}</div><p style="text-align:center; color:#888;">Unique Topics</p></div>', unsafe_allow_html=True)
    
    with col4:
        coverage_score = min(100, (total_articles / 1000) * 100)
        st.markdown(f'<div class="analytics-card"><div class="metric-big">{coverage_score:.1f}%</div><p style="text-align:center; color:#888;">Coverage Score</p></div>', unsafe_allow_html=True)
    
    # Correlation Analysis
    st.markdown('<h2 class="section-title">🔗 CORRELATION MATRIX</h2>', unsafe_allow_html=True)
    
    correlation_data = client.execute("""
        SELECT category, avg(sentiment) as avg_sentiment, count() as article_count
        FROM news_articles 
        GROUP BY category
    """)
    
    if correlation_data:
        df_corr = pd.DataFrame(correlation_data, columns=['Category', 'Sentiment', 'Count'])
        
        # Create correlation heatmap
        corr_matrix = df_corr[['Sentiment', 'Count']].corr()
        
        fig_corr = go.Figure(data=go.Heatmap(
            z=corr_matrix.values,
            x=corr_matrix.columns,
            y=corr_matrix.index,
            colorscale='RdBu',
            zmid=0
        ))
        
        fig_corr.update_layout(
            height=400,
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='white'),
            title="Sentiment-Volume Correlation"
        )
        
        st.plotly_chart(fig_corr, use_container_width=True)
    
    # Predictive Analytics
    st.markdown('<h2 class="section-title">🔮 PREDICTIVE INSIGHTS</h2>', unsafe_allow_html=True)
    
    pred_col1, pred_col2 = st.columns(2)
    
    with pred_col1:
        # Sentiment forecast
        sentiment_trend = client.execute("""
            SELECT toStartOfDay(published_at) as date, avg(sentiment) as sentiment
            FROM news_articles 
            WHERE published_at >= now() - INTERVAL 7 DAY
            GROUP BY date 
            ORDER BY date
        """)
        
        if sentiment_trend:
            df_sentiment = pd.DataFrame(sentiment_trend, columns=['Date', 'Sentiment'])
            
            # Simple linear prediction
            x = np.arange(len(df_sentiment))
            y = df_sentiment['Sentiment'].values
            z = np.polyfit(x, y, 1)
            p = np.poly1d(z)
            
            # Predict next 3 days
            future_x = np.arange(len(df_sentiment), len(df_sentiment) + 3)
            future_y = p(future_x)
            
            fig_pred = go.Figure()
            
            fig_pred.add_trace(go.Scatter(
                x=df_sentiment['Date'],
                y=df_sentiment['Sentiment'],
                mode='lines+markers',
                name='Historical',
                line=dict(color='#00d4ff')
            ))
            
            future_dates = [df_sentiment['Date'].iloc[-1] + timedelta(days=i+1) for i in range(3)]
            fig_pred.add_trace(go.Scatter(
                x=future_dates,
                y=future_y,
                mode='lines+markers',
                name='Predicted',
                line=dict(color='#ff6b6b', dash='dash')
            ))
            
            fig_pred.update_layout(
                title="Sentiment Forecast",
                height=400,
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white')
            )
            
            st.plotly_chart(fig_pred, use_container_width=True)
    
    with pred_col2:
        # Volume prediction
        volume_trend = client.execute("""
            SELECT toStartOfDay(published_at) as date, count() as count
            FROM news_articles 
            WHERE published_at >= now() - INTERVAL 7 DAY
            GROUP BY date 
            ORDER BY date
        """)
        
        if volume_trend:
            df_volume = pd.DataFrame(volume_trend, columns=['Date', 'Count'])
            
            fig_volume = go.Figure()
            
            fig_volume.add_trace(go.Bar(
                x=df_volume['Date'],
                y=df_volume['Count'],
                marker_color='#00ff88',
                name='Daily Volume'
            ))
            
            fig_volume.update_layout(
                title="Volume Trend",
                height=400,
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white')
            )
            
            st.plotly_chart(fig_volume, use_container_width=True)

except Exception as e:
    st.error(f"Could not connect to ClickHouse: {e}")
    st.markdown('<h2 class="section-title">🚀 DEMO ANALYTICS</h2>', unsafe_allow_html=True)
    st.info("Advanced analytics available with live data connection")