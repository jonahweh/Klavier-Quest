// Zusatz-Werkzeuge: Einrichtungs-Assistent, Schwachstellen, Tonleiter-Trainer, Jam-Session, Eigene Stücke
import { buildScore, validatePiece, parsePitch, pitchFromMidi, midiLabel, midiName, KEYS } from './score.js';
import { renderScore } from './notation.js';
import { Input, Listener, Synth, Accomp, getCtx, unlockAudio } from './audio.js';
import { Keyboard, ICON, esc } from './player.js';
import { Fingerboard, applyFingering, parseChords, OPEN, TRANSPOSE } from './bass.js';
import { S, save, addXP } from './store.js';
import { PitchRoll } from './pitchroll.js';

const isBass = () => S.instrument === 'bass';
const isVoice = () => S.instrument === 'voice';
const instKey = () => S.instrument || 'piano';
const head = (title, lead = '') => `<header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>${title}</h1></header>${lead ? `<p class="lead">${lead}</p>` : ''}`;

// =============== Einrichtungs-Assistent ===============
export function setupWizard(root, back) {
  const bass = isBass(), voice = isVoice();
  const targets = bass
    ? [[28, 'leere E-Saite'], [33, 'leere A-Saite'], [38, 'leere D-Saite'], [43, 'leere G-Saite']]
    : voice ? [[48, 'C3 – auf „a“ singen'], [52, 'E3'], [55, 'G3'], [50, 'D3']]
    : [[60, 'C4 (Mittel-C)'], [64, 'E4'], [67, 'G4'], [72, 'C5']];
  let unsub = null, timers = [];
  const clear = () => { unsub?.(); unsub = null; timers.forEach(clearTimeout); timers = []; Listener.setExpected([]); Listener.onLevel = null; };
  const done = () => { clear(); back(); };
  const shell = (step, body) => {
    root.innerHTML = `<div class="page narrow wizard">${head('Einrichtung')}<div class="wz-steps">${[1, 2, 3, 4].map(i => `<span class="${i < step ? 'done' : i === step ? 'on' : ''}">${i}</span>`).join('')}</div>${body}</div>`;
    root.onclick = e => { const b = e.target.closest('button'); if (b?.dataset.a === 'back') done(); };
  };
  // Schritt 1: Mikrofon
  async function step1() {
    shell(1, `<h2>Mikrofon</h2><p>Leg dein Gerät nah an ${bass ? 'den Kontrabass (z. B. auf einen Stuhl neben dem Steg)' : voice ? 'dich – etwa eine Armlänge entfernt, auf Brusthöhe' : 'das Keyboard (Lautsprecher-Seite zu den Tasten)'}. Ohne Kopfhörer ist am besten – mit AirPods wähle unten das eingebaute Mikrofon.</p>
      <div class="mt-meter big"><i></i></div>
      <select class="mic-sel"><option value="">Standard</option></select>
      <button class="btn primary big" data-n="1">${ICON.mic} Mikrofon starten</button>`);
    const sel = root.querySelector('.mic-sel');
    const fill = async () => { const m = await Listener.listMics(); sel.innerHTML = '<option value="">Standard</option>' + m.filter(x => x.id && x.id !== 'default').map(x => `<option value="${esc(x.id)}" ${x.id === S.settings.micId ? 'selected' : ''}>${esc(x.label)}</option>`).join(''); };
    fill();
    sel.onchange = () => { S.settings.micId = sel.value || null; Listener.micId = S.settings.micId; save(); if (Listener.running) { Listener.stop(); Listener.start(); } };
    root.onclick = async e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'back') return done();
      if (b.dataset.n === '1') {
        try {
          Listener.mode = bass ? 'bass' : voice ? 'voice' : 'piano';
          await Listener.start(); Listener.sens = S.settings.sens; fill();
          Listener.onLevel = (l, n) => { const i = root.querySelector('.mt-meter i'); if (i) i.style.width = Math.max(0, Math.min(100, (l - n) / 30 * 100)) + '%'; };
          b.textContent = 'Weiter'; b.dataset.n = '2';
        } catch (err) { b.textContent = 'Kein Zugriff – Berechtigung in den Einstellungen erlauben'; }
      } else if (b.dataset.n === '2') step2();
    };
  }
  // Schritt 2: Töne
  function step2() {
    let i = 0, tries = 0;
    const results = [];
    const show = () => {
      shell(2, `<h2>Töne erkennen</h2><p>Spiel nacheinander die angezeigten Töne, jeweils kräftig und mit etwas Klingen-Lassen.</p>
        <div class="wz-target"><span>Spiel jetzt</span><b>${targets[i][1]}</b><em class="wz-fb"></em></div>
        <ul class="wz-res">${results.map(r => `<li class="${r.ok ? 'ok' : 'bad'}">${r.ok ? ICON.check : '✗'} ${r.name}${r.c != null ? ` · ${Math.abs(r.c) <= 10 ? 'gut gestimmt' : `${Math.abs(r.c)} ct zu ${r.c > 0 ? 'hoch' : 'tief'} – nachstimmen`}` : ''}</li>`).join('')}</ul>
        <button class="btn ghost" data-skip="1">Überspringen</button>`);
      root.querySelector('[data-skip]').onclick = () => next(false);
    };
    const next = (ok, c = null) => {
      timers.forEach(clearTimeout); timers = [];
      results.push({ name: targets[i][1], ok, c });
      i++; tries = 0;
      if (i >= targets.length) { unsub(); unsub = null; return step3(results); }
      arm();
    };
    const arm = () => {
      show();
      Listener.setExpected([targets[i][0]]);
      timers.push(setTimeout(() => {
        if (tries < 2) {
          tries++;
          S.settings.sens = Math.min(1, S.settings.sens + 0.15); Listener.sens = S.settings.sens; save();
          const f = root.querySelector('.wz-fb'); if (f) f.textContent = 'Noch nichts gehört – ich stelle das Mikrofon empfindlicher. Nochmal!';
          arm();
        } else next(false);
      }, 9000));
    };
    unsub = Input.on(({ midi, cents }) => {
      const want = targets[i]?.[0];
      if (want == null) return;
      if (midi === want || ((bass || voice) && Math.abs(midi - want) === 12)) next(true, bass && cents != null ? Math.round(cents) : null);
    });
    arm();
  }
  // Schritt 3: Latenz
  function step3(res) {
    const okCount = res.filter(r => r.ok).length;
    shell(3, `<h2>Timing messen</h2><p>${okCount}/${res.length} Töne erkannt. Jetzt messe ich die Verzögerung: Du hörst 8 Klicks. <b>Ab Klick 5</b> spielst du bei jedem Klick einen kurzen Ton – ${bass ? 'z. B. die leere A-Saite gezupft' : 'z. B. das C4'}.</p>
      <div class="wz-count">–</div>
      <button class="btn primary big" data-go="1">${ICON.play} Klicks starten</button>
      <button class="btn ghost" data-skipl="1">Überspringen</button>`);
    root.querySelector('[data-skipl]').onclick = () => step4(null, res);
    root.querySelector('[data-go]').onclick = async e => {
      e.target.closest('button').disabled = true;
      await unlockAudio();
      const spb = 60 / 80, c = getCtx(), t0c = c.currentTime + 0.5, t0p = performance.now() / 1000 + 0.5;
      for (let k = 0; k < 8; k++) Synth.click(t0c + k * spb, k === 0 || k === 4);
      const hits = [];
      Listener.setExpected([]);
      const un = Input.on(({ t }) => hits.push(t));
      for (let k = 0; k < 8; k++) timers.push(setTimeout(() => { const el = root.querySelector('.wz-count'); if (el) el.textContent = k < 4 ? `${k + 1} (zuhören)` : `${k + 1} – spielen!`; }, (0.5 + k * spb) * 1000));
      timers.push(setTimeout(() => {
        un();
        const clicks = [4, 5, 6, 7].map(k => t0p + k * spb);
        const d = [];
        for (const ct of clicks) { const h = hits.filter(t => t > ct - 0.25 && t < ct + 0.45).sort((a, b) => Math.abs(a - ct) - Math.abs(b - ct))[0]; if (h != null) d.push(h - ct); }
        d.sort((a, b) => a - b);
        const lat = d.length >= 2 ? d[Math.floor(d.length / 2)] : null;
        step4(lat, res);
      }, (0.5 + 8 * spb + 0.6) * 1000));
    };
  }
  // Schritt 4: Fertig
  function step4(lat, res) {
    let txt = 'Timing nicht gemessen – der bisherige Wert bleibt.';
    if (lat != null) {
      const ms = Math.max(0, Math.min(250, Math.round(lat * 100) * 10));
      if (bass || voice) S.settings.latencyBass = ms; else S.settings.latency = ms;
      txt = `Verzögerung: ${ms} ms – im Rhythmus-Modus wird das jetzt automatisch ausgeglichen.`;
    }
    S.settings.setupDone = true; save();
    shell(4, `<h2>Fertig!</h2><p>${res.filter(r => r.ok).length}/${res.length} Töne erkannt · Empfindlichkeit ${Math.round(S.settings.sens * 100)} %</p><p>${txt}</p>
      ${res.some(r => !r.ok) ? '<p class="note">Nicht alle Töne wurden erkannt. Leg das Gerät näher ans Instrument oder probier ein anderes Mikrofon.</p>' : ''}
      <button class="btn primary big" data-fin="1">Los geht’s</button>`);
    root.querySelector('[data-fin]').onclick = done;
  }
  step1();
}

