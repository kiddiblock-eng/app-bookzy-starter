const fs = require('fs');
const path = require('path');

const apiDir = path.join(process.cwd(), 'app/api');

function walk(dir) {
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
    
    // Si le fichier n'utilise pas Resend, on passe
    if (!content.includes('new Resend')) return;

    console.log(`🛠️ Correction de : ${filePath}`);

    // 1. Ajouter force-dynamic si absent
    if (!content.includes('force-dynamic')) {
        content = `export const dynamic = "force-dynamic";\n` + content;
    }

    // 2. Commenter l'initialisation globale de Resend
    content = content.replace(/^(const|let|var)\s+resend\s+=\s+new\s+Resend/gm, '// $&');

    // 3. Injecter l'initialisation locale dans les fonctions exportées
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    methods.forEach(method => {
        const regex = new RegExp(`export async function ${method}\\(.*?\\) {`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `$& \n  const resend = new Resend(process.env.RESEND_API_KEY);`);
        }
    });

    fs.writeFileSync(filePath, content);
}

console.log("🚀 Démarrage du nettoyage des routes API...");
walk(apiDir);
console.log("✅ Terminé ! Toutes les routes Resend sont sécurisées.");