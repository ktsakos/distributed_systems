FROM python:3.7-alpine
LABEL maintainer="Tsakos Kostantinos <ktsakos@isc.tuc.gr> - Tzavaras Aimilios <atzavaras94@gmail.com>"
WORKDIR /code
ENV FLASK_APP=gamemaster.py   
ENV FLASK_RUN_HOST 0.0.0.0
RUN apk add --no-cache python3-dev && pip3 install --upgrade pip 
RUN pip install mysql-connector-python 
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5002 
CMD ["flask", "run"]