// =============== Schwachstellen ===============
export function statsScreen(root, back, play) {
  const bass = isBass();
  const data = (S.noteStats && S.noteStats[instKey()]) || {};
  const rows = Object.entries(data).map(([m, v]) => ({ m: +m, ...v, rate: v.n ? v.err / v.n : 0, cents: v.cn ? Math.round(v.c / v.cn) : null })).filter(r => r.n >= 3);
  rows.sort((a, b) => b.rate - a.rate || (b.cents || 0) - (a.cents || 0));
  const label = m => midiLabel(bass ? m - TRANSPOSE : m);
  const weak = rows.filter(r => r.rate > 0.1 || (r.cents != null && r.cents > 20)).slice(0, 6);
  root.innerHTML = `<div class="page narrow">${head('Deine Schwachstellen', 'Die App merkt sich bei jedem Spielen, welche Töne danebengehen. Hier siehst du, wo es noch hakt – und kannst genau diese Töne üben.')}
    ${rows.length ? `<table class="stat-table"><thead><tr><th>Ton</th><th>gespielt</th><th>Fehlerquote</th>${bass || isVoice() ? '<th>Intonation</th>' : ''}</tr></thead><tbody>
      ${rows.slice(0, 24).map(r => `<tr><td><b>${label(r.m)}</b></td><td class="num">${r.n}</td><td><span class="bar"><i style="width:${Math.round(r.rate * 100)}%" class="${r.rate > 0.3 ? 'bad' : r.rate > 0.1 ? 'mid' : ''}"></i></span> ${Math.round(r.rate * 100)} %</td>${bass ? `<td class="num">${r.cents != null ? r.cents + ' ct' : '–'}</td>` : ''}</tr>`).join('')}
    </tbody></table>` : '<p class="muted">Noch zu wenig Daten. Spiel ein paar Stücke, dann erscheint hier deine Auswertung.</p>'}
    ${weak.length >= 2 ? `<button class="btn primary big" data-a="drill">${ICON.wand} Gezielt üben: ${weak.map(r => label(r.m).replace(/\d/, '')).join(', ')}</button>` : ''}
    ${rows.length ? '<button class="btn ghost" data-a="reset">Statistik zurücksetzen</button>' : ''}
  </div>`;
  root.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') back();
    if (b.dataset.a === 'reset') { if (S.noteStats) delete S.noteStats[instKey()]; save(); statsScreen(root, back, play); }
    if (b.dataset.a === 'drill') {
      let ms = weak.map(r => r.m);
      if (ms.length < 4) ms = [...new Set([...ms, ...rows.slice(0, 6).map(r => r.m)])];
      const tok = m => pitchFromMidi(bass ? m - TRANSPOSE : m);
      let cfg;
      if (bass || isVoice()) cfg = { layout: 'b', b: ms.sort((a, b) => a - b).map(tok), patterns: ['qh'], bars: 8, tempo: 66 };
      else {
        const t = ms.filter(m => m >= 60).sort((a, b) => a - b).map(tok), bb = ms.filter(m => m < 60).sort((a, b) => a - b).map(tok);
        cfg = t.length && bb.length ? { layout: 'alt', t: t.length > 1 ? t : [...t, 'C4'], b: bb.length > 1 ? bb : [...bb, 'C3'], patterns: ['qh'], bars: 8, tempo: 66 }
          : t.length ? { layout: 't', t: t.length > 1 ? t : [...t, 'C4'], patterns: ['qh'], bars: 8, tempo: 66 }
            : { layout: 'b', b: bb.length > 1 ? bb : [...bb, 'C3'], patterns: ['qh'], bars: 8, tempo: 66 };
      }
      play({ type: 'drill', id: 'weak', title: 'Gezielte Übung', cfg }, () => statsScreen(root, back, play));
    }
  };
}

