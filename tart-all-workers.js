// start-all-workers.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger .env.local
dotenv.config({ path: join(__dirname, '.env.local') });

console.log('🔧 Variables d\'environnement chargées');
console.log('📍 MONGODB_URI:', process.env.MONGODB_URI ? '✅ Définie' : '❌ Manquante');
console.log('📍 REDIS_URL:', process.env.REDIS_URL ? '✅ Définie' : '❌ Manquante');

// Lancer ebookWorker
const worker1 = spawn('npx', ['tsx', 'workers/ebookWorker.js'], {
  stdio: 'inherit',
  env: process.env,
  shell: true
});

// Lancer ebookAssembler
const worker2 = spawn('npx', ['tsx', 'workers/ebookAssembler.js'], {
  stdio: 'inherit',
  env: process.env,
  shell: true
});

worker1.on('error', (err) => console.error('❌ Erreur worker1:', err));
worker2.on('error', (err) => console.error('❌ Erreur worker2:', err));

console.log('🚀 Les 2 workers sont lancés !');
console.log('📝 Appuie sur Ctrl+C pour arrêter');

process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt des workers...');
  worker1.kill();
  worker2.kill();
  process.exit();
});