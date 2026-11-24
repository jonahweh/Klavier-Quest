// SVG-Notensatz: Violin- und Bassschlüssel, Akkorde, Hilfslinien, Vorzeichen, Fingersatz, Notennamen
import { G } from './glyphs.js';
import { KEYS, KEY_ORDER, germanName } from './score.js';

const NS = 'http://www.w3.org/2000/svg';
const TOP = { t: 38, b: 26 };      // Schritt der obersten Linie (F5 / A3)
const MID = { t: 34, b: 22 };      // Mittellinie (H4 / D3)
const SHARP_STEPS = { t: [38, 35, 39, 36, 33, 37, 34], b: [24, 21, 25, 22, 19, 23, 20] };
const FLAT_STEPS = { t: [34, 37, 33, 36, 32, 35, 31], b: [20, 23, 19, 22, 18, 21, 17] };

export function renderScore(svg, score, opt = {}) {
  const S = opt.space || 12;               // Linienabstand
  const sc = S / 250;
  const P = opt.pxPerBeat || 78;
  const names = !!opt.names;
  const fingers = opt.fingers !== false;
  const staves = score.staves;
  const T0 = Math.max(64, (opt.tall ? 9.8 : 6) * S);
  const gap = 6.5 * S;
  const top = {};
  staves.forEach((st, i) => (top[st] = T0 + i * (4 * S + gap)));
  const lastTop = top[staves[staves.length - 1]];
  const height = lastTop + 4 * S + Math.max(64, 6.8 * S);

  const keySig = KEYS[score.key] || {};
  const keyAcc = Object.entries(keySig);
  const sharpKey = keyAcc.length && keyAcc[0][1] > 0;
  const nAcc = keyAcc.length;
  const clefW = 3.4 * S, keyW = nAcc * 1.05 * S, timeW = opt.noTime ? 0 : 2.6 * S;
  const H = 10 + clefW + keyW + timeW + 26;
  const X = beat => H + beat * P;
  const width = opt.width || Math.ceil(X(score.total) + 30);

  const yOf = (staff, step) => top[staff] + (TOP[staff] - step) * S / 2;
  let out = '';
  const glyph = (name, x, y, cls = '') => `<path class="${cls}" d="${G[name].d}" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(${sc})"/>`;

  // Notenlinien
  for (const st of staves) {
    for (let l = 0; l < 5; l++) out += `<rect class="ln" x="6" y="${top[st] + l * S - 0.6}" width="${width - 12}" height="1.2"/>`;
    // Schlüssel
    if (st === 't') out += glyph('gClef', 12, top[st] + 3 * S, 'cl');
    else out += glyph('fClef', 12, top[st] + S, 'cl');
    // Tonart
    const order = sharpKey ? SHARP_STEPS[st] : FLAT_STEPS[st];
    for (let i = 0; i < nAcc; i++) {
      out += glyph(sharpKey ? 'accidentalSharp' : 'accidentalFlat', 12 + clefW + i * 1.05 * S, yOf(st, order[i]), 'cl');
    }
    // Taktart
    if (!opt.noTime) {
      const tx = 12 + clefW + keyW + 4;
      const digits = (n, y) => String(n).split('').forEach((d, i, a) => {
        out += glyph('timeSig' + d, tx + (i - (a.length - 1) / 2) * 1.9 * S, y, 'cl');
      });
      digits(score.ts[0], top[st] + S);
      digits(score.ts[1], top[st] + 3 * S);
    }
  }
  // Klammer
  if (staves.length > 1) {
    out += `<rect class="ln" x="5" y="${top[staves[0]]}" width="2" height="${lastTop + 4 * S - top[staves[0]]}"/>`;
  }
  // Spieltechnik (pizz./arco) und Akkordsymbole
  if (score.tech) out += `<text class="tq" x="${H}" y="${T0 - (opt.tall ? 8.6 : 4.6) * S}" style="font-size:${(S * 1.05).toFixed(1)}px">${score.tech === 'pizz' ? 'pizz.' : 'arco'}</text>`;
  if (opt.chords) for (const k of opt.chords) out += `<text class="ch" x="${H + k.beat * P - 4}" y="${T0 - (opt.tall ? 7.2 : 3.2) * S}" style="font-size:${(S * 1.05).toFixed(1)}px">${k.label}</text>`;
  // Taktstriche
  const bars = [];
  const L = score.measure;
  for (let b = L; b < score.total - 1e-6; b += L) bars.push(b);
  const barX = b => X(b) - Math.min(P * 0.32, 26);
  const y1 = top[staves[0]], y2 = lastTop + 4 * S;
  for (const b of bars) out += `<rect class="ln" x="${barX(b)}" y="${y1}" width="1.3" height="${y2 - y1}"/>`;
  if (!opt.noTime) {
    const ex = X(score.total) - Math.min(P * 0.32, 26) + 8;
    out += `<rect class="ln" x="${ex - 6}" y="${y1}" width="1.3" height="${y2 - y1}"/><rect class="ln" x="${ex - 2}" y="${y1}" width="4" height="${y2 - y1}"/>`;
  }
  // Takt-Nummern

  // Noten
  const hw = 1.18 * S;                     // Breite Notenkopf
  const accState = {};
  const evGroups = {};
  for (const n of score.notes) {
    const st = n.staff;
    const x = X(n.beat);
    const measure = Math.floor(n.beat / L + 1e-6);
    const sk = st + measure;
    if (!accState[sk]) accState[sk] = {};
    let g = '';
    const tstr = n.dur;
    if (n.rest) {
      const mid = top[st] + 2 * S;
      const rn = tstr >= 4 ? 'restWhole' : tstr >= 2 ? 'restHalf' : tstr >= 1 ? 'restQuarter' : tstr >= 0.5 ? 'rest8th' : 'rest16th';
      const ry = rn === 'restWhole' ? top[st] + S : mid;
      g += glyph(rn, x - 0.5 * S, ry, 'rs');
      if (isDotted(tstr)) g += glyph('augmentationDot', x + 0.9 * S, mid - S / 2, 'rs');
      out += g;
      continue;
    }
    const heads = n.pitches.map(p => ({ ...p, y: yOf(st, p.step) })).sort((a, b) => a.step - b.step);
    const avg = heads.reduce((s, h) => s + h.step, 0) / heads.length;
    const down = avg >= MID[st];
    const base = baseDur(tstr);
    const headName = base >= 4 ? 'noteheadWhole' : base >= 2 ? 'noteheadHalf' : 'noteheadBlack';
    const hwx = base >= 4 ? 1.6 * S : hw;
    // Sekund-Versatz
    heads.forEach((h, i) => {
      h.dx = 0;
      if (i > 0 && h.step - heads[i - 1].step === 1 && heads[i - 1].dx === 0) h.dx = down ? -hwx : hwx;
    });
    // Hilfslinien
    const ledgers = new Set();
    const topS = TOP[st], botS = TOP[st] - 8;
    for (const h of heads) {
      if (h.step <= botS - 2) for (let s = botS - 2; s >= h.step; s -= 2) ledgers.add(s + '|' + h.dx);
      if (h.step >= topS + 2) for (let s = topS + 2; s <= h.step; s += 2) ledgers.add(s + '|' + h.dx);
    }
    for (const k of ledgers) {
      const [s, dx] = k.split('|').map(Number);
      g += `<rect class="ld" x="${x - hwx / 2 - 0.35 * S + dx}" y="${yOf(st, s) - 0.6}" width="${hwx + 0.7 * S}" height="1.3"/>`;
    }
    // Vorzeichen
    let accCol = 0;
    for (const h of [...heads].reverse()) {
      const cur = h.step in accState[sk] ? accState[sk][h.step] : (keySig[h.letter] || 0);
      if (cur !== h.alter) {
        const an = h.alter === 1 ? 'accidentalSharp' : h.alter === -1 ? 'accidentalFlat' : 'accidentalNatural';
        g += glyph(an, x - hwx / 2 - 1.15 * S - accCol * 0.9 * S + Math.min(0, h.dx), h.y, 'ac');
        accCol = accCol ? 0 : 1;
        accState[sk][h.step] = h.alter;
      }
    }
    // Köpfe
    for (const h of heads) g += glyph(headName, x - hwx / 2 + h.dx, h.y, 'hd');
    // Punkt
    if (isDotted(tstr)) for (const h of heads) {
      const onLine = (TOP[st] - h.step) % 2 === 0;
      g += glyph('augmentationDot', x + hwx / 2 + 0.35 * S + Math.max(0, h.dx), h.y - (onLine ? S / 2 : 0), 'hd');
    }
    // Hals + Fähnchen
    if (base < 4) {
      const stemLen = 3.4 * S;
      const lo = heads[0], hi = heads[heads.length - 1];
      let sx, sy1, sy2;
      if (!down) { sx = x + hw / 2 - 1.2; sy1 = lo.y - 0.15 * S; sy2 = Math.min(hi.y - stemLen, top[st] + 2 * S); }
      else { sx = x - hw / 2; sy1 = hi.y + 0.15 * S; sy2 = Math.max(lo.y + stemLen, top[st] + 2 * S); }
      g += `<rect class="sm" x="${sx}" y="${Math.min(sy1, sy2)}" width="1.25" height="${Math.abs(sy2 - sy1)}"/>`;
      if (base <= 0.5) {
        const fl = base <= 0.25 ? (down ? 'flag16thDown' : 'flag16thUp') : (down ? 'flag8thDown' : 'flag8thUp');
        g += glyph(fl, sx, sy2, 'hd');
      }
    }
    // Fingersatz, Lage, Bogenstrich
    if (fingers) {
      const fs = heads.filter(h => h.finger != null).map(h => h.finger);
      const above = st === 't' || staves.length === 1;
      const fsz = (S * 0.9).toFixed(1);
      if (fs.length || n.posLabel || n.bow) {
        const stTop = top[st], stBot = top[st] + 4 * S;
        if (above) {
          const hiY = heads[heads.length - 1].y;
          let yy = Math.min(stTop - 0.9 * S, hiY - (down ? 1.4 * S : 4.3 * S));
          fs.forEach((f, i) => (g += `<text class="fg" style="font-size:${fsz}px" x="${x}" y="${yy - i * 1.0 * S}">${f}</text>`));
          yy -= Math.max(1, fs.length) * 1.0 * S;
          if (n.bow) { g += glyph(n.bow === 'd' ? 'stringsDownBow' : 'stringsUpBow', x - 0.5 * S, yy, 'bw'); yy -= 1.4 * S; }
          if (n.posLabel) g += `<text class="pl" style="font-size:${(S * 0.95).toFixed(1)}px" x="${x}" y="${yy}">${n.posLabel}</text>`;
        } else {
          const yy = Math.max(stBot + 1.9 * S, heads[0].y + (down ? 4.6 * S : 2.0 * S));
          [...fs].reverse().forEach((f, i) => (g += `<text class="fg" style="font-size:${fsz}px" x="${x}" y="${yy + i * 1.0 * S}">${f}</text>`));
        }
      }
    }
    // Notennamen
    if (names) {
      heads.forEach(h => {
        g += `<text class="nm" style="font-size:${(S * 0.72).toFixed(1)}px;stroke-width:${(S * 0.24).toFixed(1)}px" x="${x + h.dx}" y="${h.y + S * 0.26}">${germanName(h.letter, h.alter)}</text>`;
      });
    }
    const ev = n.ev;
    if (ev != null) (evGroups[ev] ||= []).push(g);
    else out += g;
  }
  for (const [ev, gs] of Object.entries(evGroups)) out += `<g class="ev" data-ev="${ev}">${gs.join('')}</g>`;

  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.innerHTML = out;
  const evEls = [];
  svg.querySelectorAll('g.ev').forEach(e => (evEls[+e.dataset.ev] = e));
  return { X, width, height, evEls, header: H, P };
}

function baseDur(d) {
  for (const b of [4, 2, 1, 0.5, 0.25]) if (Math.abs(d - b) < 1e-6 || Math.abs(d - b * 1.5) < 1e-6) return b;
  return d >= 4 ? 4 : d >= 2 ? 2 : d >= 1 ? 1 : d >= 0.5 ? 0.5 : 0.25;
}
function isDotted(d) {
  return [6, 3, 1.5, 0.75, 0.375].some(b => Math.abs(d - b) < 1e-6);
}

// Mini-Notenbild für Theorie-Karten / Sprint
export function miniScore(svg, score, opt = {}) {
  return renderScore(svg, score, { pxPerBeat: 46, ...opt });
}