// =============== Tonleiter-Trainer ===============
const STEPS = { dur: [2, 2, 1, 2, 2, 2, 1], moll: [2, 1, 2, 2, 1, 3, 1], 'moll-nat': [2, 1, 2, 2, 1, 2, 2] };
const REL_MAJOR = { A: 'C', E: 'G', B: 'D', 'F#': 'A', 'C#': 'E', D: 'F', G: 'Bb', C: 'Eb' };
const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], NAT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
export function scaleNotes(root, type, oct, octaves) {
  const steps = STEPS[type];
  let li = LET.indexOf(root[0]), o = oct;
  let pitch = parsePitch(root + oct).midi;
  const up = [root + oct];
  for (let k = 0; k < 7 * octaves; k++) {
    pitch += steps[k % 7];
    li++; if (li > 6) { li = 0; o++; }
    const L = LET[li], natural = 12 * (o + 1) + NAT[L], alter = pitch - natural;
    up.push(L + (alter === 1 ? '#' : alter === -1 ? 'b' : alter === 2 ? 'x' : alter === -2 ? 'bb' : '') + o);
  }
  return up;
}
export function scaleTrainer(root, back, play) {
  const bass = isBass();
  const st = Object.assign({ root: 'C', type: 'dur', oct: 1, hand: 'r', rh: 'q' }, JSON.parse(localStorage.getItem('kq-scale-' + (bass ? 'b' : 'p')) || '{}'));
  const roots = st.type === 'dur' ? ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'] : ['A', 'E', 'B', 'F#', 'C#', 'D', 'G', 'C'];
  if (!roots.includes(st.root)) st.root = roots[0];
  const name = r => (st.type === 'dur' ? r.replace('Bb', 'B').replace('Eb', 'Es') + '-Dur' : r.toLowerCase().replace('f#', 'fis').replace('c#', 'cis').replace(/^b$/, 'h') + '-Moll');
  const opt = (k, v, l) => `<button class="${st[k] === v ? 'on' : ''}" data-k="${k}" data-v="${v}">${l}</button>`;
  root.innerHTML = `<div class="page narrow">${head('Tonleiter-Trainer', 'Tonleitern auf und ab – die beste Übung für Fingersatz, Lagen und Intonation.')}
    <div class="form">
      <label>Art</label><div class="seg">${opt('type', 'dur', 'Dur')}${opt('type', 'moll', 'Moll (harmonisch)')}${opt('type', 'moll-nat', 'Moll (natürlich)')}</div>
      <label>Tonart</label><div class="seg">${roots.map(r => opt('root', r, name(r))).join('')}</div>
      <label>Umfang</label><div class="seg">${opt('oct', 1, '1 Oktave')}${opt('oct', 2, '2 Oktaven')}</div>
      ${bass ? '' : `<label>Hand</label><div class="seg">${opt('hand', 'r', 'Rechts')}${opt('hand', 'l', 'Links')}${opt('hand', 'b', 'Beide')}</div>`}
      <label>Rhythmus</label><div class="seg">${opt('rh', 'q', 'Viertel')}${opt('rh', 'e', 'Achtel')}</div>
    </div>
    <button class="btn primary big" data-a="go">${ICON.scale} ${name(st.root)} üben</button></div>`;
  root.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') return back();
    if (b.dataset.k) {
      let v = b.dataset.v; if (/^\d$/.test(v)) v = +v;
      st[b.dataset.k] = v;
      localStorage.setItem('kq-scale-' + (bass ? 'b' : 'p'), JSON.stringify(st));
      return scaleTrainer(root, back, play);
    }
    if (b.dataset.a === 'go') {
      const pc = NAT[st.root[0]] + (st.root[1] === '#' ? 1 : st.root[1] === 'b' ? -1 : 0);
      const key = st.type === 'dur' ? (KEYS[st.root] ? st.root : 'C') : (REL_MAJOR[st.root] || 'C');
      const build = startOct => {
        const up = scaleNotes(st.root, st.type, startOct, st.oct);
        const seq = [...up, ...up.slice(0, -1).reverse()];
        const d = st.rh;
        const toks = seq.slice(0, -1).map((n, i) => n + (i === 0 ? '/' + d : ''));
        const used = (seq.length - 1) * (d === 'q' ? 1 : 0.5);
        const rest = 4 - (used % 4 || 4) || 4;
        const last = { 4: 'w', 2: 'h', 1: 'q', 3: 'h.', 0.5: 'e', 1.5: 'q.', 2.5: 'h', 3.5: 'h.' }[rest] || 'q';
        toks.push(seq[seq.length - 1] + '/' + last);
        // falls Rest nicht exakt darstellbar: Pause auffüllen
        const fill = { 2.5: ' r/e', 3.5: ' r/e' }[rest] || '';
        return toks.join(' ') + fill;
      };
      let piece;
      if (bass) {
        const so = pc >= 4 ? 2 : 3;
        if (st.oct === 2 && parsePitch(scaleNotes(st.root, st.type, so, 2).at(-1)).midi > 67) st.oct = 1;   // zu hoch für die Lagen
        piece = { ts: [4, 4], key, tempo: 66, lh: build(so), staves: ['b'], tech: 'arco' };
      } else {
        piece = { ts: [4, 4], key, tempo: 72 };
        if (st.hand !== 'l') piece.rh = build(4);
        if (st.hand !== 'r') piece.lh = build(3);
      }
      play({ type: 'drill', id: 'scale', title: `${name(st.root)} – Tonleiter`, fixed: piece }, () => scaleTrainer(root, back, play));
    }
  };
}

