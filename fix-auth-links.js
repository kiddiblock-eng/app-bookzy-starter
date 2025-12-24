#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// CONFIGURATION
// ============================================================
const APP_URL = '';

// Chemins à traiter
const directories = [
  './app',
  './components',
  './src',
];

// Extensions de fichiers à traiter
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

// ============================================================
// PATTERNS À REMPLACER
// ============================================================
const replacements = [
  // Link Next.js - /auth/* (tous les sous-chemins)
  {
    from: /href=(["'])(?!https?:\/\/)\/auth(\/[^"']*)?["']/g,
    to: `href=$1${APP_URL}/auth$2$1`,
    description: 'Link href="/auth/*"'
  },
  
  // Link Next.js - /dashboard/* (tous les sous-chemins)
  {
    from: /href=(["'])(?!https?:\/\/)\/dashboard(\/[^"']*)?["']/g,
    to: `href=$1${APP_URL}/dashboard$2$1`,
    description: 'Link href="/dashboard/*"'
  },
  
  // Link Next.js - /admin/* (tous les sous-chemins)
  {
    from: /href=(["'])(?!https?:\/\/)\/admin(\/[^"']*)?["']/g,
    to: `href=$1${APP_URL}/admin$2$1`,
    description: 'Link href="/admin/*"'
  },
  
  // router.push - /auth/*
  {
    from: /router\.push\((["'])(?!https?:\/\/)\/auth(\/[^"']*)?["']\)/g,
    to: `router.push($1${APP_URL}/auth$2$1)`,
    description: 'router.push("/auth/*")'
  },
  
  // router.push - /dashboard/*
  {
    from: /router\.push\((["'])(?!https?:\/\/)\/dashboard(\/[^"']*)?["']\)/g,
    to: `router.push($1${APP_URL}/dashboard$2$1)`,
    description: 'router.push("/dashboard/*")'
  },
  
  // router.push - /admin/*
  {
    from: /router\.push\((["'])(?!https?:\/\/)\/admin(\/[^"']*)?["']\)/g,
    to: `router.push($1${APP_URL}/admin$2$1)`,
    description: 'router.push("/admin/*")'
  },
  
  // window.location - /auth/*
  {
    from: /window\.location\.href\s*=\s*(["'])(?!https?:\/\/)\/auth(\/[^"']*)?["']/g,
    to: `window.location.href = $1${APP_URL}/auth$2$1`,
    description: 'window.location.href = "/auth/*"'
  },
  
  // window.location - /dashboard/*
  {
    from: /window\.location\.href\s*=\s*(["'])(?!https?:\/\/)\/dashboard(\/[^"']*)?["']/g,
    to: `window.location.href = $1${APP_URL}/dashboard$2$1`,
    description: 'window.location.href = "/dashboard/*"'
  },
  
  // window.location - /admin/*
  {
    from: /window\.location\.href\s*=\s*(["'])(?!https?:\/\/)\/admin(\/[^"']*)?["']/g,
    to: `window.location.href = $1${APP_URL}/admin$2$1`,
    description: 'window.location.href = "/admin/*"'
  },
  
  // redirect() et replace() - /auth/*
  {
    from: /\.(redirect|replace)\((["'])(?!https?:\/\/)\/auth(\/[^"']*)?["']\)/g,
    to: `.$1($2${APP_URL}/auth$3$2)`,
    description: 'redirect/replace("/auth/*")'
  },
  
  // redirect() et replace() - /dashboard/*
  {
    from: /\.(redirect|replace)\((["'])(?!https?:\/\/)\/dashboard(\/[^"']*)?["']\)/g,
    to: `.$1($2${APP_URL}/dashboard$3$2)`,
    description: 'redirect/replace("/dashboard/*")'
  },
];

// ============================================================
// FONCTIONS
// ============================================================

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return extensions.includes(ext);
}

function walkDirectory(dir, callback) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️  Dossier ignoré (n'existe pas): ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        walkDirectory(filePath, callback);
      }
    } else if (shouldProcessFile(filePath)) {
      callback(filePath);
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changes = [];

  const alreadyHasAbsoluteUrls = content.includes(`${APP_URL}/auth`) || 
                                  content.includes(`${APP_URL}/dashboard`);

  replacements.forEach(({ from, to, description }) => {
    const matches = content.match(from);
    
    if (matches && matches.length > 0) {
      const oldContent = content;
      content = content.replace(from, to);
      
      if (oldContent !== content) {
        modified = true;
        changes.push(`  ✅ ${description} (${matches.length} occurrence(s))`);
      }
    }
  });

  if (modified) {
    // Protection contre les doubles URLs
    const hasDoubleUrl = content.includes(`${APP_URL}/${APP_URL}`) || 
                         content.includes(`${APP_URL}/https://`);
    if (hasDoubleUrl) {
      console.log(`\n⚠️  ALERTE: Double URL détectée dans ${filePath}`);
      console.log(`   Le fichier n'a PAS été modifié pour éviter la corruption.`);
      return false;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`\n📝 ${filePath}`);
    
    if (alreadyHasAbsoluteUrls) {
      console.log(`  ℹ️  Note: Ce fichier contenait déjà des URLs absolues`);
    }
    
    changes.forEach(change => console.log(change));
  }

  return modified;
}

// ============================================================
// EXÉCUTION
// ============================================================

console.log('🚀 Démarrage du remplacement automatique...\n');
console.log(`🎯 Remplacement de TOUS les liens /auth/*, /dashboard/*, /admin/*`);
console.log(`   par ${APP_URL}/auth/*, ${APP_URL}/dashboard/*, ${APP_URL}/admin/*\n`);
console.log(`🛡️  Protection contre les doubles remplacements activée\n`);

let totalFiles = 0;
let modifiedFiles = 0;

directories.forEach(dir => {
  console.log(`📂 Traitement du dossier: ${dir}`);
  
  walkDirectory(dir, (filePath) => {
    totalFiles++;
    if (processFile(filePath)) {
      modifiedFiles++;
    }
  });
});

console.log('\n' + '='.repeat(60));
console.log(`✅ TERMINÉ !`);
console.log(`📊 Fichiers analysés: ${totalFiles}`);
console.log(`📝 Fichiers modifiés: ${modifiedFiles}`);
console.log('='.repeat(60));

if (modifiedFiles > 0) {
  console.log('\n⚠️  IMPORTANT: Vérifiez les changements avec:');
  console.log('   git diff');
  console.log('\n💡 Si tout est OK, committez:');
  console.log('   git add .');
  console.log('   git commit -m "fix: update all auth/dashboard links to absolute URLs"');
  console.log('   git push');
  console.log('\n🔍 Testez ensuite:');
  console.log('   - www.bookzy.io → cliquez "Connexion"');
  console.log('   - Vérifiez que ça redirige vers app.bookzy.io/auth/login');
} else {
  console.log('\n✨ Aucun fichier à modifier (déjà à jour ou aucun lien trouvé)');
}