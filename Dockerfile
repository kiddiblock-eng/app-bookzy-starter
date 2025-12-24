# 1. Image de base
FROM node:20-bullseye-slim

# 2. Installation de Chromium et des dépendances pour Puppeteer
# Ces bibliothèques permettent de générer les PDF sans erreur de système
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
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# 3. Configuration de Puppeteer pour utiliser Chromium installé
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# 4. Installation des dépendances
COPY package*.json ./
RUN npm install

# 5. Copie du code et Build
COPY . .
RUN npm run build

# 6. Configuration de l'environnement de production
ENV NODE_ENV=production

# Railway utilise un port dynamique, nous ne forçons plus 8080 ici
EXPOSE 8080

# 7. COMMANDE DE DÉMARRAGE OPTIMISÉE
# - On utilise 'node' directement pour injecter le paramètre de RAM (24Go sur tes 32Go)
# - On utilise ${PORT:-8080} pour que Railway puisse connecter son réseau
CMD ["sh", "-c", "node --max-old-space-size=24576 node_modules/.bin/next start -p ${PORT:-8080}"]