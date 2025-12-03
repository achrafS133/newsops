from dagster import Definitions, ScheduleDefinition, DefaultScheduleStatus
from .assets import ingest_news, process_news, extract_topics, extract_locations, load_to_clickhouse, load_to_neo4j
from .breaking_news import detect_breaking_news

# Daily schedule at 8 AM
daily_schedule = ScheduleDefinition(
    name="daily_news_pipeline",
    cron_schedule="0 8 * * *",
    target="*",
    default_status=DefaultScheduleStatus.RUNNING,
)

defs = Definitions(
    assets=[ingest_news, process_news, extract_topics, extract_locations, load_to_clickhouse, load_to_neo4j, detect_breaking_news],
    schedules=[daily_schedule],
)