from setuptools import find_packages, setup

setup(
    name="news_pipeline",
    packages=find_packages(exclude=["news_pipeline_tests"]),
    install_requires=[
        "dagster",
        "dagster-cloud",
        "dagster-postgres",
        "dagster-docker",
        "pandas",
        "psycopg2-binary",
        "gnews",
        "textblob",
        "requests",
        "clickhouse-driver",
        "neo4j",
        "bertopic",
        "spacy",
        "geopy",
    ],
    extras_require={"dev": ["dagster-webserver", "pytest"]},
)
