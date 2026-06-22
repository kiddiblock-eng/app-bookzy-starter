# ──────────────────────────────────────────────────────────────────────────
# Bookzy — image de production pour Render (web service long-running)
# Next.js 14 (next build + next start) + Chromium système pour Puppeteer.
# ──────────────────────────────────────────────────────────────────────────

# 1. Image de base
FROM node:20-bullseye-slim

# 2. Chromium système + polices + libs (retry réseau + nettoyage agressif)
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

# 3. Config Puppeteer : ne PAS télécharger le Chromium bundlé, utiliser celui d'apt.
#    Le chemin /usr/bin/chromium est aligné avec lib/puppeteer.js (getBrowser).
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# 4. Dépendances (devDeps incluses : tailwind/postcss/eslint requis au build).
#    NODE_ENV n'est pas encore 'production' ici pour ne pas sauter les devDeps.
COPY package*.json ./
RUN npm install && npm cache clean --force

# 5. Variables NEXT_PUBLIC_* requises AU BUILD (inlinées dans le bundle client).
#    Render passe les env vars du service comme build args → on les capte en ARG.
#    NB : modifier une de ces valeurs impose un nouveau build (valeur figée).
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_URL
ARG NEXT_PUBLIC_ADMIN_SECRET
ARG NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_URL=$NEXT_PUBLIC_URL \
    NEXT_PUBLIC_ADMIN_SECRET=$NEXT_PUBLIC_ADMIN_SECRET \
    NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY=$NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY

# 6. Build
COPY . .
ENV NODE_ENV=production
RUN npm run build

# 7. Render fournit $PORT au runtime (défaut 10000 si absent).
EXPOSE 10000

# 8. Démarrage : next start classique, écoute sur $PORT
CMD ["sh", "-c", "node node_modules/.bin/next start -p ${PORT:-10000}"]
