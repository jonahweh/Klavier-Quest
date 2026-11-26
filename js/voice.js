// Gesang: 5-Minuten-Einsingen. Das Klavier spielt ein Muster vor, du singst es nach.
// Jede Wiederholung einen Halbton höher, dann wieder abwärts – angepasst an deine Stimmlage.
import { Listener, Synth, getCtx, unlockAudio } from './audio.js';
import { midiName } from './score.js';
import { ICON, esc } from './player.js';
import { S, save, addXP, taskDone } from './store.js';
import { VOICE_RANGES } from './voice-content.js';

const MAJ = [0, 2, 4, 5, 7, 9, 11, 12];
export const WARMUPS = [
  { id: 'summen', name: 'Summen', syl: 'auf „mmm“, Lippen locker geschlossen', pat: [7, 5, 4, 2, 0], d: 0.55, up: 4 },
  { id: 'lippen', name: 'Lippenflattern', syl: 'auf „brrr“ – wie ein Motorboot', pat: [0, 4, 7, 4, 0], d: 0.5, up: 4 },
  { id: 'dreiklang', name: 'Dreiklang', syl: 'auf „no-o-o“, Mund rund', pat: [0, 4, 7, 12, 7, 4, 0], d: 0.42, up: 3 },
  { id: 'leiter', name: 'Tonleiter', syl: 'auf „la“, leicht und locker', pat: [0, 2, 4, 5, 7, 5, 4, 2, 0], d: 0.36, up: 4 },
  { id: 'staccato', name: 'Staccato', syl: 'auf „ha“ – kurz, aus dem Bauch', pat: [0, 4, 7, 4, 0], d: 0.4, up: 3, short: true },
];

