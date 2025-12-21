import fs from 'fs';
import path from 'path';

const apiDir = path.join(process.cwd(), 'app/api');

function walk(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file === 'route.js') {
            fixDynamicRoute(fullPath);
        }
    });
}

function fixDynamicRoute(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 1. On retire toute ancienne déclaration de dynamic pour éviter les doublons
    content = content.replace(/^export const dynamic = .*;?\n?/gm, '');

    // 2. On ajoute 'force-dynamic' tout en haut
    // C'est l'instruction magique pour que Next.js ignore ce fichier au build
    content = `export const dynamic = "force-dynamic";\n` + content;

    console.log(`✅ Dynamisé : ${filePath.replace(process.cwd(), '')}`);
    fs.writeFileSync(filePath, content);
}

console.log("🚀 Forçage du mode dynamique sur toutes les routes API...");
walk(apiDir);
console.log("✨ Terminé ! Next.js ne bloquera plus sur MongoDB au build.");