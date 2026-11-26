// Notentext-Parser, Namen, Zufallsgenerator für Übungen
// Token-Format:  C4  F#4  Bb3  C3+E3+G3  r   optional :Finger (z.B. C4:1 oder C3+E3+G3:5,3,1)
// Dauer: /w /h /q /e /s /t(Triole)  optional Punkt (/q.)  – Dauer gilt weiter, bis eine neue kommt.
// Haltebogen zur nächsten Note: ~ ans Ende (z. B. E3/w~)

const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const DUR = { w: 4, h: 2, q: 1, e: 0.5, s: 0.25, t: 1 / 3 };   // t = Triolen-Achtel
const ACC = { '': 0, '#': 1, 'b': -1, 'x': 2 };

export const KEYS = {
  C: {}, G: { F: 1 }, D: { F: 1, C: 1 }, A: { F: 1, C: 1, G: 1 }, E: { F: 1, C: 1, G: 1, D: 1 },
  F: { B: -1 }, Bb: { B: -1, E: -1 }, Eb: { B: -1, E: -1, A: -1 },
};
export const KEY_ORDER = {
  sharp: ['F', 'C', 'G', 'D', 'A', 'E', 'B'],
  flat: ['B', 'E', 'A', 'D', 'G', 'C', 'F'],
};