export function warmupScreen(root, back) {
  const vr = VOICE_RANGES[S.settings.voiceType || 'bariton'];
  let xi = 0, rep = 0, running = false, timer = 0, raf = 0, hits = 0, total = 0;
  let plan = null;           // aktuelle Wiederholung: {root, notes:[{m,t,d,phase}], t0}
  const trace = [];
  const exRoots = ex => {
    const top = Math.max(...ex.pat);
    const lo = vr.roots, hi = Math.min(vr.hi - top, lo + ex.up);
    const r = []; for (let m = lo; m <= hi; m++) r.push(m);
    for (let m = hi - 1; m > lo; m--) r.push(m);
    return r;
  };
  const allReps = WARMUPS.reduce((a, ex) => a + exRoots(ex).length, 0);
  let doneReps = 0;

  root.innerHTML = `
  <div class="page narrow warm">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><div><span class="eyebrow">Gesang · ${vr.label}</span><h1>Einsingen</h1></div></header>
    <div class="warm-prog"><i></i></div>
    <div class="warm-card">
      <div class="warm-head"><b class="w-name">${esc(WARMUPS[0].name)}</b><span class="w-syl muted">${esc(WARMUPS[0].syl)}</span></div>
      <div class="warm-phase">Bereit? Erst spielt das Klavier vor, dann singst du nach.</div>
      <canvas class="warm-cv"></canvas>
      <div class="warm-info muted">${S.settings.input === 'mic' ? 'Das Mikrofon hört zu und zeigt dir deine Tonhöhe.' : 'Ohne Mikrofon: Sing einfach mit. Für die Tonhöhen-Anzeige stell in den Einstellungen „Mikrofon“ ein.'}</div>
    </div>
    <div class="warm-ctl">
      <button class="btn ghost" data-a="skip">Übung überspringen</button>
      <button class="btn primary big" data-a="go">${ICON.play} Einsingen starten</button>
    </div>
    <ol class="warm-list">${WARMUPS.map((w, i) => `<li data-i="${i}"><b>${esc(w.name)}</b><span>${esc(w.syl)}</span></li>`).join('')}</ol>
  </div>`;
  const $ = s => root.querySelector(s);
  const cv = $('.warm-cv'), g = cv.getContext('2d');

  const setEx = () => {
    const ex = WARMUPS[xi];
    $('.w-name').textContent = ex.name; $('.w-syl').textContent = ex.syl;
    root.querySelectorAll('.warm-list li').forEach((li, i) => li.className = i < xi ? 'done' : i === xi ? 'cur' : '');
  };
  const prog = () => ($('.warm-prog i').style.width = (doneReps / allReps * 100) + '%');

  function schedule() {
    const ex = WARMUPS[xi];
    const roots = exRoots(ex);
    if (rep >= roots.length) { xi++; rep = 0; if (xi >= WARMUPS.length) return finish(); setEx(); }
    const ex2 = WARMUPS[xi], r = exRoots(ex2)[rep];
    const c = getCtx(), now = c.currentTime, t0 = now + 0.15;
    const d = ex2.d;
    // Vorspiel: Akkord, dann Muster
    Synth.chord([r - 12, r - 5, r + 4], t0, 0.5, 0.55);
    const notes = [];
    const pre = t0 + 0.65;
    ex2.pat.forEach((o, i) => { Synth.note(r + o, pre + i * d, d * (ex2.short ? 0.4 : 0.9), 0.8); notes.push({ m: r + o, t: pre + i * d, d, phase: 'pre' }); });
    const sing = pre + ex2.pat.length * d + d;
    Synth.click(sing - d, true);
    ex2.pat.forEach((o, i) => notes.push({ m: r + o, t: sing + i * d, d: d * (ex2.short ? 0.5 : 1), phase: 'sing' }));
    const end = sing + ex2.pat.length * d + 0.35;
    plan = { root: r, notes, t0, pre, sing, end, ctx0: now, perf0: performance.now() / 1000, frames: notes.filter(n => n.phase === 'sing').map(() => ({ ok: 0, n: 0 })) };
    Listener.muteUntil = performance.now() / 1000 + (sing - now) - 0.05;
    $('.warm-phase').textContent = `Hör zu · Grundton ${midiName(r)}${Math.floor(r / 12) - 1}`;
    timer = setTimeout(() => {
      // Auswertung dieser Wiederholung
      if (S.settings.input === 'mic' && Listener.running) plan.frames.forEach(f => { total++; if (f.n && f.ok / f.n >= 0.4) hits++; });
      rep++; doneReps++; prog();
      if (running) schedule();
    }, (end - now) * 1000);
  }

  function draw() {
    const r = cv.getBoundingClientRect(); if (!r.width) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(r.width * dpr)) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
    const w = r.width, h = r.height;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    if (!plan) return;
    const lo = plan.root - 3, hi = plan.root + 15;
    const Y = m => h - 10 - (m - lo) / (hi - lo) * (h - 20);
    const tA = plan.t0, tB = plan.end;
    const X = t => 10 + (t - tA) / (tB - tA) * (w - 20);
    const nowC = getCtx().currentTime;
    // Raster
    g.strokeStyle = 'rgba(127,127,127,.15)'; g.lineWidth = 1;
    for (let m = lo; m <= hi; m++) { g.beginPath(); g.moveTo(0, Y(m)); g.lineTo(w, Y(m)); g.stroke(); }
    // Trennlinie Vorspiel / Du
    g.fillStyle = 'rgba(76,110,245,.07)'; g.fillRect(X(plan.sing - 0.1), 0, w - X(plan.sing - 0.1), h);
    // Zielbalken
    plan.notes.forEach((n, i) => {
      g.fillStyle = n.phase === 'pre' ? 'rgba(127,127,127,.35)' : 'rgba(64,192,87,.45)';
      const bh = Math.max(6, (h - 20) / (hi - lo) * 0.7);
      g.fillRect(X(n.t), Y(n.m) - bh / 2, Math.max(4, X(n.t + n.d) - X(n.t) - 2), bh);
    });
    // Spielkopf
    g.fillStyle = '#4c6ef5'; g.fillRect(X(nowC) - 1, 0, 2, h);
    // Stimme
    g.lineWidth = 3; g.lineCap = 'round'; let prev = null;
    for (const p of trace) {
      if (p.m == null || p.t < tA) { prev = null; continue; }
      let m = p.m; while (m > hi + 1) m -= 12; while (m < lo - 1) m += 12;
      const pt = [X(p.t), Y(m)];
      if (prev) { g.strokeStyle = p.ok ? '#2f9e44' : '#f08c00'; g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(pt[0], pt[1]); g.stroke(); }
      prev = pt;
    }
    if (nowC >= plan.sing - 0.1 && nowC < plan.end) $('.warm-phase').textContent = 'Jetzt du!';
  }
  const loop = () => { draw(); if (running) raf = requestAnimationFrame(loop); };

  Listener.mode = 'voice';
  Listener.onPitch = p => {
    if (!plan) return;
    const t = getCtx().currentTime;
    let ok = false;
    if (p) {
      const i = plan.notes.findIndex(n => n.phase === 'sing' && t >= n.t && t < n.t + n.d);
      if (i >= 0) {
        const n = plan.notes[i], k = i - plan.notes.filter(x => x.phase === 'pre').length;
        const diff = ((p.midi - n.m) % 12 + 18) % 12 - 6;     // Oktave egal
        ok = Math.abs(diff) <= 0.5;
        const f = plan.frames[k]; if (f) { f.n++; if (ok) f.ok++; }
      }
    }
    trace.push({ t, m: p ? p.midi : null, ok });
    while (trace.length > 600) trace.shift();
  };

  function stop() { running = false; clearTimeout(timer); cancelAnimationFrame(raf); Synth.stopAll(); }
  function finish() {
    stop();
    plan = null; draw();
    const pct = total ? Math.round(hits / total * 100) : null;
    const xp = addXP(15, 'einsingen');
    taskDone('voicewarm');
    S.stats.warmups = (S.stats.warmups || 0) + 1; save();
    $('.warm-phase').textContent = 'Fertig eingesungen!';
    $('.warm-info').textContent = (pct != null ? `${pct} % der Töne getroffen. ` : '') + `+${xp} XP. Deine Stimme ist bereit für die Probe.`;
    $('[data-a=go]').innerHTML = `${ICON.check} Zurück zur Übersicht`;
    $('[data-a=go]').dataset.a = 'back';
    root.querySelectorAll('.warm-list li').forEach(li => (li.className = 'done'));
    $('.warm-prog i').style.width = '100%';
  }

  root.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') { stop(); Listener.onPitch = null; Listener.stop(); return back(); }
    if (b.dataset.a === 'skip') { if (!running) { xi = Math.min(WARMUPS.length - 1, xi + 1); setEx(); return; } clearTimeout(timer); Synth.stopAll(); doneReps += exRoots(WARMUPS[xi]).length - rep; xi++; rep = 0; prog(); if (xi >= WARMUPS.length) return finish(); setEx(); return schedule(); }
    if (b.dataset.a === 'go') {
      if (running) { stop(); b.innerHTML = `${ICON.play} Weiter`; $('.warm-phase').textContent = 'Pause'; return; }
      await unlockAudio();
      if (S.settings.input === 'mic' && !Listener.running) { try { await Listener.start(); Listener.sens = S.settings.sens; } catch (err) { /* ohne Mikro */ } }
      Listener.mode = 'voice';
      running = true;
      b.innerHTML = `${ICON.stop} Pause`;
      setEx();
      schedule();
      loop();
    }
  };
  setEx();
}
