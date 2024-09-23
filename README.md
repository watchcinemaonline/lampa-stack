# Torrentino

Copy example env file and update by your values
```bash
cp .env.jackett.dist .env
```

Source env variables
```bash
source .env
```

Build docker images
```bash
docker compose build
```

Start docker containers
```bash
docker compose --profile standalone up -d
```
