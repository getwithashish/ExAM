FROM python:3.10-alpine3.20

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV ENVIRONMENT PRODUCTION

WORKDIR /app

RUN apk update && apk add --no-cache git ca-certificates && update-ca-certificates
RUN apk update && \
    apk add --no-cache \
        gcc \
        musl-dev \
        linux-headers \
        python3-dev \
        mariadb-dev \
        build-base \
        pkgconf

RUN apk --no-cache add curl
RUN curl -k -L https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz | tar -C /usr/local/bin -xzv

COPY requirements.txt /app/
RUN pip install wheel
RUN pip install --upgrade pip
RUN pip install pyOpenSSL
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

EXPOSE 8000

RUN chmod +x entrypoint-dev.sh
RUN chmod +x entrypoint-stage.sh

CMD ["sh", "entrypoint-dev.sh"]
