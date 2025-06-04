FROM python:3.11-slim

WORKDIR /app

RUN pip install --upgrade pip
COPY services/document-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/document-service .

COPY services/document-service/entrypoint.sh entrypoint.sh
RUN chmod +x entrypoint.sh

CMD ["./entrypoint.sh"]