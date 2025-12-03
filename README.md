# News Intelligence Platform

A Next-Generation News Data Engineering platform leveraging **Dagster**, **ClickHouse**, and **Neo4j** for real-time analytics and knowledge graph generation.

## Architecture

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Orchestration** | Dagster | Asset-based pipeline orchestration |
| **Ingestion** | Kafka | Real-time event streaming |
| **Storage** | ClickHouse | OLAP database for fast analytics |
| **Graph DB** | Neo4j | Entity relationship mapping |
| **Visualization** | Streamlit | Interactive data dashboard |

## Prerequisites

- Docker & Docker Compose
- API Keys (NewsAPI, etc.)

## Getting Started

1.  **Start Services**:
    ```bash
    docker-compose up -d
    ```

2.  **Access Interfaces**:
    - **Dagster UI**: [http://localhost:3000](http://localhost:3000)
    - **Streamlit Dashboard**: [http://localhost:8501](http://localhost:8501)
    - **Neo4j Browser**: [http://localhost:7474](http://localhost:7474) (Auth: `neo4j`/`password`)
    - **ClickHouse**: [http://localhost:8123](http://localhost:8123)

## Project Structure

- `etl/`: Dagster assets and pipelines.
- `dashboard/`: Streamlit application code.
- `docker-compose.yml`: Infrastructure definition.
