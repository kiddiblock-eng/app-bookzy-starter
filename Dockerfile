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

# 3. Configuration Puppeteer (SANS NODE_ENV pour l'instant)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# 4. Installation dépendances (avec devDependencies car NODE_ENV n'est pas encore production)
COPY package*.json ./
RUN npm install && npm cache clean --force

# 5. Build
COPY . .
RUN npm run build

# 6. ✅ MAINTENANT on peut mettre NODE_ENV=production (après le build)
ENV NODE_ENV=production

EXPOSE 8080

# 7. Démarrage avec limite RAM optimisée
CMD ["sh", "-c", "node --max-old-space-size=16384 node_modules/.bin/next start -p ${PORT:-8080}"]