// =============== Jam-Session (Improvisation) ===============
const JAMS = [
  { id: 'blues', name: 'Blues in F', style: 'swing', tempo: 100, chords: 'F7 | Bb7 | F7 | F7 | Bb7 | Bb7 | F7 | D7 | Gm7 | C7 | F7 D7 | Gm7 C7', scale: [5, 8, 10, 11, 0, 3], scaleName: 'F-Blues-Tonleiter: F As B H C Es' },
  { id: 'pop', name: 'Pop in C', style: 'straight', tempo: 92, chords: 'C | G | Am | F | C | G | Am | F', scale: [0, 2, 4, 7, 9], scaleName: 'C-Dur-Pentatonik: C D E G A' },
  { id: 'moll', name: 'Moll-Groove in a', style: 'straight', tempo: 84, chords: 'Am | F | C | G | Am | F | C | E', scale: [9, 0, 2, 4, 7], scaleName: 'a-Moll-Pentatonik: A C D E G' },
  { id: 'walz', name: 'Walzer in D', style: 'waltz', tempo: 120, ts: 3, chords: 'D | D | A | A | A | A | D | D', scale: [2, 4, 6, 7, 9, 11, 1], scaleName: 'D-Dur: D E Fis G A H Cis' },
];
export function jamSession(root, back) {
  const bass = isBass();
  let jam = JAMS[0], loops = 3, running = false, unsub = null, raf = 0, good = 0, bad = 0;
  const render = () => {
    root.innerHTML = `<div class="page narrow jam">${head('Jam-Session', 'Improvisieren über eine Begleitung: Jeder Ton aus der angezeigten Tonleiter passt. Es gibt kein Richtig oder Falsch – nur „klingt gut“ und „klingt spannend“.')}
      <div class="seg">${JAMS.map(j => `<button class="${j === jam ? 'on' : ''}" data-j="${j.id}">${j.name}</button>`).join('')}</div>
      <p class="hint-line">${bass ? 'Tipp für Bass: Spiel auf der „Eins“ jedes Taktes den Grundton des Akkords, dazwischen Töne aus der Tonleiter.' : S.instrument === 'voice' ? 'Tipp: Sing auf „du-ba“ kurze Motive aus der Tonleiter. Starte mit dem Grundton und wiederhole Ideen leicht verändert.' : 'Tipp: Linke Hand Grundton, rechte Hand Melodie aus der Tonleiter.'}</p>
      <div class="jam-stage"><div class="jam-chord">–</div><div class="jam-scale">${jam.scaleName}</div><div class="jam-score"><span class="g">0</span> passend · <span class="b">0</span> spannend</div></div>
      <div class="kb jam-kb"></div>
      <button class="btn primary big" data-a="go">${ICON.jam} Jam starten (${loops}× Durchlauf)</button></div>`;
    const host = root.querySelector('.kb');
    const voice = S.instrument === 'voice';
    const kb = bass ? new Fingerboard(host, { tol: 30 }) : voice ? new PitchRoll(host, { tol: 50 }) : new Keyboard(host, 48, 83);
    if (voice) Listener.onPitch = p => kb.setPitch(p);
    if (!bass && !voice) kb.hint(Array.from({ length: 36 }, (_, i) => 48 + i).filter(m => jam.scale.includes(m % 12)));
    root.kb = kb;
  };
  const stop = () => { running = false; cancelAnimationFrame(raf); unsub?.(); unsub = null; Accomp.stop(); Synth.stopAll(); Listener.setExpected([]); };
  render();
  root.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') { stop(); return back(); }
    if (b.dataset.j) { stop(); jam = JAMS.find(j => j.id === b.dataset.j); return render(); }
    if (b.dataset.a === 'go') {
      if (running) { stop(); b.innerHTML = `${ICON.jam} Jam starten`; finish(); return; }
      await unlockAudio();
      Listener.mode = bass ? 'bass' : S.instrument === 'voice' ? 'voice' : 'piano';
      if (S.instrument === 'voice') Listener.onPitch = p => root.kb?.setPitch(p);
      if (S.settings.input === 'mic') { try { await Listener.start(); Listener.sens = S.settings.sens; } catch (err) { /* Touch */ } }
      Listener.setExpected([]);
      running = true; good = 0; bad = 0;
      b.innerHTML = `${ICON.stop} Stopp`;
      const measure = jam.ts || 4, spb = 60 / jam.tempo;
      const one = jam.chords.split('|').length;
      const str = Array(loops).fill(jam.chords).join(' | ');
      const chords = parseChords(str, measure);
      const c = getCtx(), t0 = c.currentTime + 0.4 + measure * spb, p0 = performance.now() / 1000 + 0.4 + measure * spb;
      for (let k = 0; k < measure; k++) Synth.click(c.currentTime + 0.4 + k * spb, k === 0);
      Accomp.schedule(chords, spb, t0, jam.style, measure, S.settings.accVol ?? 1.2);
      // Bass bekommt Klavier-Begleitung, Klavier zusätzlich eine Basslinie
      if (!bass) for (const k of chords) Synth.bass(36 + ((k.chord.root - 36) % 12 + 12) % 12, t0 + k.beat * spb, k.dur * spb * 0.9, true, 0.8);
      const total = one * loops * measure * spb;
      const ch = root.querySelector('.jam-chord'), g = root.querySelector('.jam-score .g'), bd = root.querySelector('.jam-score .b');
      unsub = Input.on(({ midi }) => {
        if (!running) return;
        const ok = jam.scale.includes(((midi % 12) + 12) % 12);
        if (ok) good++; else bad++;
        root.kb?.flash(midi, ok ? 'ok' : 'bad');
        g.textContent = good; bd.textContent = bad;
      });
      const loop = () => {
        if (!running) return;
        const s = performance.now() / 1000 - p0;
        if (s < 0) ch.textContent = 'Einzählen …';
        else {
          const beat = s / spb;
          const cur = chords.filter(k => k.beat <= beat + 1e-6).pop();
          if (cur) ch.textContent = cur.chord.sym.replace(/^Bb/, 'B').replace(/^B(?!b)/, 'B');
        }
        if (s > total + 0.5) { stop(); b.innerHTML = `${ICON.jam} Jam starten (${loops}× Durchlauf)`; return finish(); }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }
  };
  function finish() {
    const xp = addXP(Math.min(40, Math.round(good / 3)), 'jam');
    const ch = root.querySelector('.jam-chord'); if (ch) ch.textContent = `+${xp} XP`;
  }
}

