FROM alpine:latest
LABEL maintainer="Tsakos Kostantinos <ktsakos@isc.tuc.gr> - Tzavaras Aimilios <atzavaras94@gmail.com>"
RUN apk add --no-cache python3-dev && pip3 install --upgrade pip
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN pip install mysql-connector-python
WORKDIR /authentication_service
COPY . /authentication_service
RUN pip3 --no-cache-dir install -r requirements.txt
EXPOSE 5000
ENTRYPOINT ["python3"]
CMD ["auth.py"]
