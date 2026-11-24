// Notenlese-Sprint und Gehörtraining
import { renderScore } from './notation.js';
import { parsePitch, midiName, germanName, pitchFromMidi } from './score.js';
import { Input, Listener, Synth, getCtx, unlockAudio } from './audio.js';
import { Keyboard, ICON, esc } from './player.js';
import { Fingerboard, TRANSPOSE } from './bass.js';
import { S, save, addXP, taskDone, checkAchievements } from './store.js';

const rand = a => a[Math.floor(Math.random() * a.length)];
const range = (a, b) => { const out = []; let p = parsePitch(a); const end = parsePitch(b).step; for (let st = p.step; st <= end; st++) { const L = 'CDEFGAB'[st % 7]; out.push(L + Math.floor(st / 7)); } return out; };

// ================= Notenlese-Sprint =================
export function sprintScreen(root, back) {
  const bass = S.instrument === 'bass';
  const LS = bass ? 'kq-sprint-bass' : 'kq-sprint';
  const cfg = Object.assign({ clef: bass ? 'b' : 't', area: 'in', answer: 'names', acc: false }, JSON.parse(localStorage.getItem(LS) || '{}'));
  if (bass) { cfg.clef = 'b'; if (cfg.answer === 'keys') cfg.answer = 'names'; }
  const opt = (k, v, label) => `<button class="${cfg[k] === v ? 'on' : ''}" data-k="${k}" data-v="${v}">${label}</button>`;
  const setup = () => {
    root.innerHTML = `
    <div class="page narrow">
      <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Notenlese-Sprint</h1></header>
      <p class="lead">60 Sekunden, so viele Noten wie möglich. Trainiert das blitzschnelle Erkennen – die Grundlage fürs Blattspiel.</p>
      <div class="form">
        ${bass ? '' : `<label>Schlüssel</label><div class="seg">${opt('clef', 't', 'Violin')}${opt('clef', 'b', 'Bass')}${opt('clef', 'tb', 'Beide')}</div>`}
        <label>Bereich</label><div class="seg">${opt('area', 'in', 'Im System')}${opt('area', 'ledger', bass ? 'Ganzer Kontrabass' : 'Mit Hilfslinien')}</div>
        <label>Antworten mit</label><div class="seg">${opt('answer', 'names', 'Notennamen')}${bass ? '' : opt('answer', 'keys', 'Klaviatur')}${opt('answer', 'play', bass ? 'Auf dem Bass spielen' : 'Spielen')}</div>
        <label>Vorzeichen</label><div class="seg">${opt('acc', false, 'Ohne')}${opt('acc', true, 'Mit ♯ und ♭')}</div>
        <p class="hint-line">${cfg.answer === 'play' ? (bass ? 'Spielen: Greif die Note auf deinem Kontrabass – in der notierten Lage (klingt eine Oktave tiefer).' : 'Spielen: Du musst die Note in der richtigen Oktave auf deinem Klavier treffen.') : cfg.answer === 'keys' ? 'Klaviatur: Tippe die Taste – die Oktave ist egal.' : 'Notennamen: C D E F G A H – Vorzeichen gehen hier nicht.'}</p>
      </div>
      <div class="best">Bestwert: <b>${S.stats.sprintBest}</b></div>
      <button class="btn primary big" data-a="go">${ICON.bolt} Sprint starten</button>
    </div>`;
    root.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.k) {
        let v = b.dataset.v; if (v === 'true') v = true; if (v === 'false') v = false;
        cfg[b.dataset.k] = v;
        if (cfg.answer === 'names') cfg.acc = false;
        localStorage.setItem(LS, JSON.stringify(cfg));
        setup();
      }
      if (b.dataset.a === 'back') back();
      if (b.dataset.a === 'go') run();
    };
  };
  const pools = {
    t: { in: range('E4', 'F5').concat(['C4', 'D4', 'G5']), ledger: range('A3', 'C6') },
    b: { in: range('G2', 'A3').concat(['E2', 'F2', 'B3', 'C4']), ledger: bass ? range('E2', 'E4') : range('C2', 'E4') },
  };
  async function run() {
    await unlockAudio();
    Listener.mode = bass ? 'bass' : 'piano';
    if (cfg.answer === 'play' && S.settings.input === 'mic') { try { await Listener.start(); Listener.sens = S.settings.sens; } catch (e) { /* Touch geht */ } }
    let left = 60, score = 0, miss = 0, cur = null, lock = false, streak = 0;
    root.innerHTML = `
      <div class="page sprint">
        <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Sprint</h1>
          <div class="sprint-stats"><span class="timer"><b>60</b> s</span><span>Richtig <b class="sc">0</b></span></div></header>
        <div class="sprint-card"><svg class="staff"></svg><div class="sprint-fb"></div></div>
        <div class="answers"></div>
        <div class="kb sprint-kb"></div>
      </div>`;
    const $ = s => root.querySelector(s);
    const svg = $('.staff');
    let kb = null;
    if (cfg.answer === 'names') {
      $('.answers').innerHTML = ['C', 'D', 'E', 'F', 'G', 'A', 'B'].map(l => `<button class="ans" data-l="${l}">${germanName(l, 0)}</button>`).join('');
      $('.kb').remove();
    } else {
      $('.answers').remove();
      if (bass) { kb = new Fingerboard($('.kb'), { tol: 25 }); } else {
      const lo = cfg.answer === 'keys' ? 60 : (cfg.clef === 'b' ? 36 : cfg.clef === 't' ? 57 : 36);
      const hi = cfg.answer === 'keys' ? 71 : (cfg.clef === 'b' ? 64 : 84);
      kb = new Keyboard($('.kb'), lo, hi, { sound: cfg.answer === 'keys' });
      }
    }
    const next = () => {
      const staff = cfg.clef === 'tb' ? rand(['t', 'b']) : cfg.clef;
      let tok;
      do { tok = rand(pools[staff][cfg.area]); } while (cur && tok === cur.tok && Math.random() < 0.8);
      if (cfg.acc && Math.random() < 0.35) tok = tok[0] + (Math.random() < 0.5 ? '#' : 'b') + tok.slice(1);
      const p = parsePitch(tok);
      cur = { tok, p, staff };
      const score = { staves: [staff], key: 'C', ts: [4, 4], measure: 4, total: 1.2, notes: [{ beat: 0.15, dur: 4, staff, rest: false, pitches: [p], ev: 0 }], events: [] };
      renderScore(svg, score, { space: 17, noTime: true, pxPerBeat: 130, width: 270 });
      Listener.setExpected([p.midi + (bass ? TRANSPOSE : 0)]);
    };
    const answer = ok => {
      if (lock) return;
      const fb = $('.sprint-fb');
      if (ok) {
        score++; streak++;
        fb.textContent = streak >= 5 ? `${streak} in Folge!` : '';
        fb.className = 'sprint-fb good';
        $('.sprint-card').classList.remove('flash-bad'); $('.sprint-card').classList.add('flash-ok');
        setTimeout(() => $('.sprint-card')?.classList.remove('flash-ok'), 200);
        $('.sc').textContent = score;
        next();
      } else {
        miss++; streak = 0; lock = true;
        fb.textContent = 'Das war ' + germanName(cur.p.letter, cur.p.alter) + (cfg.answer === 'play' && !bass ? cur.p.oct : '');
        fb.className = 'sprint-fb bad';
        $('.sprint-card').classList.add('flash-bad');
        setTimeout(() => { lock = false; $('.sprint-card')?.classList.remove('flash-bad'); fb.textContent = ''; next(); }, 900);
      }
    };
    const unsub = Input.on(({ midi }) => {
      if (!cur || left <= 0) return;
      if (cfg.answer === 'keys') answer(((midi - cur.p.midi) % 12 + 12) % 12 === 0);
      else if (cfg.answer === 'play') answer(midi === cur.p.midi + (bass ? TRANSPOSE : 0));
    });
    root.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.l && cur) answer(b.dataset.l === cur.p.letter);
      if (b.dataset.a === 'back') { stop(); setup(); }
    };
    const timer = setInterval(() => {
      left--;
      const t = $('.timer b'); if (t) t.textContent = left;
      if (left <= 0) { stop(); done(); }
    }, 1000);
    function stop() { clearInterval(timer); unsub(); Listener.setExpected([]); }
    function done() {
      const best = score > S.stats.sprintBest;
      S.stats.sprintBest = Math.max(S.stats.sprintBest, score);
      S.stats.sprintRuns++;
      save();
      const xp = addXP(score + (best ? 10 : 0), 'sprint');
      taskDone('warmup');
      root.innerHTML = `
        <div class="page narrow center">
          <div class="big-num">${score}</div>
          <p class="lead">Noten in 60 Sekunden${miss ? ` · ${miss} daneben` : ''}</p>
          ${best ? '<p class="badge">Neuer Bestwert!</p>' : `<p class="muted">Bestwert: ${S.stats.sprintBest}</p>`}
          <p class="xp-gain">+${xp} XP</p>
          <div class="row"><button class="btn primary" data-a="again">Nochmal</button><button class="btn ghost" data-a="home">Fertig</button></div>
        </div>`;
      root.onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'again') run();
        if (b.dataset.a === 'home') back();
      };
    }
    next();
  }
  setup();
}

