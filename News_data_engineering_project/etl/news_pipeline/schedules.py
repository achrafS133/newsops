from dagster import schedule, DefaultScheduleStatus
from .jobs import news_pipeline_job

@schedule(
    job=news_pipeline_job,
    cron_schedule="0 8 * * *",  # Daily at 8:00 AM
    default_status=DefaultScheduleStatus.RUNNING,
)
def daily_news_schedule():
    """Schedule to run news pipeline daily at 8:00 AM"""
    return {}