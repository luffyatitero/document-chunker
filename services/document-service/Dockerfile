FROM python:3.11-slim

WORKDIR /app

RUN pip install --upgrade pip
COPY services/document-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/document-service .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]