#!/bin/bash
# Script de déploiement — decrypterlassemblee.fr
# Usage : ./deploy/deploy.sh [--no-build]
#
# Par défaut : rsync le code + rebuild les images Docker.
# Avec --no-build : rsync uniquement (utile si seul le .env a changé).

set -euo pipefail

SERVER="root@188.245.54.18"
SSH_KEY="$HOME/.ssh/hetzner-decrypter-an"
SSH_OPTS="-i $SSH_KEY"
REMOTE_DIR="/opt/nos-deputes/nos-deputes-app"
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
