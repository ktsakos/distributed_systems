FROM python:3.7-alpine
MAINTAINER Tsakos Kostas "ktsakos@isc.tuc.gr"

WORKDIR /code

ENV FLASK_APP playmaster.py
ENV FLASK_RUN_HOST 0.0.0.0

RUN apk add --no-cache python3-dev && pip3 install --upgrade pip 
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD ["flask", "run"]