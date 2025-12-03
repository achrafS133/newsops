FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY setup.py /opt/dagster/app/
WORKDIR /opt/dagster/app
RUN pip install ".[dev]"

# Copy the rest of the code
COPY . /opt/dagster/app

# Set environment variables
ENV DAGSTER_HOME=/opt/dagster/dagster_home

# Create dagster home directory
RUN mkdir -p "$DAGSTER_HOME"

# Default command (can be overridden)
CMD ["dagster-webserver", "-h", "0.0.0.0", "-p", "3000", "-w", "workspace.yaml"]
