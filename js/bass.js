// Kontrabass: Simandl-Fingersatz, Akkordsymbole, Griffbrett mit Stimmgerät
import { Input, Synth, Listener, unlockAudio, midiToFreq } from './audio.js';
import { midiName } from './score.js';
import { S } from './store.js';

// Klingende Töne der leeren Saiten (E1 A1 D2 G2). Notiert wird eine Oktave höher.
export const OPEN = [28, 33, 38, 43];
export const STRING_NAMES = ['E', 'A', 'D', 'G'];
export const TRANSPOSE = -12;
const POS_NAMES = { 1: '½', 2: 'I', 3: 'II', 4: 'II½', 5: 'III', 6: 'III½', 7: 'IV', 8: 'IV½', 9: 'V', 10: 'V½', 11: 'VI' };
export const posName = p => POS_NAMES[p] || String(p);
const FINGER_OFF = { 1: 0, 2: 1, 4: 2 };   // Simandl: 1-2-4, je ein Halbton

// ---------- Fingersatz (dynamische Programmierung) ----------
// Setzt für jede Note: pitch.finger (0 = leere Saite), pitch.string (0..3), note.pos, note.posLabel (bei Lagenwechsel)
export function applyFingering(score, maxPos = 9) {
  const notes = score.notes.filter(n => !n.rest && n.pitches.length === 1);
  if (!notes.length) return;
  // Bis zur VI. Lage Simandl 1-2-4; ab der Oktave (Halbton 12) Daumenlage: Daumen, 1, 2, 3
  const THUMB = [['T', 0], [1, 1], [1, 2], [2, 3], [2, 4], [3, 5]];
  const optsFor = (m, lim) => {
    const out = [];
    for (let s = 0; s < 4; s++) {
      const n = m - OPEN[s];
      if (n === 0) out.push({ s, n, f: 0, p: null });
      else if (n > 0) {
        if (n <= Math.min(lim, 11) + 2) {
          for (const [f, off] of Object.entries(FINGER_OFF)) {
            const p = n - off;
            if (p >= 1 && p <= Math.min(lim, 11)) out.push({ s, n, f: +f, p });
          }
        }
        if (lim >= 12 && n >= 12 && s >= 1) {
          for (const [f, off] of THUMB) {
            const p = n - off;
            if (p >= 12 && p <= lim + 5) out.push({ s, n, f, p, th: true });
          }
        }
      }
    }
    return out;
  };
  // Zustand: Option + aktuelle Lage
  let layer = [{ key: 'start', cost: 0, cur: 2, s: 2, back: null, opt: null }];
  const layers = [];
  for (const note of notes) {
    const m = note.pitches[0].midi + TRANSPOSE;
    let opts = optsFor(m, maxPos);
    if (!opts.length) opts = optsFor(m, 16);
    if (!opts.length) opts = [{ s: 3, n: m - OPEN[3], f: 4, p: Math.max(1, m - OPEN[3] - 2) }];
    const next = new Map();
    for (const prev of layer) {
      for (const o of opts) {
        const cur = o.p == null ? prev.cur : o.p;
        let c = prev.cost;
        if (o.p != null && o.p !== prev.cur) c += 1.6 + 0.25 * Math.abs(o.p - prev.cur);
        c += 0.12 * Math.abs(o.s - prev.s);
        if (o.p == null) c += 0.05;          // leere Saite: leicht bevorzugt
        else c += 0.03 * o.p;                 // tiefere Lagen bevorzugt
        if (o.f === 4 && o.p >= 5) c += 0.05;
        if (o.th) c += 0.1 + (o.s === 3 ? 0 : 0.15) - (o.f === 'T' && o.n === 12 ? 0.2 : 0);   // Daumen am liebsten aufs Oktav-Flageolett der G-Saite
        const key = `${o.s}|${o.f}|${o.p}|${cur}`;
        const ex = next.get(key);
        if (!ex || c < ex.cost) next.set(key, { key, cost: c, cur, s: o.s, back: prev, opt: o });
      }
    }
    layer = [...next.values()];
    layers.push(layer);
  }
  let best = layer.reduce((a, b) => (b.cost < a.cost ? b : a));
  const seq = [];
  while (best && best.opt) { seq.unshift(best); best = best.back; }
  let lastPos = null;
  seq.forEach((st, i) => {
    const note = notes[i], p = note.pitches[0];
    p.finger = st.opt.f;
    p.string = st.opt.s;
    note.pos = st.cur;
    if (st.opt.p != null && st.opt.p !== lastPos) {
      const lbl = st.opt.th ? 'Daumen' : posName(st.opt.p);
      if (!(st.opt.th && lastPos >= 12)) note.posLabel = lbl;
      lastPos = st.opt.p;
    }
  });
  // Events bekommen Griff-Infos für Hinweise
  for (const ev of score.events) {
    const n = ev.notes.find(x => !x.rest);
    if (n) ev.grip = { s: n.pitches[0].string, f: n.pitches[0].finger, fret: n.pitches[0].midi + TRANSPOSE - OPEN[n.pitches[0].string ?? 3], pos: n.pos };
  }
}

