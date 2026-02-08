#!/bin/bash

# Script pour lancer le backend FastAPI et le frontend Next.js

echo "🚀 Démarrage de l'application..."

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour nettoyer les processus à l'arrêt
cleanup() {
    echo -e "\n${GREEN}Arrêt des services...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Lancer le backend FastAPI
echo -e "${BLUE}📡 Démarrage du backend FastAPI...${NC}"
uvicorn app.api:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Attendre un peu pour que le backend démarre
sleep 2

# Vérifier et installer les dépendances du frontend si nécessaire
echo -e "${BLUE}🔍 Vérification des dépendances du frontend...${NC}"
cd frontend
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installation des dépendances frontend...${NC}"
    pnpm install
fi

# Lancer le frontend Next.js
echo -e "${BLUE}🎨 Démarrage du frontend Next.js...${NC}"
pnpm dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Services démarrés !${NC}"
echo -e "Backend:  http://localhost:8000"
echo -e "Frontend: http://localhost:3000"
echo -e "\nAppuyez sur Ctrl+C pour arrêter les services."

# Attendre les processus
wait $BACKEND_PID $FRONTEND_PID
