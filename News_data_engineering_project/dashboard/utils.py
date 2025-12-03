import streamlit as st
from clickhouse_driver import Client
from neo4j import GraphDatabase
import os

def apply_style():
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

    .stApp {
      background: linear-gradient(135deg, #000000 0%, #0b0b0c 50%, #1a1a1a 100%) !important;
      color: #ffffff;
      font-family: 'Montserrat', sans-serif;
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
    
    h1, h2, h3 {
      font-weight: 700 !important;
    }
    </style>
    """, unsafe_allow_html=True)

def get_clickhouse_client():
    return Client(host='clickhouse')

def get_neo4j_driver():
    return GraphDatabase.driver("bolt://neo4j:7687", auth=("neo4j", "password"))
