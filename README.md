# Lampa Docker Stack

Copy example env file and update by your values
```bash
cp .env.jackett.dist .env
```

Source env variables
```bash
source .env
```

Build and start docker containers with selected **torrserver** parser
```bash
export COMPOSE_PROFILES=standalone
docker compose build
docker compose up -d
```
Start docker containers with **jackett** parser and container
```bash
export COMPOSE_PROFILES=standalone,jackett
docker compose build
docker compose up -d
```
