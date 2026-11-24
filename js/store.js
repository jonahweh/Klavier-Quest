// Fortschritt, XP, Streak, Erfolge, Sync-Code
import { WORLDS, allSteps, LEVEL_TITLES } from './curriculum.js';

const KEY = 'klavier-quest-v1';
const today = () => new Date().toLocaleDateString('sv-SE');           // YYYY-MM-DD lokal
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toLocaleDateString('sv-SE'); };

const DEFAULT = () => ({
  v: 1,
  xp: 0,
  steps: {},          // stepId -> Sterne (0..3), Theorie: 1
  bosses: {},         // worldId -> true
  streak: { count: 0, last: null, best: 0 },
  daily: { date: today(), xp: 0, goalHit: false, tasks: {} },
  stats: { sprintBest: 0, sprintRuns: 0, earCorrect: 0, earRounds: 0, plays: 0, perfect: 0, minutes: 0 },
  ach: {},
  settings: {
    input: 'mic', sens: 0.55, latency: 90, chord: 'normal', hints: 'auto',
    metronome: true, goal: 60, touchSound: true,
  },
  updated: Date.now(),
});

export const S = load();
const subs = new Set();
export const onChange = fn => (subs.add(fn), () => subs.delete(fn));

function load() {
  let d = null;
  try { d = JSON.parse(localStorage.getItem(KEY)); } catch (e) { d = null; }
  const base = DEFAULT();
  if (!d) return base;
  return { ...base, ...d, settings: { ...base.settings, ...(d.settings || {}) }, stats: { ...base.stats, ...(d.stats || {}) }, streak: { ...base.streak, ...(d.streak || {}) } };
}
export function save() {
  S.updated = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* privater Modus */ }
  subs.forEach(f => f());
}
function rollDay() {
  if (S.daily.date !== today()) {
    S.daily = { date: today(), xp: 0, goalHit: false, tasks: {} };
    if (S.streak.last && S.streak.last !== yesterday() && S.streak.last !== today()) S.streak.count = 0;
  }
}
rollDay();

// ---------- Level ----------
export const xpForLevel = L => 50 * L * (L - 1);
export function levelInfo(xp = S.xp) {
  let L = 1;
  while (xpForLevel(L + 1) <= xp) L++;
  const a = xpForLevel(L), b = xpForLevel(L + 1);
  let title = LEVEL_TITLES[0][1];
  for (const [lv, t] of LEVEL_TITLES) if (L >= lv) title = t;
  return { level: L, title, into: xp - a, need: b - a, pct: (xp - a) / (b - a) };
}

// ---------- XP ----------
let notify = () => {};
export const setNotifier = fn => (notify = fn);

export function addXP(n, reason = '') {
  rollDay();
  n = Math.round(n);
  if (n <= 0) return 0;
  const before = levelInfo().level;
  S.xp += n;
  S.daily.xp += n;
  if (!S.daily.goalHit && S.daily.xp >= S.settings.goal) {
    S.daily.goalHit = true;
    if (S.streak.last === yesterday()) S.streak.count += 1;
    else if (S.streak.last !== today()) S.streak.count = 1;
    S.streak.last = today();
    S.streak.best = Math.max(S.streak.best, S.streak.count);
    notify({ kind: 'goal', text: `Tagesziel geschafft! Serie: ${S.streak.count} ${S.streak.count === 1 ? 'Tag' : 'Tage'}` });
  }
  const after = levelInfo().level;
  if (after > before) notify({ kind: 'level', text: `Level ${after}: ${levelInfo().title}` });
  const h = new Date().getHours();
  if (h >= 22) unlock('night');
  if (h < 7) unlock('early');
  checkAchievements();
  save();
  return n;
}

export function taskDone(id) { rollDay(); S.daily.tasks[id] = true; save(); }

// ---------- Schritte ----------
const STEPS = allSteps();
export const stepById = id => STEPS.find(s => s.id === id);
export function stars(id) { return S.steps[id] || 0; }
export function recordStep(id, st) {
  const prev = S.steps[id] || 0;
  if (st > prev) S.steps[id] = st;
  const s = stepById(id);
  if (s && s.boss && st >= 2) {
    if (!S.bosses[s.world]) notify({ kind: 'boss', text: 'Boss besiegt! Neue Welt freigeschaltet.' });
    S.bosses[s.world] = true;
  }
  save();
  return { first: prev === 0 && st > 0, improved: st > prev };
}
export function worldUnlocked(i) { return i === 0 || !!S.bosses[WORLDS[i - 1].id]; }
export function lessonUnlocked(wi, li) {
  if (!worldUnlocked(wi)) return false;
  if (li === 0) return true;
  const prev = WORLDS[wi].lessons[li - 1];
  return prev.steps.every(s => stars(s.id) > 0);
}
export function lessonDone(l) { return l.steps.every(s => stars(s.id) > 0); }
export function nextStep() {
  for (let wi = 0; wi < WORLDS.length; wi++) {
    const w = WORLDS[wi];
    if (!worldUnlocked(wi)) break;
    for (let li = 0; li < w.lessons.length; li++) {
      const l = w.lessons[li];
      for (const s of l.steps) if (!stars(s.id)) return { world: w, wi, lesson: l, li, step: s };
    }
    if (!S.bosses[w.id]) return { world: w, wi, lesson: null, step: { type: 'piece', id: 'boss-' + w.id, piece: w.boss, boss: true, world: w.id } };
  }
  return null;
}
export function totalStars() { return Object.entries(S.steps).filter(([k]) => !k.startsWith('t-')).reduce((a, [, v]) => a + v, 0); }

