FROM python:3.14

WORKDIR /api

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app

EXPOSE 80

CMD ["fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "80"]