// =============== Eigene Stücke ===============
export function customList(root, back, play) {
  const bass = isBass();
  const mine = Object.entries(S.custom || {}).filter(([, p]) => (p.inst || 'piano') === instKey());
  root.innerHTML = `<div class="page narrow">${head('Eigene Stücke', 'Tipp eigene Stücke oder Stimmen ab – zum Beispiel aus dem Orchester oder Musical. Sie erscheinen bei den Wunschstücken und werden mit dem Fortschritt synchronisiert.')}
    <button class="btn primary big" data-a="new">${ICON.edit} Neues Stück</button>
    <ul class="lib">${mine.map(([id, p]) => `<li><button data-play="${id}">${ICON.note}<b>${esc(p.title)}</b><span class="muted">${esc(p.by || '')}</span></button><button class="icon-btn" data-edit="${id}" aria-label="Bearbeiten">${ICON.edit}</button></li>`).join('') || '<li class="muted">Noch keine eigenen Stücke.</li>'}</ul>
    <p class="hint-line">Du kannst mir auch einfach Fotos oder PDFs deiner Noten im Chat schicken – ich schreibe sie dann ab und baue sie ein.</p></div>`;
  root.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') return back();
    if (b.dataset.a === 'new') return customEditor(root, null, () => customList(root, back, play));
    if (b.dataset.edit) return customEditor(root, b.dataset.edit, () => customList(root, back, play));
    if (b.dataset.play) return play(b.dataset.play, () => customList(root, back, play));
  };
}
export function customEditor(root, id, back) {
  const bass = isBass(), voice = isVoice();
  const p = (id && S.custom?.[id]) || { title: '', by: '', key: 'C', ts: [4, 4], tempo: 80, tech: 'arco', rh: '', lh: '', voice: '', chords: '', inst: instKey() };
  const keys = ['C', 'G', 'D', 'A', 'E', 'F', 'Bb', 'Eb'];
  const tss = ['4/4', '3/4', '2/4', '6/8', '2/2'];
  root.innerHTML = `<div class="page narrow editor">${head(id ? 'Stück bearbeiten' : 'Neues Stück')}
    <div class="form wide">
      <label>Titel <input class="inp" data-f="title" value="${esc(p.title)}" placeholder="z. B. Mysterious Worlds – Nr. 3"></label>
      <label>Komponist / Quelle <input class="inp" data-f="by" value="${esc(p.by || '')}"></label>
      <div class="row-3">
        <label>Vorzeichen <select class="inp" data-f="key">${keys.map(k => `<option value="${k}" ${p.key === k ? 'selected' : ''}>${k === 'C' ? 'keine' : k + (KEYS[k] && Object.values(KEYS[k])[0] > 0 ? ` (${Object.keys(KEYS[k]).length}♯)` : ` (${Object.keys(KEYS[k]).length}♭)`)}</option>`).join('')}</select></label>
        <label>Takt <select class="inp" data-f="ts">${tss.map(t => `<option ${p.ts.join('/') === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
        <label>Tempo <input class="inp" type="number" min="30" max="220" data-f="tempo" value="${p.tempo}"></label>
      </div>
      ${bass ? `<label>Spielweise <select class="inp" data-f="tech"><option value="arco" ${p.tech !== 'pizz' ? 'selected' : ''}>arco (Bogen)</option><option value="pizz" ${p.tech === 'pizz' ? 'selected' : ''}>pizz. (gezupft)</option></select></label>
        <label>Basslinie (wie notiert)<textarea class="inp code" rows="5" data-f="lh" placeholder="G2/q A2 B2 C3 | D3/h G2/h">${esc(p.lh || '')}</textarea></label>`
      : voice ? `<label>Deine Stimme (Bassschlüssel, wie gesungen)<textarea class="inp code" rows="5" data-f="voice" placeholder="D3/q G3 B3 A3 | G3/h D3/h">${esc(p.voice || '')}</textarea></label>`
      : `<label>Rechte Hand (Violinschlüssel)<textarea class="inp code" rows="4" data-f="rh" placeholder="C4/q D4 E4 F4 | G4/w">${esc(p.rh || '')}</textarea></label>
        <label>Linke Hand (Bassschlüssel, optional)<textarea class="inp code" rows="3" data-f="lh" placeholder="C3/w | G2/w">${esc(p.lh || '')}</textarea></label>`}
      <label>Akkorde für die Begleitung (optional, ein Eintrag pro Takt)<input class="inp code" data-f="chords" value="${esc(p.chords || '')}" placeholder="C | G | Am | F"></label>
    </div>
    <details class="help"><summary>So schreibst du Noten</summary>
      <p><code>C4</code> = Mittel-C, <code>F#3</code> = Fis, <code>Bb2</code> = B (deutsch), <code>B3</code> = H. Kontrabass wird wie üblich notiert (klingt eine Oktave tiefer).</p>
      <p>Dauer hinter <code>/</code>: <code>w</code> Ganze, <code>h</code> Halbe, <code>q</code> Viertel, <code>e</code> Achtel, <code>s</code> Sechzehntel, <code>t</code> Triolen-Achtel, Punkt verlängert (<code>/q.</code>). Die Dauer gilt weiter, bis eine neue kommt.</p>
      <p>Pause: <code>r/q</code>. Akkord: <code>C3+E3+G3/h</code>. Haltebogen: <code>~</code> ans Ende (<code>E3/w~ E3/q</code>). Fingersatz: <code>C4:1</code>. Taktstrich: <code>|</code> (wird geprüft).</p>
    </details>
    <div class="preview"><div class="ex-scroll"><svg class="staff"></svg></div><p class="ed-err"></p></div>
    <div class="row left"><button class="btn primary" data-a="save">Speichern</button><button class="btn ghost" data-a="prev">Vorschau</button>${id ? '<button class="btn danger" data-a="del">Löschen</button>' : ''}</div></div>`;
  const read = () => {
    const q = f => root.querySelector(`[data-f="${f}"]`);
    const ts = q('ts').value.split('/').map(Number);
    const piece = { title: q('title').value.trim() || 'Ohne Titel', by: q('by').value.trim(), key: q('key').value, ts, tempo: Math.max(30, Math.min(220, +q('tempo').value || 80)), inst: instKey(), style: 'Eigenes Stück' };
    if (bass) { piece.lh = q('lh').value.trim(); piece.tech = q('tech').value; piece.style2 = 'klassisch'; }
    else if (voice) { piece.voice = q('voice').value.trim(); piece.style2 = 'klassisch'; }
    else { piece.rh = q('rh').value.trim(); const l = q('lh').value.trim(); if (l) piece.lh = l; piece.style2 = 'klassisch'; }
    const c = q('chords').value.trim(); if (c) piece.chords = c;
    return piece;
  };
  const preview = () => {
    if (!root.querySelector('[data-f="ts"]')) return false;
    const piece = read();
    const err = root.querySelector('.ed-err');
    try {
      if (!(piece.rh || piece.lh || piece.voice)) throw new Error('Noch keine Noten eingegeben.');
      const errs = validatePiece(piece);
      if (piece.chords) { const n = piece.chords.split('|').length; parseChords(piece.chords, piece.ts[0] * 4 / piece.ts[1]); errs.push(...[]); }
      const sc = buildScore(bass ? { ...piece, transpose: TRANSPOSE, staves: [piece.clefs?.lh === 't' ? 't' : 'b'] } : piece);
      if (bass) applyFingering(sc, 11);
      renderScore(root.querySelector('.staff'), sc, { space: 10, pxPerBeat: 52, tall: bass });
      err.textContent = errs.length ? 'Hinweis: ' + errs.slice(0, 3).join(' · ') : '';
      err.className = 'ed-err ' + (errs.length ? 'tip' : '');
      return errs.length === 0 || true;
    } catch (x) { err.textContent = 'Fehler: ' + x.message; err.className = 'ed-err bad'; return false; }
  };
  root.oninput = () => { clearTimeout(root._pt); root._pt = setTimeout(preview, 500); };
  root.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') { root.oninput = null; clearTimeout(root._pt); return back(); }
    if (b.dataset.a === 'prev') preview();
    if (b.dataset.a === 'save') {
      if (!preview()) return;
      const nid = id || 'c-' + Date.now().toString(36);
      (S.custom ||= {})[nid] = read();
      save(); root.oninput = null; clearTimeout(root._pt); back();
    }
    if (b.dataset.a === 'del' && id) { delete S.custom[id]; save(); root.oninput = null; back(); }
  };
  if (p.rh || p.lh) setTimeout(preview, 50);
}
