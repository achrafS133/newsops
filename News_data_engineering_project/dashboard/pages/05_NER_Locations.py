import streamlit as st
import pandas as pd
import plotly.express as px
from utils import apply_style, get_clickhouse_client

apply_style()

st.title("📍 NER & Locations")

client = get_clickhouse_client()

try:
    # Fetch locations and coordinates
    # Use arrayZip to safely handle potential length mismatches (it truncates to the shorter array)
    query = """
        SELECT 
            tupleElement(zipped, 1) as loc, 
            tupleElement(zipped, 2) as coord,
            count() as mentions
        FROM (
            SELECT arrayZip(locations, coordinates) as zipped
            FROM news_articles
        )
        ARRAY JOIN zipped
        GROUP BY loc, coord
        ORDER BY mentions DESC
        LIMIT 100
    """
    
    data = client.execute(query)
    # coord is a tuple (lat, lon)
    
    if data:
        df = pd.DataFrame(data, columns=['Location', 'Coordinates', 'Mentions'])
        df['lat'] = df['Coordinates'].apply(lambda x: x[0])
        df['lon'] = df['Coordinates'].apply(lambda x: x[1])
        
        st.subheader("Global News Coverage")
        st.map(df, latitude='lat', longitude='lon', size='Mentions', color='#ff4b4b')
        
        st.subheader("Top Mentioned Locations")
        st.dataframe(df[['Location', 'Mentions']].head(10), use_container_width=True)
    else:
        st.info("No location data available yet.")

except Exception as e:
    st.error(f"Error fetching location data: {e}")