// ================= Gehörtraining =================
const INTERVALS = [
  ['Prime', 0], ['kleine Sekunde', 1], ['große Sekunde', 2], ['kleine Terz', 3], ['große Terz', 4], ['Quarte', 5],
  ['Tritonus', 6], ['Quinte', 7], ['kleine Sexte', 8], ['große Sexte', 9], ['kleine Septime', 10], ['große Septime', 11], ['Oktave', 12],
];
const INT_LEVELS = {
  leicht: [4, 7, 12],
  mittel: [2, 3, 4, 5, 7, 12],
  schwer: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
};
export function earScreen(root, back) {
  const st = Object.assign({ mode: 'hoeher', lvl: 'leicht' }, JSON.parse(localStorage.getItem('kq-ear') || '{}'));
  const MODES = [
    ['hoeher', 'Höher oder tiefer?', 'Zwei Töne – ist der zweite höher, tiefer oder gleich?'],
    ['intervall', 'Intervalle', 'Wie weit liegen zwei Töne auseinander?'],
    ['durmoll', 'Dur oder Moll?', 'Klingt der Akkord hell oder dunkel?'],
    ['nachspielen', 'Nachspielen', 'Hör eine kurze Melodie und spiel sie auf deinem Klavier nach.'],
  ];
  const setup = () => {
    root.innerHTML = `
    <div class="page narrow">
      <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Gehörtraining</h1></header>
      <p class="lead">Je besser dein Ohr, desto schneller merkst du beim Spielen, ob etwas stimmt. Eine Runde hat 10 Fragen.</p>
      <div class="mode-list">${MODES.map(([id, t, d]) => `<button class="mode ${st.mode === id ? 'on' : ''}" data-m="${id}"><b>${t}</b><span>${d}</span></button>`).join('')}</div>
      ${st.mode === 'intervall' ? `<div class="form"><label>Schwierigkeit</label><div class="seg">${['leicht', 'mittel', 'schwer'].map(l => `<button class="${st.lvl === l ? 'on' : ''}" data-l="${l}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div></div>` : ''}
      <button class="btn primary big" data-a="go">${ICON.ear} Runde starten</button>
    </div>`;
    root.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.m) { st.mode = b.dataset.m; localStorage.setItem('kq-ear', JSON.stringify(st)); setup(); }
      if (b.dataset.l) { st.lvl = b.dataset.l; localStorage.setItem('kq-ear', JSON.stringify(st)); setup(); }
      if (b.dataset.a === 'back') back();
      if (b.dataset.a === 'go') round();
    };
  };
  const bass = S.instrument === 'bass';
  async function round() {
    await unlockAudio();
    Listener.mode = bass ? 'bass' : 'piano';
    if (st.mode === 'nachspielen' && S.settings.input === 'mic') { try { await Listener.start(); Listener.sens = S.settings.sens; } catch (e) { /* Touch */ } }
    let q = 0, right = 0, cur = null, answered = false, unsub = null;
    root.innerHTML = `
      <div class="page narrow ear">
        <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>${MODES.find(m => m[0] === st.mode)[1]}</h1><span class="qcount"></span></header>
        <div class="ear-stage">
          <button class="play-big" data-a="play" aria-label="Abspielen">${ICON.play}</button>
          <div class="ear-fb"></div>
        </div>
        <div class="answers wrap"></div>
        <div class="kb ear-kb"></div>
        <button class="btn primary next-btn" data-a="next" hidden>Weiter</button>
      </div>`;
    const $ = s => root.querySelector(s);
    let kb = null;
    if (st.mode === 'nachspielen') kb = bass ? new Fingerboard($('.kb'), { tol: 25 }) : new Keyboard($('.kb'), 60, 71);
    else $('.kb').remove();
    const play = () => {
      const c = getCtx(); const t = c.currentTime + 0.05;
      Listener.muted = true;
      let end = 0;
      if (cur.type === 'seq') cur.notes.forEach((m, i) => { if (bass && st.mode === 'nachspielen') Synth.bass(m, t + i * 0.7, 0.6, true, 0.9); else Synth.note(m, t + i * 0.7, 0.6); end = (i + 1) * 0.7; });
      if (cur.type === 'chord') { cur.notes.forEach((m, i) => Synth.note(m, t + i * 0.35, 0.4)); Synth.chord(cur.notes, t + 1.2, 1.2); end = 2.5; }
      setTimeout(() => (Listener.muted = false), end * 1000 + 300);
    };
    const make = () => {
      answered = false;
      $('.ear-fb').textContent = ''; $('.ear-fb').className = 'ear-fb';
      $('.next-btn').hidden = true;
      $('.qcount').textContent = `${q + 1}/10`;
      const base = 55 + Math.floor(Math.random() * 14);
      let html = '';
      if (st.mode === 'hoeher') {
        const d = rand([-7, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7]);
        cur = { type: 'seq', notes: [base, base + d], ans: d > 0 ? 'h' : d < 0 ? 't' : 'g' };
        html = [['h', 'Höher'], ['t', 'Tiefer'], ['g', 'Gleich']].map(([k, l]) => `<button class="ans" data-ans="${k}">${l}</button>`).join('');
      } else if (st.mode === 'intervall') {
        const set = INT_LEVELS[st.lvl];
        const d = rand(set);
        cur = { type: 'seq', notes: [base, base + d], ans: String(d) };
        html = set.map(s => `<button class="ans" data-ans="${s}">${INTERVALS[s][0]}</button>`).join('');
      } else if (st.mode === 'durmoll') {
        const dur = Math.random() < 0.5;
        cur = { type: 'chord', notes: [base, base + (dur ? 4 : 3), base + 7], ans: dur ? 'dur' : 'moll' };
        html = '<button class="ans" data-ans="dur">Dur</button><button class="ans" data-ans="moll">Moll</button>';
      } else {
        const pool = bass ? [38, 40, 42, 43, 45] : [60, 62, 64, 65, 67];
        const notes = [rand(pool)];
        while (notes.length < 3) { const n = rand(pool); if (n !== notes.at(-1)) notes.push(n); }
        cur = { type: 'seq', notes, pos: 0, errs: 0 };
        html = '<p class="muted center">' + (bass ? 'Töne aus der I. Lage (D-Saite bis A auf der G-Saite)' : 'Töne aus der C-Lage (C bis G)') + '. Der erste Ton ist ' + midiName(notes[0]) + '.</p>';
        Listener.setExpected([notes[0]]);
      }
      $('.answers').innerHTML = html;
      setTimeout(play, 250);
    };
    const resolve = ok => {
      answered = true;
      if (ok) right++;
      const fb = $('.ear-fb');
      let sol = '';
      if (st.mode === 'intervall') sol = INTERVALS[+cur.ans][0];
      if (st.mode === 'hoeher') sol = { h: 'höher', t: 'tiefer', g: 'gleich' }[cur.ans];
      if (st.mode === 'durmoll') sol = cur.ans === 'dur' ? 'Dur' : 'Moll';
      if (st.mode === 'nachspielen') sol = cur.notes.map(n => midiName(n)).join(' – ');
      fb.textContent = ok ? 'Richtig! ' + sol : 'Leider nicht – richtig: ' + sol;
      fb.className = 'ear-fb ' + (ok ? 'good' : 'bad');
      root.querySelectorAll('[data-ans]').forEach(b => { if (b.dataset.ans === cur.ans) b.classList.add('right'); });
      $('.next-btn').hidden = false;
      Listener.setExpected([]);
    };
    unsub = Input.on(({ midi }) => {
      if (st.mode !== 'nachspielen' || answered || !cur) return;
      const want = cur.notes[cur.pos];
      if (midi === want) {
        kb?.flash(midi, 'ok');
        cur.pos++;
        if (cur.pos >= cur.notes.length) resolve(cur.errs === 0);
        else Listener.setExpected([cur.notes[cur.pos]]);
      } else {
        kb?.flash(midi, 'bad');
        cur.errs++;
        if (cur.errs >= 3) resolve(false);
      }
    });
    root.onclick = e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.a === 'play') play();
      if (b.dataset.ans && !answered) {
        const ok = b.dataset.ans === cur.ans;
        if (!ok) b.classList.add('wrong');
        resolve(ok);
      }
      if (b.dataset.a === 'next') { q++; if (q >= 10) finish(); else make(); }
      if (b.dataset.a === 'back') { unsub(); Listener.setExpected([]); setup(); }
    };
    function finish() {
      unsub();
      S.stats.earCorrect += right; S.stats.earRounds++;
      save();
      const xp = addXP(right * 2 + (right === 10 ? 10 : 0), 'ear');
      taskDone('ear');
      checkAchievements();
      root.innerHTML = `
        <div class="page narrow center">
          <div class="big-num">${right}/10</div>
          <p class="lead">${right >= 9 ? 'Starkes Gehör!' : right >= 6 ? 'Gut gehört – das wird immer besser.' : 'Dranbleiben: Das Ohr trainiert sich mit jeder Runde.'}</p>
          <p class="xp-gain">+${xp} XP</p>
          <div class="row"><button class="btn primary" data-a="again">Nochmal</button><button class="btn ghost" data-a="home">Fertig</button></div>
        </div>`;
      root.onclick = e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.a === 'again') round();
        if (b.dataset.a === 'home') back();
      };
    }
    make();
  }
  setup();
}