// ---------- Akkordsymbole ----------
const QUAL = {
  '': [0, 4, 7], m: [0, 3, 7], '7': [0, 4, 7, 10], maj7: [0, 4, 7, 11], m7: [0, 3, 7, 10], '6': [0, 4, 7, 9],
  m6: [0, 3, 7, 9], dim: [0, 3, 6], dim7: [0, 3, 6, 9], m7b5: [0, 3, 6, 10], sus4: [0, 5, 7],
};
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export function parseChord(sym) {
  const m = /^([A-G])(#|b)?(maj7|m7b5|dim7|m7|m6|dim|sus4|m|7|6)?$/.exec(sym);
  if (!m) throw new Error('Akkord? ' + sym);
  const root = (ROOT[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { sym, root, iv: QUAL[m[3] || ''] };
}
// "F | Bb7 | F7 Bb7" -> [{beat, dur, chord}]
export function parseChords(str, measure) {
  const out = [];
  str.split('|').map(s => s.trim()).filter(Boolean).forEach((bar, bi) => {
    const syms = bar.split(/\s+/);
    const d = measure / syms.length;
    syms.forEach((s, i) => { if (s !== '-') out.push({ beat: bi * measure + i * d, dur: d, chord: parseChord(s) }); });
  });
  return out;
}
// deutsche Anzeige: Bb -> B, B -> H
export function chordLabel(sym) {
  return sym.replace(/^Bb/, 'B♭').replace(/^B(?!♭)/, 'H').replace(/^([A-G])#/, '$1♯').replace(/^([A-G])b/, '$1♭').replace('maj7', 'maj7').replace('m7b5', 'ø');
}

// Daumen-Zeichen (Kreis mit Strich) für Noten und Griffbrett
export function thumbMark(x, y, r, cls = '') {
  return `<g class="${cls}"><circle cx="${x}" cy="${y - r * 0.35}" r="${r * 0.62}" fill="none" stroke="currentColor" stroke-width="${(r * 0.22).toFixed(2)}"/><line x1="${x}" x2="${x}" y1="${y + r * 0.27}" y2="${y + r}" stroke="currentColor" stroke-width="${(r * 0.22).toFixed(2)}"/></g>`;
}

// ---------- Griffbrett + Stimmgerät ----------
const NS = 'http://www.w3.org/2000/svg';
export class Fingerboard {
  constructor(host, opt = {}) {
    this.host = host;
    this.opt = opt;
    this.frets = opt.frets || 13;
    host.classList.add('fb-host');
    host.innerHTML = `
      <div class="fb-board"><svg class="fbsvg" viewBox="0 0 1000 210"></svg></div>
      <div class="tuner">
        <div class="tu-note">–</div>
        <div class="tu-bar"><i class="tu-zone"></i><i class="tu-mid"></i><i class="tu-needle"></i></div>
        <div class="tu-txt">Spiel einen Ton</div>
      </div>`;
    this.svg = host.querySelector('svg');
    this.draw();
    this.svg.addEventListener('pointerdown', e => this.tap(e));
    this.setTol(opt.tol || 15);
  }
  x(n) {
    const L = 1 - Math.pow(2, -(this.frets + 0.5) / 12);
    return 70 + 905 * (1 - Math.pow(2, -n / 12)) / L;
  }
  y(s) { return 182 - s * 44; }   // G oben, E unten
  draw() {
    let h = `<rect x="58" y="22" width="930" height="182" rx="10" class="fb-wood"/>`;
    h += `<rect x="52" y="20" width="12" height="186" rx="3" class="fb-nut"/>`;
    // Lagen-Markierungen (Finger 1)
    for (const p of [1, 2, 3, 5, 7, 9, 11, 12].filter(p => p <= this.frets)) {
      const x = this.x(p);
      h += `<line x1="${x}" x2="${x}" y1="24" y2="202" class="fb-pos"/><text x="${x}" y="15" class="fb-pl">${p === 12 ? 'Daumen' : posName(p)}</text>`;
    }
    // Halbton-Raster (dezent)
    for (let n = 1; n <= this.frets; n++) h += `<line x1="${this.x(n)}" x2="${this.x(n)}" y1="30" y2="196" class="fb-semi"/>`;
    for (let s = 0; s < 4; s++) {
      h += `<line x1="58" x2="988" y1="${this.y(s)}" y2="${this.y(s)}" class="fb-str" style="stroke-width:${4.6 - s * 0.9}"/>`;
      h += `<text x="14" y="${this.y(s) + 6}" class="fb-sn">${STRING_NAMES[s]}</text>`;
    }
    h += '<g class="fb-dots"></g><g class="fb-ghost"></g>';
    this.svg.innerHTML = h;
    this.dots = this.svg.querySelector('.fb-dots');
    this.ghost = this.svg.querySelector('.fb-ghost');
  }
  spot(s, n) { return n === 0 ? [40, this.y(s)] : [(this.x(n - 1) + this.x(n)) / 2 + (this.x(n) - this.x(n - 1)) * 0.25, this.y(s)]; }
  hint(midis = [], names = false, ev = null) {
    this.target = midis[0] ?? null;
    this.grip = ev?.grip || null;
    if (!midis.length || !ev?.grip) { this.dots.innerHTML = ''; return; }
    const { s, f, fret } = ev.grip;
    if (fret > this.frets) { this.frets = Math.min(22, fret + 2); this.draw(); }
    const [x, y] = this.spot(s, fret);
    let h = '';
    if (fret === 0) h += `<line x1="58" x2="988" y1="${y}" y2="${y}" class="fb-open"/>`;
    h += `<circle cx="${x}" cy="${y}" r="17" class="fb-dot"/>` + (f === 'T' ? thumbMark(x, y, 7, 'fb-th') : `<text x="${x}" y="${y + 6}" class="fb-dt">${f}</text>`);
    if (names) h += fret === 0 ? `<text x="${x + 34}" y="${y + 6}" class="fb-dn">${midiName(midis[0])}</text>` : `<text x="${x}" y="${y - 24}" class="fb-dn">${midiName(midis[0])}</text>`;
    this.dots.innerHTML = h;
  }
  flash(m, cls) {
    const g = this.target === m && this.grip ? { s: this.grip.s, n: this.grip.fret } : this.findSpot(m);
    if (!g) return;
    const [x, y] = this.spot(g.s, g.n);
    this.ghost.innerHTML = `<circle cx="${x}" cy="${y}" r="20" class="fb-gh ${cls}"/>`;
    clearTimeout(this._gt);
    this._gt = setTimeout(() => (this.ghost.innerHTML = ''), 500);
  }
  findSpot(m) {
    let best = null;
    for (let s = 3; s >= 0; s--) { const n = m - OPEN[s]; if (n >= 0 && n <= this.frets) { if (!best || n < best.n) best = { s, n }; } }
    return best;
  }
  tap(e) {
    const r = this.svg.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width * 1000, py = (e.clientY - r.top) / r.height * 210;
    const s = Math.max(0, Math.min(3, Math.round((182 - py) / 44)));
    let n = 0;
    if (px > 60) { let bd = 1e9; for (let k = 1; k <= this.frets; k++) { const d = Math.abs(this.spot(s, k)[0] - px); if (d < bd) { bd = d; n = k; } } }
    const m = OPEN[s] + n;
    unlockAudio();
    if (S.settings.touchSound) { Synth.bass(m, 0, 0.6, true, 0.8); Listener.muteUntil = performance.now() / 1000 + 0.9; }
    this.flash(m, 'ok');
    Input.emit(m, 'touch', performance.now() / 1000, { cents: 0 });
  }
  setTol(t) {
    this.tol = t;
    const z = this.host.querySelector('.tu-zone');
    if (z) { z.style.left = (50 - t) + '%'; z.style.width = (2 * t) + '%'; }
  }
  // p: {midi(float), clarity} | null
  setPitch(p) {
    const note = this.host.querySelector('.tu-note'), nd = this.host.querySelector('.tu-needle'), tx = this.host.querySelector('.tu-txt');
    if (!note) return;
    if (!p) { this.host.classList.remove('tu-live'); return; }
    this.host.classList.add('tu-live');
    let ref = Math.round(p.midi);
    if (this.target != null && Math.abs(p.midi - this.target) < 0.7) ref = this.target;
    const c = Math.max(-50, Math.min(50, (p.midi - ref) * 100));
    note.textContent = midiName(ref) + (Math.floor(ref / 12) - 1);
    nd.style.left = (50 + c) + '%';
    const ok = Math.abs(c) <= this.tol;
    nd.classList.toggle('ok', ok);
    tx.textContent = ok ? 'sauber' : c > 0 ? `${Math.round(c)} ct zu hoch` : `${Math.round(-c)} ct zu tief`;
    tx.className = 'tu-txt ' + (ok ? 'good' : 'bad');
  }
  reveal() {}
}

export const TOLERANCE = { streng: 15, mittel: 25, locker: 40 };