export function parsePitch(tok) {
  const m = /^([A-G])(#|b|x)?(-?\d)$/.exec(tok);
  if (!m) throw new Error('Ungültige Note: ' + tok);
  const letter = m[1], acc = m[2] || '', oct = +m[3];
  const alter = ACC[acc];
  return {
    letter, alter, oct,
    midi: 12 * (oct + 1) + SEMI[letter] + alter,
    step: LETTERS.indexOf(letter) + 7 * oct,
  };
}

export function parseVoice(str, staff) {
  const out = [];
  let beat = 0, dur = 1;
  const barChecks = [];
  for (const raw of str.trim().split(/\s+/)) {
    if (!raw) continue;
    if (raw === '|') { barChecks.push(beat); continue; }
    const m = /^([^:/@~]+)(?::([\d,]+))?(?:@([du]))?(?:\/([whqest])(\.)?)?(~)?$/.exec(raw);
    if (!m) throw new Error('Ungültiges Token: ' + raw);
    if (m[4]) dur = DUR[m[4]] * (m[5] ? 1.5 : 1);
    if (m[1] === 'r') {
      out.push({ beat, dur, staff, rest: true, pitches: [] });
    } else {
      const fingers = m[2] ? m[2].split(',').map(Number) : [];
      const pitches = m[1].split('+').map((p, i) => ({ ...parsePitch(p), finger: fingers[i] }));
      const prev = out[out.length - 1];
      const tiedFrom = !!(prev && prev.tieNext && !prev.rest && prev.pitches.map(p => p.midi).join() === pitches.map(p => p.midi).join());
      const note = { beat, dur, staff, rest: false, pitches, bow: m[3] || null, tieNext: !!m[6], tiedFrom };
      if (tiedFrom) { prev.tieTo = note; let h = prev; while (h.tiedFrom && h.tieHead) h = h.tieHead; note.tieHead = h.tieHead || prev; }
      out.push(note);
    }
    beat = Math.round((beat + dur) * 48) / 48;   // Raster: Triolen und Sechzehntel exakt
  }
  for (const n of out) if (n.tieTo && !n.tiedFrom) { let d = n.dur, x = n; while (x.tieTo) { x = x.tieTo; d += x.dur; } n.playDur = d; }
  return { notes: out, length: beat, barChecks };
}

// Ereignisse: alles, was gleichzeitig angeschlagen wird (übergebundene Noten zählen nicht neu)
export function makeEvents(notes, tr = 0) {
  const map = new Map();
  for (const n of notes) {
    n.ev = undefined;
    if (n.rest || n.tiedFrom) continue;
    const k = Math.round(n.beat * 1000);
    if (!map.has(k)) map.set(k, { beat: n.beat, midis: [], notes: [] });
    const e = map.get(k);
    e.notes.push(n);
    for (const p of n.pitches) if (!e.midis.includes(p.midi)) e.midis.push(p.midi);
  }
  const events = [...map.values()].sort((a, b) => a.beat - b.beat);
  events.forEach((e, i) => { e.i = i; e.midis = e.midis.map(m => m + tr).sort((a, b) => a - b); e.notes.forEach(n => (n.ev = i)); });
  return events;
}

// Ausschnitt von Takt a bis Takt b (1-basiert, inklusive)
export function sliceScore(score, a, b) {
  const L = score.measure, s = (a - 1) * L, e = b * L;
  const notes = score.notes.filter(n => n.beat >= s - 1e-6 && n.beat < e - 1e-6).map(n => ({ ...n, beat: n.beat - s, tiedFrom: n.tiedFrom && n.beat > s + 1e-6 }));
  const events = makeEvents(notes, score.transpose || 0);
  for (const ev of events) { const o = score.events.find(x => Math.abs(x.beat - (ev.beat + s)) < 1e-6); if (o && o.grip) ev.grip = o.grip; }
  const all = notes.flatMap(n => n.pitches.map(p => p.midi + (score.transpose || 0)));
  return { ...score, notes, events, total: e - s, offset: s, barOffset: a - 1, lo: all.length ? Math.min(...all) : score.lo, hi: all.length ? Math.max(...all) : score.hi, full: score.full || score };
}

// piece: {ts:[4,4], key:'C', tempo:90, rh:'...', lh:'...'}  (rh -> Violinschlüssel, lh -> Bassschlüssel)
// optional clefs: {rh:'t'|'b', lh:'t'|'b'}
export function buildScore(piece) {
  const ts = piece.ts || [4, 4];
  const voices = [];
  const clef = piece.clefs || {};
  if (piece.rh) voices.push(parseVoice(piece.rh, clef.rh || 't'));
  if (piece.lh) voices.push(parseVoice(piece.lh, clef.lh || 'b'));
  const notes = voices.flatMap(v => v.notes).sort((a, b) => a.beat - b.beat);
  const total = Math.max(...voices.map(v => v.length));
  const staves = [...new Set(voices.map(v => v.notes[0]?.staff).filter(Boolean))].sort((a, b) => (a === 't' ? -1 : 1));
  if (piece.staves) staves.splice(0, staves.length, ...piece.staves);
  const tr = piece.transpose || 0;
  const events = makeEvents(notes, tr);
  const all = notes.flatMap(n => n.pitches.map(p => p.midi + tr));
  return {
    ts, key: piece.key || 'C', tempo: piece.tempo || 80, staves, notes, events, total,
    measure: ts[0] * 4 / ts[1],
    lo: Math.min(...all), hi: Math.max(...all),
    transpose: tr, tech: piece.tech || null, style: piece.style2 || null, chordStr: piece.chords || null, melStr: piece.mel || null,
  };
}

// Prüft Taktlängen (für die Entwicklung)
export function validatePiece(piece) {
  const errs = [];
  const ts = piece.ts || [4, 4];
  const L = ts[0] * 4 / ts[1];
  for (const k of ['rh', 'lh']) {
    if (!piece[k]) continue;
    const v = parseVoice(piece[k], 't');
    v.barChecks.forEach((b, i) => { if (Math.abs(b - (i + 1) * L) > 1e-6) errs.push(`${k} Takt ${i + 1}: endet bei ${b}, erwartet ${(i + 1) * L}`); });
    if (Math.abs(v.length / L - Math.round(v.length / L)) > 1e-6) errs.push(`${k}: Gesamtlänge ${v.length} kein ganzer Takt`);
  }
  if (piece.rh && piece.lh) {
    const a = parseVoice(piece.rh, 't').length, b = parseVoice(piece.lh, 'b').length;
    if (a !== b) errs.push(`rh (${a}) und lh (${b}) unterschiedlich lang`);
  }
  return errs;
}

// ---------- Namen (deutsch) ----------
export function germanName(letter, alter) {
  if (letter === 'B') return alter === -1 ? 'B' : alter === 1 ? 'His' : alter === 0 ? 'H' : 'Heses';
  const base = letter;
  if (alter === 0) return base;
  if (alter === 1) return base + 'is';
  if (alter === 2) return base + 'isis';
  if (alter === -1) return base === 'E' ? 'Es' : base === 'A' ? 'As' : base + 'es';
  return base;
}
const PC_NAMES = ['C', 'Cis', 'D', 'Dis', 'E', 'F', 'Fis', 'G', 'Gis', 'A', 'B', 'H'];
const PC_FLAT = ['C', 'Des', 'D', 'Es', 'E', 'F', 'Ges', 'G', 'As', 'A', 'B', 'H'];
export function midiName(m, flat = false) {
  const pc = ((m % 12) + 12) % 12;
  return (flat ? PC_FLAT : PC_NAMES)[pc];
}
export function midiLabel(m) {
  // Oktav-Bezeichnung: c' = C4
  return midiName(m) + (Math.floor(m / 12) - 1);
}
export function pitchFromMidi(m, preferFlat = false) {
  const pc = ((m % 12) + 12) % 12, oct = Math.floor(m / 12) - 1;
  const sharpMap = [['C', 0], ['C', 1], ['D', 0], ['D', 1], ['E', 0], ['F', 0], ['F', 1], ['G', 0], ['G', 1], ['A', 0], ['A', 1], ['B', 0]];
  const flatMap = [['C', 0], ['D', -1], ['D', 0], ['E', -1], ['E', 0], ['F', 0], ['G', -1], ['G', 0], ['A', -1], ['A', 0], ['B', -1], ['B', 0]];
  const [letter, alter] = (preferFlat ? flatMap : sharpMap)[pc];
  const acc = alter === 1 ? '#' : alter === -1 ? 'b' : '';
  return letter + acc + oct;
}

// ---------- Zufalls-Übungen ----------
// cfg: {ts, key, tempo, bars, rhythms:[...Taktmuster], t:[Töne], b:[Töne], layout:'t'|'b'|'alt'|'both', posT, posB, chordsB}
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const MEASURE_PATTERNS = {
  q: ['q q q q'],
  qh: ['h h', 'q q h', 'h q q', 'q q q q', 'q h q', 'w'],
  qhw: ['h h', 'q q h', 'h q q', 'q q q q', 'w', 'q h q'],
  e: ['e e q q q', 'q e e q q', 'q q e e q', 'e e e e q q', 'q q q q', 'e e q e e q', 'h e e q'],
  rest: ['q q q r', 'q r q q', 'h q r', 'q q h', 'e e q r q', 'q q q q'],
  dot: ['q. e q q', 'h. q', 'q q. e q', 'q. e h', 'q q q q'],
  w3: ['h q', 'q q q', 'h.', 'q h', 'q. e q', 'e e q q'],
  sync: ['e q e q q', 'q e q e q', 'e q e h', 'q q e e q', 'q. e q q'],
};
export function generateDrill(cfg, seed = Date.now()) {
  const R = rng(seed);
  const ts = cfg.ts || [4, 4];
  const pats = (cfg.patterns || ['qh']).flatMap(p => MEASURE_PATTERNS[p] || [p]);
  const bars = cfg.bars || 4;
  const mk = (pool, pos, fingerDir) => {
    const idxs = pool.map(parsePitch);
    let i = Math.floor(R() * idxs.length);
    const tokens = [];
    for (let b = 0; b < bars; b++) {
      const last = b === bars - 1;
      let pat = pats[Math.floor(R() * pats.length)].split(' ');
      if (last) pat = ts[0] === 3 ? ['h.'] : ['w'];
      for (const d of pat) {
        const rest = d.startsWith('r');
        const dur = rest ? (d.slice(1) || 'q') : d;
        if (rest) { tokens.push('r/' + dur); continue; }
        // Zufallsweg, meist schrittweise
        const r = R();
        let step = r < 0.45 ? 1 : r < 0.75 ? 2 : r < 0.9 ? 3 : 4;
        if (R() < 0.5) step = -step;
        if (cfg.stepwise) step = Math.sign(step) * Math.min(Math.abs(step), 2);
        i = Math.max(0, Math.min(idxs.length - 1, i + step));
        if (last) i = 0;
        const p = pool[i];
        let f = '';
        if (pos) {
          const d0 = idxs[i].step - parsePitch(pos).step;
          const fi = fingerDir > 0 ? d0 + 1 : 5 - d0;
          if (fi >= 1 && fi <= 5) f = ':' + fi;
        }
        tokens.push(p + f + '/' + dur);
      }
      tokens.push('|');
    }
    return tokens.join(' ');
  };
  const restBar = ts[0] === 3 ? 'r/h.' : 'r/w';
  const piece = { ts, key: cfg.key || 'C', tempo: cfg.tempo || 70 };
  const layout = cfg.layout || 't';
  if (layout === 't') piece.rh = mk(cfg.t, cfg.posT, 1);
  else if (layout === 'b') { piece.lh = mk(cfg.b, cfg.posB, -1); piece.staves = ['b']; }
  else if (layout === 'alt') {
    // abwechselnd: Takt rechts, Takt links
    const rh = mk(cfg.t, cfg.posT, 1).split(' | ').filter(Boolean);
    const lh = mk(cfg.b, cfg.posB, -1).split(' | ').filter(Boolean);
    const R2 = [], L2 = [];
    for (let b = 0; b < bars; b++) {
      if (b % 2 === 0) { R2.push(rh[b].replace(/\s*\|\s*$/, '')); L2.push(restBar); }
      else { R2.push(restBar); L2.push(lh[b].replace(/\s*\|\s*$/, '')); }
    }
    piece.rh = R2.join(' | '); piece.lh = L2.join(' | ');
  } else if (layout === 'both') {
    piece.rh = mk(cfg.t, cfg.posT, 1);
    // linke Hand: lange Töne / Akkorde aus pool
    const lb = [];
    for (let b = 0; b < bars; b++) {
      const src = cfg.chordsB || cfg.b;
      const c = b === bars - 1 ? src[0] : src[Math.floor(R() * src.length)];
      lb.push(c + (ts[0] === 3 ? '/h.' : '/w'));
    }
    piece.lh = lb.join(' | ');
  }
  return piece;
}
