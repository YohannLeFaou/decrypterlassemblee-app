FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir requests
COPY src/ src/
COPY pyproject.toml .
RUN pip install --no-cache-dir .
CMD ["an-etl", "--db", "/data/an.db", "--raw-dir", "/data/raw"]
