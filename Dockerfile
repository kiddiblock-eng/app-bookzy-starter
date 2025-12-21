# Utilisation de Node 20 pour une meilleure compatibilité avec Next 14
FROM node:20-bullseye-slim

# Installation complète des dépendances Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Variables d'environnement pour Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    PORT=8080 \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
# Utilisation de npm install pour s'assurer que toutes les dépendances sont là
RUN npm install

COPY . .

RUN npm run build

# Railway utilise souvent le port 8080 par défaut
EXPOSE 8080

CMD ["npm", "start"]