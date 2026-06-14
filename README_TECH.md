# Décrypter l'Assemblée — Documentation technique

## Architecture

Le projet repose sur deux dépôts distincts :

- **decrypterlassemblee-app** (ce repo) : l'application web Next.js + le sandbox Python → [github.com/YohannLeFaou/decrypterlassemblee-app](https://github.com/YohannLeFaou/decrypterlassemblee-app)
- **decrypterlassemblee-data** (repo séparé) : l'ETL qui télécharge et structure les données de l'Assemblée nationale dans une base SQLite (`an.db`) → [github.com/YohannLeFaou/decrypterlassemblee-data](https://github.com/YohannLeFaou/decrypterlassemblee-data)

```
decrypterlassemblee-data/   →  an.db  →  decrypterlassemblee-app/
(ETL quotidien)                (SQLite)   (app + sandbox)
```

L'ETL tourne en cron job quotidien (3h du matin) sur le serveur de production. L'application lit la base en lecture seule via un sandbox Python isolé.

## Stack

- **Frontend / API :** Next.js (App Router), React, TypeScript, Tailwind CSS
- **Agent IA :** DeepSeek (défaut), avec support Anthropic et Mistral en fallback
- **Sandbox :** Flask (Python 3.11), exécution de code Python isolée, accès SQLite en lecture seule
- **Base de données :** SQLite (WAL mode — lecture sandbox + écriture ETL sans conflit)
- **Reverse proxy :** Caddy (HTTPS automatique via Let's Encrypt)
- **Orchestration :** Docker Compose (4 services : app, sandbox, etl, caddy)
- **Hébergement :** Hetzner CX22 (2 vCPU, 4 GB RAM)

## Lancer le projet en local

### Prérequis

- Node.js 20+
- Docker + Docker Compose
- Une clé API DeepSeek (ou Anthropic / Mistral)
- La base `an.db` (voir ci-dessous)

### Générer la base de données

La base `an.db` est générée par le repo [decrypterlassemblee-data](https://github.com/YohannLeFaou/decrypterlassemblee-data) :

```bash
# Cloner le repo ETL
git clone https://github.com/YohannLeFaou/decrypterlassemblee-data
cd decrypterlassemblee-data

# Installer les dépendances (requiert uv)
uv sync

# Générer an.db avec les données de la 17e législature (~20s)
uv run an-etl
```

Cela crée `data/an.db`. La 16e législature nécessite une étape supplémentaire (voir le README de ce repo — le serveur de l'AN bloque les téléchargements automatiques pour les archives).

Copier ensuite `an.db` dans `decrypterlassemblee-app/deploy/data/an.db`.

### Installation

```bash
npm install
```

### Variables d'environnement

Copier `.env.example` en `.env.local` et renseigner les valeurs :

```bash
cp deploy/.env.example .env.local
```

Variables requises :

```env
LLM_PROVIDER=deepseek        # deepseek | anthropic | mistral
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_MODEL=deepseek-v4-flash
```

Variables optionnelles (fallback LLM) :

```env
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-haiku-4-5-20251001
MISTRAL_API_KEY=...
MISTRAL_MODEL=mistral-small-latest
```

### Démarrer le sandbox

Le sandbox Python doit tourner pour que l'agent puisse interroger la base de données. Il s'attend à trouver `an.db` dans `deploy/data/an.db` :

```bash
docker compose -f deploy/docker-compose.yml up sandbox
```

La variable `SANDBOX_URL` est automatiquement positionnée à `http://sandbox:5000` dans le docker-compose. En dev, si vous lancez le sandbox séparément, ajoutez dans `.env.local` :

```env
SANDBOX_URL=http://localhost:5000
```

### Démarrer l'app

```bash
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Déploiement en production

```bash
./deploy/deploy.sh
```

Le script fait un `rsync` vers le serveur puis rebuild et redémarre les conteneurs Docker.

Pour redémarrer sans rebuild (ex. changement de `.env` uniquement) :

```bash
./deploy/deploy.sh --no-build
```

## Mise à jour des données

Les données sont mises à jour via l'ETL du repo `decrypterlassemblee-data`, lancé en tant que service Docker avec le profil `etl` :

```bash
docker compose --profile etl run --rm etl
```

En production, ce job tourne automatiquement en cron job à 3h du matin.
