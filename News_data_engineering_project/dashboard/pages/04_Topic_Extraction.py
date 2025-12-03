import streamlit as st
import pandas as pd
import plotly.express as px
from utils import apply_style, get_clickhouse_client
from wordcloud import WordCloud
import matplotlib.pyplot as plt

apply_style()

st.title("🔍 Topic Extraction")

client = get_clickhouse_client()

try:
    # Fetch topic labels
    data = client.execute("SELECT topic_label, count() as count FROM news_articles WHERE topic_label != '-1_outlier' GROUP BY topic_label ORDER BY count DESC LIMIT 20")
    df = pd.DataFrame(data, columns=['Topic', 'Count'])
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        st.subheader("Trending Topics")
        fig = px.bar(df, x='Count', y='Topic', orientation='h', title="Top Topics by Article Count", color='Count')
        fig.update_layout(yaxis={'categoryorder':'total ascending'}, plot_bgcolor='rgba(0,0,0,0)', paper_bgcolor='rgba(0,0,0,0)', font_color='white')
        st.plotly_chart(fig, use_container_width=True)
        
    with col2:
        st.subheader("Topic Cloud")
        if not df.empty:
            text = " ".join([f"{row['Topic']} " * row['Count'] for _, row in df.iterrows()])
            wordcloud = WordCloud(width=400, height=400, background_color='black', colormap='viridis').generate(text)
            
            fig_wc, ax = plt.subplots()
            ax.imshow(wordcloud, interpolation='bilinear')
            ax.axis("off")
            st.pyplot(fig_wc)

except Exception as e:
    st.error(f"Error fetching topics: {e}")
