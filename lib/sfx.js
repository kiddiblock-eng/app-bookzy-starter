// lib/sfx.js — petits sons d'interface via Web Audio API (aucun fichier audio).
"use client";

let _ctx = null;
function audio() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!_ctx) _ctx = new AC();
  if (_ctx.state === "suspended") _ctx.resume().catch(() => {});
  return _ctx;
}

function tone(freq, { start = 0, dur = 0.12, type = "sine", vol = 0.14, slideTo = null, attack = 0.012 } = {}) {
  const c = audio();
  if (!c) return;
  const now = c.currentTime + start;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
  o.connect(g);
  g.connect(c.destination);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(vol, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  o.start(now);
  o.stop(now + dur + 0.03);
}

// Sélection (langue, ton, public, format, design) — "tock" chaud, chute de tonalité, très court.
export function sfxTick() {
  tone(560, { dur: 0.07, vol: 0.09, type: "sine", slideTo: 210, attack: 0.004 });
}

// Bouton principal (Continuer / Générer) — clic un peu plus présent (ascendant).
export function sfxClick() {
  tone(520, { dur: 0.09, vol: 0.13, type: "sine" });
  tone(780, { start: 0.045, dur: 0.10, vol: 0.11, type: "sine" });
}

// Bouton Retour — clic descendant (sensation "retour arrière").
export function sfxBack() {
  tone(480, { dur: 0.09, vol: 0.11, type: "sine" });
  tone(320, { start: 0.045, dur: 0.10, vol: 0.10, type: "sine" });
}

// Génération terminée — petite mélodie ascendante agréable (Do–Mi–Sol).
export function sfxSuccess() {
  tone(523.25, { start: 0.00, dur: 0.18, vol: 0.16 });
  tone(659.25, { start: 0.12, dur: 0.18, vol: 0.16 });
  tone(783.99, { start: 0.24, dur: 0.32, vol: 0.18 });
}
