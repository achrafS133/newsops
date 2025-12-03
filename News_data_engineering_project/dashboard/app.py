import streamlit as st
import pandas as pd
import altair as alt
from clickhouse_driver import Client
import plotly.express as px
from wordcloud import WordCloud
import matplotlib.pyplot as plt
import plotly.graph_objects as go
import numpy as np
from gnews import GNews
from textblob import TextBlob
from datetime import datetime

st.set_page_config(page_title="News Intelligence Dashboard", layout="wide")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

.stApp {
  background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
  color: #ffffff;
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
}

.main .block-container {
  padding: 2rem !important;
  max-width: 100% !important;
}

.metric-card {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  margin: 0.5rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  transition: left 0.6s ease;
}

.metric-card:hover::before {
  left: 100%;
}

.metric-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.big-number {
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(45deg, #00ff88, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #a0a0a0;
  text-transform: uppercase;
  letter-spacing: 1.5px;
}

.section-header {
  font-size: 2.2rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -1px;
  background: linear-gradient(45deg, #ffffff, #64748b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 3rem 0 2rem 0;
  text-align: center;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff88, transparent);
}

.chart-container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 2rem;
  margin: 1rem 0;
  transition: all 0.3s ease;
}

.chart-container:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}

.stDeployButton { display: none !important; }
#MainMenu { visibility: hidden !important; }
footer { visibility: hidden !important; }
header { visibility: hidden !important; }
</style>
""", unsafe_allow_html=True)

st.markdown("""
<div style="text-align: center; padding: 2rem 0;">
    <h1 style="font-size: 3.5rem; font-weight: 900; background: linear-gradient(45deg, #00ff88, #00d4ff, #ffffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">NEWS INTELLIGENCE</h1>
    <p style="color: #64748b; font-size: 1.2rem; font-weight: 500;">Real-time Global Analytics & Insights Platform</p>
