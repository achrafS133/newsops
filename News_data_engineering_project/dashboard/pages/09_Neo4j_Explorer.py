import streamlit as st
import pandas as pd
import networkx as nx
import plotly.graph_objects as go
from utils import apply_style, get_neo4j_driver

apply_style()

st.title("🕸️ Neo4j Graph Explorer")

driver = get_neo4j_driver()

query = st.text_area("Enter Cypher Query", "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50", height=100)

if st.button("Visualize Graph"):
    try:
        with driver.session() as session:
            result = session.run(query)
            
            G = nx.DiGraph()
            
            for record in result:
                # Simple parsing for nodes and relationships
                # This assumes the query returns paths or nodes/rels
                for key in record.keys():
                    val = record[key]
                    # If it's a node
                    if hasattr(val, 'labels'):
                        label = list(val.labels)[0] if val.labels else "Node"
                        name = val.get('name') or val.get('title') or str(val.id)
                        G.add_node(val.id, label=label, name=name)
                    # If it's a relationship
                    elif hasattr(val, 'type'):
                        G.add_edge(val.start_node.id, val.end_node.id, type=val.type)
            
            if G.number_of_nodes() > 0:
                pos = nx.spring_layout(G)
                
                edge_x = []
                edge_y = []
                for edge in G.edges():
                    x0, y0 = pos[edge[0]]
                    x1, y1 = pos[edge[1]]
                    edge_x.extend([x0, x1, None])
                    edge_y.extend([y0, y1, None])

                edge_trace = go.Scatter(
                    x=edge_x, y=edge_y,
                    line=dict(width=0.5, color='#888'),
                    hoverinfo='none',
                    mode='lines')

                node_x = []
                node_y = []
                node_text = []
                node_color = []
                
                for node in G.nodes():
                    x, y = pos[node]
                    node_x.append(x)
                    node_y.append(y)
                    node_text.append(f"{G.nodes[node]['label']}: {G.nodes[node]['name']}")
                    # Color by label
                    node_color.append(len(G.nodes[node]['label']))

                node_trace = go.Scatter(
                    x=node_x, y=node_y,
                    mode='markers',
                    hoverinfo='text',
                    marker=dict(
                        showscale=True,
                        colorscale='YlGnBu',
                        size=10,
                        color=node_color,
                        line_width=2))

                node_trace.text = node_text

                fig = go.Figure(data=[edge_trace, node_trace],
                             layout=go.Layout(
                                showlegend=False,
                                hovermode='closest',
                                margin=dict(b=0,l=0,r=0,t=0),
                                plot_bgcolor='rgba(0,0,0,0)',
                                paper_bgcolor='rgba(0,0,0,0)',
                                xaxis=dict(showgrid=False, zeroline=False, showticklabels=False),
                                yaxis=dict(showgrid=False, zeroline=False, showticklabels=False))
                                )
                st.plotly_chart(fig, use_container_width=True)
            else:
                st.warning("No graph data found or query format not supported for visualization.")
                
    except Exception as e:
        st.error(f"Graph Error: {e}")