// ---------- Erfolge ----------
export const ACHIEVEMENTS = [
  { id: 'first', t: 'Erster Ton', d: 'Die erste Übung abgeschlossen', ok: () => Object.keys(S.steps).some(k => !k.startsWith('t-')) },
  { id: 'three', t: 'Sternensammler', d: 'Zum ersten Mal 3 Sterne', ok: () => Object.values(S.steps).some(v => v >= 3) },
  { id: 'stars30', t: 'Sternenhimmel', d: '30 Sterne gesammelt', ok: () => totalStars() >= 30 },
  { id: 'stars80', t: 'Milchstraße', d: '80 Sterne gesammelt', ok: () => totalStars() >= 80 },
  ...WORLDS.map((w, i) => ({ id: 'boss-' + w.id, t: ['Comeback geschafft', 'Beidhändig', 'Tonarten-Meister', 'Akkord-Ass', 'In Bewegung', 'Ausdrucksstark'][i], d: `Boss von Welt ${i + 1} besiegt`, ok: () => !!S.bosses[w.id] })),
  { id: 'streak3', t: 'Dranbleiber', d: '3 Tage Serie', ok: () => S.streak.best >= 3 },
  { id: 'streak7', t: 'Wochenheld', d: '7 Tage Serie', ok: () => S.streak.best >= 7 },
  { id: 'streak30', t: 'Unaufhaltsam', d: '30 Tage Serie', ok: () => S.streak.best >= 30 },
  { id: 'sprint20', t: 'Schnellleser', d: '20 Noten in einem Sprint', ok: () => S.stats.sprintBest >= 20 },
  { id: 'sprint40', t: 'Blitzleser', d: '40 Noten in einem Sprint', ok: () => S.stats.sprintBest >= 40 },
  { id: 'ear25', t: 'Gutes Gehör', d: '25 richtige Antworten im Gehörtraining', ok: () => S.stats.earCorrect >= 25 },
  { id: 'ear100', t: 'Goldohr', d: '100 richtige Antworten im Gehörtraining', ok: () => S.stats.earCorrect >= 100 },
  { id: 'perfect', t: 'Fehlerfrei', d: '100 % im Rhythmus-Modus', ok: () => S.stats.perfect > 0 },
  { id: 'xp1000', t: 'Tausender', d: '1.000 XP gesammelt', ok: () => S.xp >= 1000 },
  { id: 'xp5000', t: 'Fünftausender', d: '5.000 XP gesammelt', ok: () => S.xp >= 5000 },
  { id: 'night', t: 'Nachteule', d: 'Nach 22 Uhr geübt', ok: () => false },
  { id: 'early', t: 'Frühaufsteher', d: 'Vor 7 Uhr geübt', ok: () => false },
  { id: 'ultra', t: 'Ultra-God', d: 'Level 50 erreicht', ok: () => levelInfo().level >= 50 },
];
export function unlock(id) {
  if (S.ach[id]) return;
  S.ach[id] = Date.now();
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (a) notify({ kind: 'ach', text: `Erfolg: ${a.t}` });
}
export function checkAchievements() {
  for (const a of ACHIEVEMENTS) if (!S.ach[a.id] && a.ok()) unlock(a.id);
}

// ---------- Sync-Code ----------
export function exportCode() {
  const json = JSON.stringify(S);
  const b = btoa(unescape(encodeURIComponent(json)));
  return 'KQ1-' + b;
}
export function importCode(code) {
  code = code.trim().replace(/\s+/g, '');
  if (!code.startsWith('KQ1-')) throw new Error('Das ist kein gültiger Sync-Code.');
  const d = JSON.parse(decodeURIComponent(escape(atob(code.slice(4)))));
  if (typeof d.xp !== 'number' || typeof d.steps !== 'object') throw new Error('Code unvollständig.');
  // Zusammenführen: jeweils das Bessere behalten
  S.xp = Math.max(S.xp, d.xp);
  for (const [k, v] of Object.entries(d.steps)) S.steps[k] = Math.max(S.steps[k] || 0, v);
  Object.assign(S.bosses, d.bosses || {});
  for (const [k, v] of Object.entries(d.ach || {})) if (!S.ach[k]) S.ach[k] = v;
  if (d.streak && (d.streak.last || '') >= (S.streak.last || '')) S.streak = { ...d.streak, best: Math.max(d.streak.best || 0, S.streak.best) };
  for (const k of Object.keys(S.stats)) S.stats[k] = Math.max(S.stats[k] || 0, d.stats?.[k] || 0);
  if (d.settings && d.updated > S.updated) S.settings = { ...S.settings, ...d.settings, input: S.settings.input };
  rollDay();
  save();
}
export function resetAll() {
  const fresh = DEFAULT();
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, fresh);
  save();
}