</div>
""", unsafe_allow_html=True)

@st.cache_resource
def get_clickhouse_client():
    try:
        return Client(host='clickhouse')
    except:
        return None

client = get_clickhouse_client()

if client:
    try:
        # Key Metrics
        st.markdown('<h2 class="section-header">📈 INTELLIGENCE METRICS</h2>', unsafe_allow_html=True)
        col1, col2, col3, col4 = st.columns(4)
        
        total_articles = client.execute("SELECT count() FROM news_articles")[0][0]
        avg_sentiment = client.execute("SELECT avg(sentiment) FROM news_articles")[0][0] or 0
        unique_sources = client.execute("SELECT count(DISTINCT publisher) FROM news_articles")[0][0]
        unique_topics = client.execute("SELECT count(DISTINCT topic_id) FROM news_articles WHERE topic_id >= 0")[0][0]
        
        with col1:
            st.markdown(f'<div class="metric-card"><div class="big-number">{total_articles:,}</div><div class="metric-label">Total Articles</div></div>', unsafe_allow_html=True)
        with col2:
            st.markdown(f'<div class="metric-card"><div class="big-number">{avg_sentiment:.3f}</div><div class="metric-label">Global Sentiment</div></div>', unsafe_allow_html=True)
        with col3:
            st.markdown(f'<div class="metric-card"><div class="big-number">{unique_sources}</div><div class="metric-label">Active Sources</div></div>', unsafe_allow_html=True)
        with col4:
            st.markdown(f'<div class="metric-card"><div class="big-number">{unique_topics}</div><div class="metric-label">AI Topics</div></div>', unsafe_allow_html=True)

        # Category Breakdown
        st.markdown('<h2 class="section-header">📂 CATEGORY INTELLIGENCE</h2>', unsafe_allow_html=True)
        category_data = client.execute("""
            SELECT category, count() as count, avg(sentiment) as avg_sentiment
            FROM news_articles 
            GROUP BY category 
            ORDER BY count DESC
        """)
        
        if category_data:
            df_cat = pd.DataFrame(category_data, columns=['Category', 'Count', 'Avg Sentiment'])
            
            col1, col2 = st.columns(2)
            with col1:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                fig = px.bar(df_cat, x='Count', y='Category', orientation='h', 
                           color='Avg Sentiment', color_continuous_scale='RdYlGn',
                           title="Articles by Category")
                fig.update_layout(
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    font=dict(color='white')
                )
                st.plotly_chart(fig, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.dataframe(df_cat, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)

        # Word Cloud
        st.markdown('<h2 class="section-header">☁️ AI INSIGHTS CLOUD</h2>', unsafe_allow_html=True)
        text_data = client.execute("SELECT title FROM news_articles LIMIT 100")
        if text_data:
            all_text = ' '.join([row[0] for row in text_data if row[0]])
            wordcloud = WordCloud(width=800, height=400, background_color='white').generate(all_text)
            
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            fig, ax = plt.subplots(figsize=(10, 5))
            fig.patch.set_facecolor('none')
            ax.imshow(wordcloud, interpolation='bilinear')
            ax.axis('off')
            st.pyplot(fig)
            st.markdown('</div>', unsafe_allow_html=True)

        # Topic Distribution
        st.markdown('<h2 class="section-header">📊 NEURAL TOPIC ANALYSIS</h2>', unsafe_allow_html=True)
        topic_data = client.execute("""
            SELECT topic_label, count() as count 
            FROM news_articles 
            WHERE topic_id >= 0 AND topic_label IS NOT NULL
            GROUP BY topic_label 
            ORDER BY count DESC 
            LIMIT 10
        """)
        
        if topic_data:
            df_topics = pd.DataFrame(topic_data, columns=['Topic', 'Count'])
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            fig = px.bar(df_topics, x='Count', y='Topic', orientation='h',
                        title="Top 10 AI-Discovered Topics", color='Count',
                        color_continuous_scale='Viridis')
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white')
            )
            st.plotly_chart(fig, use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

        # Sentiment Trend
        st.markdown('<h2 class="section-header">📈 SENTIMENT INTELLIGENCE</h2>', unsafe_allow_html=True)
        trend_data = client.execute("""
            SELECT toStartOfHour(published_at) as hour, avg(sentiment) as sentiment
            FROM news_articles 
            GROUP BY hour 
            ORDER BY hour
        """)
        
        if trend_data:
            df_trend = pd.DataFrame(trend_data, columns=['Hour', 'Sentiment'])
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            fig = px.line(df_trend, x='Hour', y='Sentiment', 
                         title="Real-time Sentiment Analysis")
            fig.update_traces(line_color='#00ff88', line_width=3)
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                font=dict(color='white')
            )
            st.plotly_chart(fig, use_container_width=True)
            st.markdown('</div>', unsafe_allow_html=True)

        # Geographic Heatmap
        st.markdown('<h2 class="section-header">🌍 GEOGRAPHIC HEATMAP</h2>', unsafe_allow_html=True)
        
        geo_data = client.execute("""
            SELECT locations, coordinates, count() as count
            FROM news_articles 
            WHERE length(locations) > 0
            GROUP BY locations, coordinates
            ORDER BY count DESC
            LIMIT 50
        """)
        
        if geo_data:
            map_data = []
            for row in geo_data:
                if row[1]:
                    for coord in row[1]:
                        if len(coord) == 2:
                            map_data.append({
                                'lat': coord[0],
                                'lon': coord[1], 
                                'count': row[2],
                                'location': ', '.join(row[0]) if row[0] else 'Unknown'
                            })
            
            if map_data:
                df_map = pd.DataFrame(map_data)
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                
                fig_map = go.Figure(data=go.Scattergeo(
                    lon=df_map['lon'],
                    lat=df_map['lat'],
                    text=df_map['location'],
                    mode='markers',
                    marker=dict(
                        size=df_map['count']*2,
                        color=df_map['count'],
                        colorscale='Viridis',
                        showscale=True,
                        colorbar=dict(title="News Count"),
                        line=dict(width=1, color='white')
                    )
                ))
                
                fig_map.update_layout(
                    geo=dict(
                        projection_type='natural earth',
                        showland=True,
                        landcolor='rgb(243, 243, 243)',
                        coastlinecolor='rgb(204, 204, 204)',
                        bgcolor='rgba(0,0,0,0)'
                    ),
                    height=500,
                    paper_bgcolor='rgba(0,0,0,0)',
                    plot_bgcolor='rgba(0,0,0,0)',
                    font=dict(color='white'),
                    title="Global News Coverage Heatmap"
                )
                
                st.plotly_chart(fig_map, use_container_width=True)
                st.markdown('</div>', unsafe_allow_html=True)
        
        # Entity Network (ClickHouse-based)
        st.markdown('<h2 class="section-header">🕸️ ENTITY NETWORK</h2>', unsafe_allow_html=True)
        
        network_data = client.execute("""
            SELECT title, locations, sentiment, category
            FROM news_articles 
            WHERE length(locations) > 0
            LIMIT 20
        """)
        
        if network_data:
            col_net1, col_net2 = st.columns(2)
            
            with col_net1:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown("### Article-Location Network")
                
                import networkx as nx
                G = nx.Graph()
                
                for row in network_data:
                    title = row[0][:20] + '...' if len(row[0]) > 20 else row[0]
                    locations = row[1] if row[1] else []
                    sentiment = row[2]
                    
                    for location in locations[:2]:
                        G.add_edge(title, location, weight=abs(sentiment))
                
                if G.nodes():
                    pos = nx.spring_layout(G, k=1, iterations=30)
                    
                    edge_x, edge_y = [], []
                    for edge in G.edges():
                        x0, y0 = pos[edge[0]]
                        x1, y1 = pos[edge[1]]
                        edge_x.extend([x0, x1, None])
                        edge_y.extend([y0, y1, None])
                    
                    node_x = [pos[node][0] for node in G.nodes()]
                    node_y = [pos[node][1] for node in G.nodes()]
                    node_text = list(G.nodes())
                    
                    fig_network = go.Figure(data=[
                        go.Scatter(x=edge_x, y=edge_y, mode='lines', line=dict(width=1, color='rgba(125,125,125,0.5)'), hoverinfo='none'),
                        go.Scatter(x=node_x, y=node_y, mode='markers+text', text=node_text, textposition="middle center",
                                 marker=dict(size=8, color='#00ff88'), hoverinfo='text', textfont=dict(size=8))
                    ])
                    
                    fig_network.update_layout(
                        showlegend=False,
                        height=400,
                        paper_bgcolor='rgba(0,0,0,0)',
                        plot_bgcolor='rgba(0,0,0,0)',
                        font=dict(color='white'),
                        xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                        yaxis=dict(showgrid=False, zeroline=False, showticklabels=False)
                    )
                    
                    st.plotly_chart(fig_network, use_container_width=True)
                else:
                    st.info("No network relationships found")
                
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col_net2:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown("### Location Stats")
                
                all_locations = []
                for row in network_data:
                    if row[1]:
                        all_locations.extend(row[1])
                
                if all_locations:
                    from collections import Counter
                    location_counts = Counter(all_locations).most_common(8)
                    
                    if location_counts:
                        df_loc = pd.DataFrame(location_counts, columns=['Location', 'Count'])
                        fig_loc = px.bar(df_loc, x='Count', y='Location', orientation='h',
                                       title="Most Mentioned Locations")
                        fig_loc.update_layout(
                            height=400,
                            paper_bgcolor='rgba(0,0,0,0)',
                            plot_bgcolor='rgba(0,0,0,0)',
                            font=dict(color='white')
                        )
                        st.plotly_chart(fig_loc, use_container_width=True)
                    else:
                        st.info("No location data available")
                else:
                    st.info("No location mentions found")
                
                st.markdown('</div>', unsafe_allow_html=True)
        
        else:
            st.markdown('<div class="chart-container">', unsafe_allow_html=True)
            st.info("No network data available. Run the pipeline to populate location data.")
            st.markdown('</div>', unsafe_allow_html=True)

        # Enhanced Article Feed
        st.markdown('<h2 class="section-header">📰 LIVE ARTICLE FEED</h2>', unsafe_allow_html=True)
        
        col_toggle1, col_toggle2 = st.columns([1, 3])
        with col_toggle1:
            use_gnews = st.checkbox("🔴 LIVE GNews Feed", value=False)
        with col_toggle2:
            if use_gnews:
                st.markdown('<span style="color: #ef4444; font-size: 0.9rem;">⚡ Fetching real-time news...</span>', unsafe_allow_html=True)
        
        if use_gnews:
            @st.cache_data(ttl=300)
            def fetch_live_news():
                google_news = GNews(language='en', country='US', period='1h', max_results=10)
                categories = ['Technology', 'Business', 'Sports', 'Health', 'Politics']
                live_articles = []
                
                for category in categories[:3]:
                    try:
                        news = google_news.get_news(category)
                        for article in news[:4]:
                            sentiment = TextBlob(article.get('title', '')).sentiment.polarity
                            live_articles.append({
                                'Title': article.get('title', 'No Title'),
                                'Publisher': article.get('publisher', {}).get('title', 'Unknown'),
                                'Category': category,
                                'Sentiment': sentiment,
                                'Published': datetime.now(),
                                'Topic': 'Live Feed',
                                'Locations': []
                            })
                    except Exception as e:
                        st.warning(f"GNews error for {category}: {e}")
                
                return pd.DataFrame(live_articles)
            
            df_articles = fetch_live_news()
        else:
            articles_data = client.execute("""
                SELECT title, publisher, category, sentiment, published_at, topic_label, locations
                FROM news_articles 
                ORDER BY published_at DESC 
                LIMIT 20
            """)
            
            if articles_data:
                df_articles = pd.DataFrame(articles_data, columns=[
                    'Title', 'Publisher', 'Category', 'Sentiment', 'Published', 'Topic', 'Locations'
                ])
            else:
                df_articles = pd.DataFrame()
            
            # Get publisher stats from ClickHouse
            try:
                publisher_stats = client.execute("""
                    SELECT publisher, count() as article_count
                    FROM news_articles 
                    WHERE publisher IS NOT NULL AND publisher != ''
                    GROUP BY publisher
                    ORDER BY article_count DESC
                    LIMIT 10
                """)
                publisher_data = {row[0]: row[1] for row in publisher_stats}
            except:
                publisher_data = {}
            
            col1, col2 = st.columns([2, 1])
            
            with col1:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown("### 🔥 Latest Intelligence")
                
                for idx, article in df_articles.head(10).iterrows():
                    sentiment_color = "#4ade80" if article['Sentiment'] > 0.1 else "#f87171" if article['Sentiment'] < -0.1 else "#fbbf24"
                    sentiment_icon = "🟢" if article['Sentiment'] > 0.1 else "🔴" if article['Sentiment'] < -0.1 else "🟡"
                    
                    pub_count = publisher_data.get(article['Publisher'], 0)
                    
                    st.markdown(f"""
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; margin: 1rem 0; transition: all 0.3s ease;">
                        <div style="font-size: 1.1rem; font-weight: 600; color: #ffffff; margin-bottom: 0.8rem; line-height: 1.4;">
                            {article['Title'][:100]}{'...' if len(article['Title']) > 100 else ''}
                        </div>
                        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 0.5rem;">
                            <span style="color: #00ff88; font-family: 'Courier New', monospace; font-weight: 600;">{article['Publisher']}</span>
                            <span style="color: #64748b; font-size: 0.9rem;">{article['Category']}</span>
                            <span style="color: {sentiment_color}; font-weight: 600;">{sentiment_icon} {article['Sentiment']:.3f}</span>
                        </div>
                        <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: #888;">
                            <span>📊 Publisher: {pub_count} articles</span>
                            <span>🏷️ {article['Topic'] if article['Topic'] else 'Uncategorized'}</span>
                            <span>📍 {len(article['Locations']) if article['Locations'] else 0} locations</span>
                        </div>
                    </div>
                    """, unsafe_allow_html=True)
                
                st.markdown('</div>', unsafe_allow_html=True)
            
            with col2:
                st.markdown('<div class="chart-container">', unsafe_allow_html=True)
                st.markdown("### 🌐 Publisher Network")
                
                if publisher_data:
                    pub_df = pd.DataFrame(list(publisher_data.items()), columns=['Publisher', 'Articles'])
                    fig = px.bar(pub_df.head(8), x='Articles', y='Publisher', orientation='h',
                               color='Articles', color_continuous_scale='Viridis')
                    fig.update_layout(
                        height=400,
                        paper_bgcolor='rgba(0,0,0,0)',
                        plot_bgcolor='rgba(0,0,0,0)',
                        font=dict(color='white', size=10),
                        showlegend=False
                    )
                    st.plotly_chart(fig, use_container_width=True)
                else:
                    st.info("Publisher data loading...")
                
                st.markdown('</div>', unsafe_allow_html=True)
            
            data_source = "GNews Live" if use_gnews else "ClickHouse DB"
            source_color = "#ef4444" if use_gnews else "#00ff88"
            
            # Get Neo4j publisher count
            neo4j_count = 0
            neo4j_color = "#ff6b6b"
            try:
                from neo4j import GraphDatabase
                driver = GraphDatabase.driver("bolt://neo4j:7687", auth=("neo4j", "password"))
                with driver.session() as session:
                    result = session.run("MATCH (p:Publisher) RETURN count(p) as count")
                    neo4j_count = result.single()["count"]
                    neo4j_color = "#00ff88" if neo4j_count > 0 else "#ff6b6b"
                driver.close()
            except:
                neo4j_count = 0
            
            st.markdown(f"""
            <div style="display: flex; gap: 1rem; justify-content: center; margin: 2rem 0;">
                <div style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.9rem;">
                    <span style="color: {source_color};">●</span> {data_source}: {len(df_articles)} articles
                </div>
                <div style="background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.9rem;">
                    <span style="color: {neo4j_color};">●</span> Neo4j: {neo4j_count} publishers
                </div>
                <div style="background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.9rem;">
                    <span style="color: #ff6b6b;">●</span> {'LIVE' if use_gnews else 'STORED'} Mode
                </div>
            </div>
            """, unsafe_allow_html=True)

    except Exception as e:
        st.error(f"Database error: {e}")
        st.info("Showing demo mode - Connect to ClickHouse for live data")

else:
    st.warning("⚠️ ClickHouse not connected - Showing demo mode")
    
    # Demo metrics
    st.markdown('<h2 class="section-header">🚀 DEMO INTELLIGENCE</h2>', unsafe_allow_html=True)
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown('<div class="metric-card"><div class="big-number">1,247</div><div class="metric-label">Total Articles</div></div>', unsafe_allow_html=True)
    with col2:
        st.markdown('<div class="metric-card"><div class="big-number">0.342</div><div class="metric-label">Global Sentiment</div></div>', unsafe_allow_html=True)
    with col3:
        st.markdown('<div class="metric-card"><div class="big-number">127</div><div class="metric-label">Active Sources</div></div>', unsafe_allow_html=True)
    with col4:
        st.markdown('<div class="metric-card"><div class="big-number">89</div><div class="metric-label">AI Topics</div></div>', unsafe_allow_html=True)
    
    st.info("Connect to ClickHouse to see live data and visualizations")