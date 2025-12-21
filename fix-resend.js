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
            fixFile(fullPath);
        }
    });
}

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (!content.includes('Resend')) return;

    console.log(`🧹 Nettoyage des doublons : ${filePath}`);

    // 1. On s'assure que dynamic force-dynamic est là une seule fois
    if (!content.includes('force-dynamic')) {
        content = `export const dynamic = "force-dynamic";\n` + content;
    }

    // 2. On supprime TOUTES les lignes "const resend =" qui ne sont pas commentées
    // Cela va nettoyer les doublons créés précédemment
    content = content.replace(/^[ ]*const resend = new Resend\(process\.env\.RESEND_API_KEY\);/gm, '');

    // 3. On injecte la ligne proprement UNE SEULE FOIS au début des fonctions
    const methods = ['POST', 'PUT', 'PATCH', 'GET'];
    methods.forEach(method => {
        const regex = new RegExp(`export async function ${method}\\(.*?\\) {`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `$& \n  const resend = new Resend(process.env.RESEND_API_KEY);`);
        }
    });

    // 4. On nettoie les sauts de ligne excessifs que le script pourrait avoir créés
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(filePath, content);
}

console.log("🚀 Lancement du nettoyage final...");
walk(apiDir);
console.log("✅ Terminé ! Les doublons ont été supprimés.");