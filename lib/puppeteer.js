// lib/puppeteer.js
// ──────────────────────────────────────────────────────────────────────────
// Launcher Puppeteer centralisé (Render / Docker — Chromium système).
//
// Résolution du binaire Chromium :
//   1. process.env.PUPPETEER_EXECUTABLE_PATH si défini
//      (en local : Chrome du Mac via .env.local ; en prod : /usr/bin/chromium
//       injecté par le Dockerfile)
//   2. sinon, en production : /usr/bin/chromium (Chromium installé par apt)
//   3. sinon (dev sans env) : undefined → Chromium bundlé par le package puppeteer
//
// Tous les points de génération PDF doivent passer par getBrowser().
// ──────────────────────────────────────────────────────────────────────────
import puppeteer from "puppeteer";

// Args communs robustes pour un environnement conteneurisé sans /dev/shm large.
const BASE_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-zygote",
];

function resolveExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.NODE_ENV === "production") {
    return "/usr/bin/chromium";
  }
  return undefined; // dev local : Chromium bundlé par puppeteer
}

/**
 * Lance un navigateur Chromium prêt pour la génération PDF.
 * @param {object} [overrides] - options puppeteer.launch additionnelles.
 *   overrides.args est fusionné (dédupliqué) avec BASE_ARGS.
 * @returns {Promise<import("puppeteer").Browser>}
 */
export async function getBrowser(overrides = {}) {
  const { args = [], ...rest } = overrides;
  const mergedArgs = Array.from(new Set([...BASE_ARGS, ...args]));

  const launchOptions = {
    headless: "new",
    args: mergedArgs,
    timeout: 180000,
    protocolTimeout: 180000,
    ...rest,
  };

  const executablePath = resolveExecutablePath();
  if (executablePath) {
    launchOptions.executablePath = executablePath;
  }

  return puppeteer.launch(launchOptions);
}
