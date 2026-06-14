#!/bin/bash
# Script de déploiement — decrypterlassemblee.fr
# Usage : ./deploy/deploy.sh [--no-build]
#
# Par défaut : rsync le code + rebuild les images Docker.
# Avec --no-build : rsync uniquement (utile si seul le .env a changé).

set -euo pipefail

# Copier deploy/.env.deploy.example en deploy/.env.deploy et renseigner les valeurs
ENV_FILE="$(dirname "$0")/.env.deploy"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck source=/dev/null
  source "$ENV_FILE"
fi

SERVER="${DEPLOY_SERVER:?Variable DEPLOY_SERVER manquante (ex: root@1.2.3.4)}"
SSH_KEY="${DEPLOY_SSH_KEY:-$HOME/.ssh/id_rsa}"
SSH_OPTS="-i $SSH_KEY"
REMOTE_DIR="/opt/decrypterlassemblee/decrypterlassemblee-app"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

NO_BUILD=false
if [[ "${1:-}" == "--no-build" ]]; then
  NO_BUILD=true
fi

echo "==> Synchronisation du code vers $SERVER:$REMOTE_DIR"
rsync -az --delete -e "ssh $SSH_OPTS" \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='*.env' \
  --exclude='deploy/data' \
  "$LOCAL_DIR/" "$SERVER:$REMOTE_DIR/"

if [[ "$NO_BUILD" == true ]]; then
  echo "==> --no-build : redémarrage sans rebuild"
  ssh $SSH_OPTS "$SERVER" "cd $REMOTE_DIR/deploy && docker compose up -d"
else
  echo "==> Rebuild et redémarrage des conteneurs"
  ssh $SSH_OPTS "$SERVER" "cd $REMOTE_DIR/deploy && docker compose up -d --build"
fi

echo "==> Vérification de l'état des conteneurs"
ssh $SSH_OPTS "$SERVER" "cd $REMOTE_DIR/deploy && docker compose ps"

echo ""
echo "Déploiement terminé. https://decrypterlassemblee.fr"
