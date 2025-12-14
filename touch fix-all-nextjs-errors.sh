#!/bin/bash

echo "🔧 Correction automatique des erreurs Next.js..."

# Couleurs pour les logs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# 1️⃣ ROUTES API - Ajouter export const dynamic
# ============================================
echo -e "${BLUE}📁 Correction des routes API...${NC}"

api_routes=(
  "app/api/profile/get/route.js"
  "app/api/projets/getOne/route.js"
  "app/api/stats/global/route.js"
  "app/api/projets/get/route.js"
  "app/api/test-transaction/route.js"
  "app/api/trends/get/route.js"
  "app/api/user/confirm-email/route.js"
)

for route in "${api_routes[@]}"; do
  if [ -f "$route" ]; then
    # Vérifier si la ligne n'existe pas déjà
    if ! grep -q "export const dynamic = 'force-dynamic'" "$route"; then
      # Trouver la première ligne après les imports
      # On cherche la première ligne qui ne commence pas par import, //, ou une ligne vide
      awk '
        BEGIN { found_export = 0 }
        /^import / { print; next }
        /^\/\// { print; next }
        /^$/ { print; next }
        !found_export {
          print "\nexport const dynamic = '\''force-dynamic'\'';\n"
          found_export = 1
        }
        { print }
      ' "$route" > "$route.tmp" && mv "$route.tmp" "$route"
      
      echo -e "${GREEN}✅ Corrigé: $route${NC}"
    else
      echo -e "⏭️  Déjà corrigé: $route"
    fi
  else
    echo -e "⚠️  Fichier non trouvé: $route"
  fi
done

# ============================================
# 2️⃣ PAGES DASHBOARD - Ajouter "use client"
# ============================================
echo -e "\n${BLUE}📁 Correction des pages dashboard...${NC}"

dashboard_pages=(
  "app/(platform)/dashboard/fichiers/page.js"
  "app/(platform)/dashboard/communaute/page.js"
  "app/(platform)/dashboard/niche-hunter/page.js"
  "app/(platform)/dashboard/notifications/page.js"
  "app/(platform)/dashboard/parametres/email/page.js"
  "app/(platform)/dashboard/page.js"
  "app/(platform)/dashboard/parametres/motdepasse/page.js"
  "app/(platform)/dashboard/parametres/page.js"
  "app/(platform)/dashboard/support/page.js"
  "app/(platform)/dashboard/trends/page.js"
  "app/(platform)/dashboard/support/chat/page.js"
  "app/(platform)/dashboard/trends/favoris/page.js"
  "app/(platform)/dashboard/projets/page.js"
  "app/(platform)/dashboard/projets/nouveau/page.js"
)

for page in "${dashboard_pages[@]}"; do
  if [ -f "$page" ]; then
    # Vérifier si "use client" n'est pas déjà présent
    if ! grep -q '"use client"' "$page" && ! grep -q "'use client'" "$page"; then
      # Ajouter "use client" en première ligne
      echo '"use client";' | cat - "$page" > "$page.tmp" && mv "$page.tmp" "$page"
      echo -e "${GREEN}✅ Corrigé: $page${NC}"
    else
      echo -e "⏭️  Déjà corrigé: $page"
    fi
  else
    echo -e "⚠️  Fichier non trouvé: $page"
  fi
done

# ============================================
# 3️⃣ PAGES AUTH - Ajouter "use client"
# ============================================
echo -e "\n${BLUE}📁 Correction des pages auth...${NC}"

auth_pages=(
  "app/(platform)/auth/verify-email/page.js"
  "app/(platform)/auth/reset-password/page.js"
)

for page in "${auth_pages[@]}"; do
  if [ -f "$page" ]; then
    if ! grep -q '"use client"' "$page" && ! grep -q "'use client'" "$page"; then
      echo '"use client";' | cat - "$page" > "$page.tmp" && mv "$page.tmp" "$page"
      echo -e "${GREEN}✅ Corrigé: $page${NC}"
    else
      echo -e "⏭️  Déjà corrigé: $page"
    fi
  else
    echo -e "⚠️  Fichier non trouvé: $page"
  fi
done

echo -e "\n${GREEN}🎉 Toutes les corrections ont été appliquées !${NC}"
echo -e "\n${BLUE}📝 Prochaines étapes :${NC}"
echo "1. Vérifiez les fichiers modifiés avec 'git diff'"
echo "2. Relancez 'npm run build' pour tester"
echo "3. Si tout est OK, commitez les changements"