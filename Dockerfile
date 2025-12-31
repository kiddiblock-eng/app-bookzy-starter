# 1. Image de base
FROM node:20-bullseye-slim

# 2. Installation de Chromium avec retry + nettoyage agressif
RUN apt-get update && \
    for i in 1 2 3; do \
      apt-get install -y \
        chromium \
        fonts-liberation \
        fonts-noto-color-emoji \
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
        --no-install-recommends && break || sleep 10; \
    done && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# 3. Configuration Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

# 4. Installation dépendances (TOUTES, y compris devDependencies)
COPY package*.json ./
RUN npm ci && npm cache clean --force

# 5. Build
COPY . .
RUN npm run build

EXPOSE 8080

# 6. Démarrage avec limite RAM optimisée
CMD ["sh", "-c", "node --max-old-space-size=16384 node_modules/.bin/next start -p ${PORT:-8080}"]