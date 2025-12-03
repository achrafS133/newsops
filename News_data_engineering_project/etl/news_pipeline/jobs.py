from dagster import job
from .assets import ingest_news, process_news, extract_topics, extract_locations, load_to_clickhouse, load_to_neo4j

@job
def news_pipeline_job():
    """Complete news processing pipeline job"""
    load_to_neo4j(
        load_to_clickhouse(
            extract_locations(
                extract_topics(
                    process_news(
                        ingest_news()
                    )
                )
            )
        )
    )