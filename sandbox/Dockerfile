FROM python:3.11-slim
WORKDIR /app
RUN pip install --no-cache-dir flask gunicorn
COPY executor.py server.py ./
CMD ["gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "--timeout", "60", "server:app"]
