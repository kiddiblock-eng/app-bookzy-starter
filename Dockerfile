FROM node:20-bullseye-slim

# Installation Chromium (Puppeteer)
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

# 🚩 ÉTAPE 1 : On ne définit PAS encore NODE_ENV=production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./

# ✅ ÉTAPE 2 : On installe TOUT (y compris autoprefixer pour le build)
RUN npm install

COPY . .

# ✅ ÉTAPE 3 : Le build va maintenant fonctionner
RUN npm run build

# ✅ ÉTAPE 4 : On passe en production seulement après le build
ENV NODE_ENV=production

EXPOSE 8080

# ✅ ÉTAPE 5 : Fix pour le port Railway (force 8080 pour Next.js)
CMD ["npm", "run", "start", "--", "-p", "8080"]