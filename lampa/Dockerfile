FROM node:22-alpine3.19 as builder
ARG TORRSERVER_DOMAIN
ARG TORRSERVER_DOMAIN_TWO
ARG TORRSERVER_LOGIN
ARG TORRSERVER_PASSWORD
ARG PARSER_TORRENT_TYPE
ARG JACKETT_DOMAIN
ARG JACKETT_APIKEY
COPY . /opt/lampa
WORKDIR /opt/lampa
RUN npm install
RUN npm start build
FROM nginx
COPY --from=builder /opt/lampa/build/web /usr/share/nginx/html
