// Klavier-Quest – Hauptprogramm: Übersicht, Lektionen, Theorie, Ergebnisse, Erfolge, Einstellungen
import { worldsFor, ALL_THEORY as THEORY } from './curriculum.js';
import { PIECES as PIANO_PIECES } from './pieces.js';
import { BASS_PIECES } from './bass-pieces.js';
import { applyFingering, parseChords, chordLabel, TRANSPOSE, Fingerboard, OPEN, STRING_NAMES } from './bass.js';
import { buildScore, generateDrill, midiLabel } from './score.js';
import { renderScore } from './notation.js';
import { Synth, Listener, Midi, getCtx, unlockAudio } from './audio.js';
import { Player, ICON, esc } from './player.js';
import { sprintScreen, earScreen } from './extras.js';
import {
  S, save, addXP, levelInfo, stars, recordStep, worldUnlocked, lessonUnlocked, lessonDone, nextStep,
  totalStars, ACHIEVEMENTS, setNotifier, exportCode, importCode, resetAll, taskDone, checkAchievements,
} from './store.js';

const PIECES = { ...PIANO_PIECES, ...BASS_PIECES };
const W = () => worldsFor(S.instrument);
const isBass = () => S.instrument === 'bass';
const app = document.getElementById('app');
const toasts = document.getElementById('toasts');
let current = null;   // aktiver Player

setNotifier(({ kind, text }) => toast(text, kind));
function toast(text, kind = '') {
  const t = document.createElement('div');
  t.className = 'toast t-' + kind;
  t.innerHTML = (kind === 'ach' ? ICON.trophy : kind === 'level' ? ICON.bolt : kind === 'goal' ? ICON.flame : kind === 'boss' ? ICON.crown : '') + `<span>${esc(text)}</span>`;
  toasts.appendChild(t);
  setTimeout(() => t.classList.add('out'), 3200);
  setTimeout(() => t.remove(), 3700);
}

const starRow = (n, max = 3) => `<span class="stars">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}">${ICON.star}</i>`).join('')}</span>`;

function hintFor(world) {
  const h = S.settings.hints;
  if (h === 'auto') return world ? world.hint : 0;
  return +h;
}

// ================= Übersicht =================
function home() {
  destroyPlayer();
  const lv = levelInfo();
  const nx = nextStep();
  const goal = S.settings.goal;
  const dayPct = Math.min(1, S.daily.xp / goal);
  const R = 30, C = 2 * Math.PI * R;
  // Tagesplan
  const review = findReview();
  const tasks = [
    { id: 'warmup', t: 'Aufwärmen', d: 'Notenlese-Sprint, 1 Minute', go: 'sprint' },
    { id: 'lesson', t: 'Neues lernen', d: nx ? stepLabel(nx) : 'Alles geschafft!', go: 'next' },
    { id: 'ear', t: 'Ohr trainieren', d: 'Eine Runde Gehörtraining', go: 'ear' },
    ...(review ? [{ id: 'review', t: 'Wiederholen', d: review.title + ' für mehr Sterne', go: 'review' }] : []),
  ];
  app.innerHTML = `
  <div class="page home">
    <header class="top">
      <div class="logo">${LOGO}<span>Klavier-Quest</span></div>
      <div class="seg inst" role="tablist" aria-label="Instrument">
        <button data-inst="piano" class="${isBass() ? '' : 'on'}">Klavier</button>
        <button data-inst="bass" class="${isBass() ? 'on' : ''}">Kontrabass</button>
      </div>
      <div class="chips">
        <span class="chip streak ${S.streak.count ? 'hot' : ''}" title="Tage in Folge">${ICON.flame}<b>${S.streak.count}</b></span>
        <span class="chip lvl" title="${lv.into} / ${lv.need} XP bis zum nächsten Level"><b>Lv ${lv.level}</b> ${esc(lv.title)}<i style="--p:${lv.pct}"></i></span>
        <button class="icon-btn" data-go="settings" aria-label="Einstellungen">${ICON.gear}</button>
      </div>
    </header>

    <section class="today">
      <div class="today-main">
        <svg class="ring" viewBox="0 0 76 76"><circle cx="38" cy="38" r="${R}" class="ring-bg"/><circle cx="38" cy="38" r="${R}" class="ring-fg" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - dayPct)}"/></svg>
        <div class="ring-txt"><b>${S.daily.xp}</b><span>/ ${goal} XP</span></div>
        <div class="today-txt">
          <h2>${S.daily.goalHit ? 'Tagesziel geschafft' : 'Heute'}</h2>
          <p>${S.daily.goalHit ? 'Stark! Alles Weitere ist Bonus.' : 'Rund 15–20 Minuten. Arbeite die Liste von oben nach unten ab.'}</p>
        </div>
      </div>
      <ol class="tasks">
        ${tasks.map(t => `<li class="${S.daily.tasks[t.id] ? 'done' : ''}"><span class="tick">${S.daily.tasks[t.id] ? ICON.check : ''}</span><div><b>${t.t}</b><span>${esc(t.d)}</span></div><button class="btn small ${S.daily.tasks[t.id] ? 'ghost' : 'primary'}" data-go="${t.go}">${S.daily.tasks[t.id] ? 'Nochmal' : 'Los'}</button></li>`).join('')}
      </ol>
    </section>

    <section class="worlds">
      <div class="sec-head"><h2>Deine Reise · ${isBass() ? 'Kontrabass' : 'Klavier'}</h2><span class="muted">${totalStars()} Sterne · Schon fit? Jeder Boss ist direkt spielbar.</span></div>
      ${W().map((w, wi) => worldCard(w, wi)).join('')}
      <div class="world future"><div class="w-head"><span class="w-num">7+</span><div><h3>Pro · Ultra-God</h3><p>Weitere Welten folgen, sobald du hier durch bist.</p></div></div></div>
    </section>

    <section class="extras">
      <button class="extra" data-go="sprint">${ICON.bolt}<b>Notenlese-Sprint</b><span>Bestwert ${S.stats.sprintBest}</span></button>
      <button class="extra" data-go="ear">${ICON.ear}<b>Gehörtraining</b><span>${S.stats.earCorrect} richtig</span></button>
      ${isBass() ? `<button class="extra" data-go="tuner">${ICON.tuner}<b>Stimmgerät</b><span>E · A · D · G</span></button>` : ''}
      <button class="extra" data-go="library">${ICON.book}<b>Theorie</b><span>${W().flatMap(w => w.lessons.flatMap(l => l.steps)).filter(s => s.type === 'theory').length} Karten</span></button>
      <button class="extra" data-go="ach">${ICON.trophy}<b>Erfolge</b><span>${Object.keys(S.ach).length}/${ACHIEVEMENTS.length}</span></button>
    </section>
    <footer class="foot">Fortschritt wird auf diesem Gerät gespeichert. Übertragen per Sync-Code in den Einstellungen.</footer>
  </div>`;
  app.onclick = e => {
    const b = e.target.closest('[data-go],[data-lesson],[data-boss],[data-inst]');
    if (!b) return;
    if (b.dataset.inst) { if (S.instrument !== b.dataset.inst) { S.instrument = b.dataset.inst; save(); } return home(); }
    if (b.dataset.go === 'tuner') return tuner();
    if (b.dataset.lesson) { const [wi, li] = b.dataset.lesson.split('-').map(Number); return lessonScreen(wi, li); }
    if (b.dataset.boss != null) return runStep(W()[+b.dataset.boss], null, { type: 'piece', id: 'boss-' + W()[+b.dataset.boss].id, piece: W()[+b.dataset.boss].boss, boss: true });
    const g = b.dataset.go;
    if (g === 'settings') settings();
    if (g === 'sprint') sprintScreen(app, home);
    if (g === 'ear') earScreen(app, home);
    if (g === 'library') library();
    if (g === 'ach') achievements();
    if (g === 'next') { const n = nextStep(); if (n) n.lesson ? lessonScreen(n.wi, n.li) : runStep(n.world, null, n.step); }
    if (g === 'review' && review) { taskDone('review'); runStep(review.world, review.lesson, review.step); }
  };
}

function stepLabel(n) {
  if (!n.lesson) return `Boss: ${PIECES[n.world.boss].title}`;
  return `${n.lesson.title} · ${stepTitle(n.step)}`;
}
function stepTitle(s) {
  if (s.type === 'theory') return THEORY[s.card].title;
  if (s.type === 'drill') return s.title;
  return PIECES[s.piece].title;
}
function findReview() {
  let best = null;
  W().forEach(w => w.lessons.forEach(l => l.steps.forEach(s => {
    if (s.type !== 'piece') return;
    const st = stars(s.id);
    if (st > 0 && st < 3 && (!best || st < best.st)) best = { st, world: w, lesson: l, step: s, title: PIECES[s.piece].title };
  })));
  return best;
}

function worldCard(w, wi) {
  const open = worldUnlocked(wi);
  const bossSt = stars('boss-' + w.id);
  const doneL = w.lessons.filter(lessonDone).length;
  return `
  <div class="world ${open ? '' : 'locked'}" style="--wc:${w.color}">
    <div class="w-head">
      <span class="w-num">${wi + 1}</span>
      <div><h3>${esc(w.title)} <em>${w.level}</em></h3><p>${esc(w.blurb)}</p></div>
      <span class="w-prog">${open ? `${doneL}/${w.lessons.length}` : ICON.lock}</span>
    </div>
    <div class="path">
      ${w.lessons.map((l, li) => {
        const un = open && lessonUnlocked(wi, li);
        const st = l.steps.filter(s => s.type !== 'theory');
        const got = st.reduce((a, s) => a + stars(s.id), 0);
        const done = lessonDone(l);
        return `<button class="node ${done ? 'done' : ''} ${un ? '' : 'off'}" ${un ? `data-lesson="${wi}-${li}"` : 'disabled'}>
          <span class="dot">${done ? ICON.check : un ? li + 1 : ICON.lock}</span>
          <b>${esc(l.title)}</b>
          <span class="mini">${st.length ? `${got}/${st.length * 3}` : ''} ${ICON.star}</span>
        </button>`;
      }).join('')}
      <button class="node boss ${bossSt >= 2 ? 'done' : ''} ${open ? '' : 'off'}" ${open ? `data-boss="${wi}"` : 'disabled'}>
        <span class="dot">${ICON.crown}</span>
        <b>Boss: ${esc(PIECES[w.boss].title)}</b>
        <span class="mini">${starRow(bossSt)}</span>
      </button>
    </div>
  </div>`;
}

// ================= Lektion =================
function lessonScreen(wi, li) {
  destroyPlayer();
  const w = W()[wi], l = w.lessons[li];
  app.innerHTML = `
  <div class="page narrow lesson" style="--wc:${w.color}">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button>
      <div><span class="eyebrow">Welt ${wi + 1} · ${esc(w.title)}</span><h1>${esc(l.title)}</h1></div></header>
    <ol class="steps">
      ${l.steps.map((s, i) => {
        const st = stars(s.id);
        const icon = s.type === 'theory' ? ICON.book : s.type === 'drill' ? ICON.drill : ICON.note;
        const kind = s.type === 'theory' ? 'Theorie' : s.type === 'drill' ? 'Blattspiel-Übung · jedes Mal neu' : `Stück · ${esc(PIECES[s.piece].by)}`;
        return `<li class="${st ? 'done' : ''}">
          <span class="s-ico">${icon}</span>
          <div><b>${esc(stepTitle(s))}</b><span>${kind}</span></div>
          ${s.type === 'theory' ? (st ? `<span class="tick">${ICON.check}</span>` : '') : starRow(st)}
          <button class="btn small ${st ? 'ghost' : 'primary'}" data-i="${i}">${st ? 'Nochmal' : 'Start'}</button>
        </li>`;
      }).join('')}
    </ol>
    <p class="muted">Tipp: Erst im Warte-Modus sicher werden, dann im Rhythmus-Modus. Der Rhythmus-Modus gibt 30 % mehr XP.</p>
  </div>`;
  app.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') return home();
    if (b.dataset.i != null) runStep(w, l, l.steps[+b.dataset.i], () => lessonScreen(wi, li));
  };
}

function runStep(world, lesson, step, back) {
  back = back || home;
  if (step.type === 'theory') return theoryScreen(step.card, () => {
    const first = !stars(step.id);
    recordStep(step.id, 1);
    if (first) addXP(5, 'theorie');
    // automatisch weiter zum nächsten Schritt
    const i = lesson.steps.indexOf(step);
    const nxt = lesson.steps[i + 1];
    if (nxt) runStep(world, lesson, nxt, back); else back();
  }, back);
  let piece, title, sub;
  const bass = world.id.startsWith('b');
  if (step.type === 'drill') {
    piece = generateDrill(step.cfg, Date.now());
    if (bass) piece.tech = step.cfg.tech || 'arco';
    title = step.title; sub = 'Blattspiel-Übung · neue Noten bei jedem Versuch';
  } else {
    const p = PIECES[step.piece];
    piece = p; title = p.title; sub = `${p.by} · ${p.style}${bass ? (p.tech === 'pizz' ? ' · Pizzicato' : ' · Arco') : ''}${step.boss ? ' · Boss' : ''}`;
  }
  if (bass) piece = { ...piece, transpose: TRANSPOSE, staves: ['b'] };
  const score = buildScore(piece);
  if (bass) applyFingering(score, world.maxPos || 9);
  destroyPlayer();
  app.innerHTML = '';
  app.onclick = null;
  current = new Player(app, {
    score, title, sub, bass, boss: !!step.boss, hint: step.boss ? Math.min(1, hintFor(world)) : hintFor(world),
    onExit: back,
    onFinish: (res, pl) => results(world, lesson, step, res, pl, back),
  });
}

function results(world, lesson, step, res, pl, back) {
  let st = res.stars;
  let note = '';
  if (step.boss && res.mode !== 'rhythm') { note = 'Bosse zählen nur im Rhythmus-Modus. Starte nochmal mit „Rhythmus“!'; st = Math.min(st, 1); }
  if (step.boss && res.tempoF < 0.7 && st >= 2) { note = 'Für den Sieg braucht es mindestens 70 % Tempo.'; st = 1; }
  const prev = stars(step.id);
  const r = recordStep(step.id, st);
  const mult = res.mode === 'rhythm' ? 1.3 : 1;
  const base = step.boss ? 25 : step.type === 'piece' ? 12 : 8;
  let xp = st * base * mult + (r.first ? (step.boss ? 50 : 15) : 0) + Math.min(10, Math.floor(res.best / 5));
  if (st === 0) xp = 3;
  S.stats.plays++;
  S.stats.minutes += res.seconds / 60;
  if (res.perfect) S.stats.perfect++;
  save();
  if (lesson && st > 0) taskDone('lesson');
  const gained = addXP(xp, 'spiel');
  checkAchievements();
  const pct = Math.round(res.accuracy * 100);
  const msg = st === 3 ? 'Meisterhaft!' : st === 2 ? 'Richtig gut!' : st === 1 ? 'Geschafft – da geht noch mehr.' : 'Noch nicht ganz. Versuch’s im Warte-Modus oder langsamer.';
  const nextIdx = lesson ? lesson.steps.indexOf(step) + 1 : -1;
  const hasNext = lesson && nextIdx < lesson.steps.length;
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `
    <div class="result">
      ${starRow(st)}
      <h2>${msg}</h2>
      <div class="r-grid">
        <div><b>${pct} %</b><span>Treffer</span></div>
        <div><b>${res.best}</b><span>beste Combo</span></div>
        <div><b>+${gained}</b><span>XP</span></div>
      </div>
      ${res.inton != null ? `<p class="inton-line">Intonation: im Schnitt <b>${res.inton} Cent</b> daneben${res.inton <= 10 ? ' – sehr sauber!' : res.inton <= 20 ? ' – gut.' : ' – achte auf die Nadel.'}</p>` : ''}
      ${note ? `<p class="note">${note}</p>` : ''}
      ${st > prev && prev > 0 ? '<p class="badge">Neuer Bestwert!</p>' : ''}
      <div class="row">
        <button class="btn ghost" data-r="again">Nochmal</button>
        ${hasNext ? '<button class="btn primary" data-r="next">Weiter</button>' : '<button class="btn primary" data-r="done">Fertig</button>'}
      </div>
    </div>`;
  app.appendChild(ov);
  if (st >= 2) confetti(ov);
  ov.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    ov.remove();
    if (b.dataset.r === 'again') {
      if (step.type === 'drill') runStep(world, lesson, step, back);
      else pl.reset();
    }
    if (b.dataset.r === 'next') runStep(world, lesson, lesson.steps[nextIdx], back);
    if (b.dataset.r === 'done') back();
  };
}

function confetti(host) {
  const cols = ['#ff5a36', '#3d7bfd', '#11a36a', '#ffc21a', '#9c36b5'];
  for (let i = 0; i < 40; i++) {
    const c = document.createElement('i');
    c.className = 'cf';
    c.style.left = Math.random() * 100 + '%';
    c.style.background = cols[i % cols.length];
    c.style.animationDelay = Math.random() * 0.4 + 's';
    c.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
    host.appendChild(c);
    setTimeout(() => c.remove(), 2200);
  }
}

// ================= Theorie =================
function theoryScreen(id, onDone, back) {
  destroyPlayer();
  const t = THEORY[id];
  app.innerHTML = `
  <div class="page narrow theory">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><div><span class="eyebrow">Theorie</span><h1>${esc(t.title)}</h1></div></header>
    <article class="card-body">${t.html}</article>
    ${t.example ? `<figure class="example"><div class="ex-scroll"><svg class="staff"></svg></div><button class="btn ghost" data-a="hear">${ICON.play} Beispiel anhören</button></figure>` : ''}
    <button class="btn primary big" data-a="ok">${onDone ? 'Verstanden – weiter' : 'Zurück'}</button>
  </div>`;
  let sc = null, chords = null;
  const ro = () => ({ space: 11, pxPerBeat: 58, names: true, tall: !!t.bass, chords });
  if (t.example) {
    sc = buildScore({ tempo: 80, ...t.example, ...(t.bass ? { transpose: TRANSPOSE, staves: ['b'] } : {}) });
    if (t.bass) applyFingering(sc, 9);
    if (t.example.chords) chords = parseChords(t.example.chords, sc.measure).map(k => ({ ...k, label: chordLabel(k.chord.sym) }));
    renderScore(app.querySelector('.staff'), sc, ro());
  }
  app.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') return back();
    if (b.dataset.a === 'ok') return onDone ? onDone() : back();
    if (b.dataset.a === 'hear' && sc) {
      await unlockAudio();
      const spb = 60 / sc.tempo, t0 = getCtx().currentTime + 0.1;
      const els = renderScore(app.querySelector('.staff'), sc, ro()).evEls;
      sc.events.forEach((ev, i) => {
        ev.notes.forEach(n => n.pitches.forEach(p => t.bass
          ? Synth.bass(p.midi + TRANSPOSE, t0 + n.beat * spb, n.dur * spb * 0.9, sc.tech === 'pizz', 0.9)
          : Synth.note(p.midi, t0 + n.beat * spb, n.dur * spb * 0.95)));
        setTimeout(() => { els.forEach(g => g?.classList.remove('cur')); els[i]?.classList.add('cur'); }, (ev.beat * spb + 0.1) * 1000);
      });
      setTimeout(() => els.forEach(g => g?.classList.remove('cur')), (sc.total * spb + 0.6) * 1000);
    }
  };
}
function library() {
  destroyPlayer();
  const used = [];
  W().forEach((w, wi) => w.lessons.forEach(l => l.steps.forEach(s => { if (s.type === 'theory') used.push({ id: s.card, w, wi, read: stars(s.id) > 0 }); })));
  app.innerHTML = `
  <div class="page narrow">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Theorie</h1></header>
    <p class="lead">Alle Theorie-Karten zum Nachschlagen – auch die aus späteren Welten.</p>
    <ul class="lib">${used.map(u => `<li><button data-t="${u.id}" style="--wc:${u.w.color}"><span class="w-num sm">${u.wi + 1}</span><b>${esc(THEORY[u.id].title)}</b>${u.read ? `<span class="tick">${ICON.check}</span>` : ''}</button></li>`).join('')}</ul>
  </div>`;
  app.onclick = e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') return home();
    if (b.dataset.t) theoryScreen(b.dataset.t, null, library);
  };
}

// ================= Erfolge =================
function achievements() {
  destroyPlayer();
  checkAchievements();
  app.innerHTML = `
  <div class="page narrow">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Erfolge</h1></header>
    <div class="ach-sum"><div><b>${S.xp}</b><span>XP gesamt</span></div><div><b>${totalStars()}</b><span>Sterne</span></div><div><b>${S.streak.best}</b><span>längste Serie</span></div><div><b>${Math.round(S.stats.minutes)}</b><span>Minuten gespielt</span></div></div>
    <ul class="ach">${ACHIEVEMENTS.map(a => `<li class="${S.ach[a.id] ? 'got' : ''}"><span class="a-ico">${S.ach[a.id] ? ICON.trophy : ICON.lock}</span><div><b>${esc(a.t)}</b><span>${esc(a.d)}</span></div></li>`).join('')}</ul>
  </div>`;
  app.onclick = e => { if (e.target.closest('[data-a=back]')) home(); };
}

// ================= Stimmgerät =================
function tuner() {
  destroyPlayer();
  app.innerHTML = `
  <div class="page narrow">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Stimmgerät</h1></header>
    <p class="lead">Streich oder zupf eine leere Saite. Die Nadel zeigt, ob sie zu hoch oder zu tief ist. Mit den Knöpfen hörst du den Referenzton.</p>
    <div class="tuner-big"></div>
    <div class="ref-row">${OPEN.map((m, i) => `<button class="btn ghost" data-ref="${m}">${STRING_NAMES[i]}-Saite</button>`).join('')}</div>
    <button class="btn primary big" data-a="start">${ICON.mic} Mikrofon starten</button>
  </div>`;
  const host = app.querySelector('.tuner-big');
  host.innerHTML = '<div class="kb"></div>';
  const fb = new Fingerboard(host.firstChild, { tol: 5 });
  Listener.mode = 'bass';
  Listener.onPitch = p => {
    if (p) {
      // nächste leere Saite als Ziel
      const near = OPEN.reduce((a, m) => (Math.abs(m - p.midi) < Math.abs(a - p.midi) ? m : a), OPEN[0]);
      fb.target = Math.abs(near - p.midi) < 0.8 ? near : Math.round(p.midi);
    }
    fb.setPitch(p);
  };
  Listener.onLevel = null;
  app.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'back') { Listener.onPitch = null; return home(); }
    if (b.dataset.ref) { await unlockAudio(); Synth.bass(+b.dataset.ref, 0, 2.2, false, 0.9); Listener.muteUntil = performance.now() / 1000 + 2.6; }
    if (b.dataset.a === 'start') {
      try { await Listener.start(); Listener.sens = S.settings.sens; b.textContent = 'Hört zu …'; b.disabled = true; }
      catch (err) { b.textContent = 'Kein Mikrofon-Zugriff'; }
    }
  };
}

// ================= Einstellungen =================
function settings() {
  destroyPlayer();
  const st = S.settings;
  const seg = (k, opts) => `<div class="seg">${opts.map(([v, l]) => `<button class="${String(st[k]) === String(v) ? 'on' : ''}" data-k="${k}" data-v="${v}">${l}</button>`).join('')}</div>`;
  app.innerHTML = `
  <div class="page narrow settings">
    <header class="sub-top"><button class="icon-btn" data-a="back" aria-label="Zurück">${ICON.back}</button><h1>Einstellungen</h1></header>

    <h2>Eingabe</h2>
    <div class="form">
      <label>So hört die App dich</label>
      ${seg('input', [['mic', 'Mikrofon'], ['touch', 'Nur Bildschirm'], ...(Midi.supported ? [['midi', 'MIDI']] : [])])}
      <p class="hint-line">${Midi.supported ? 'MIDI funktioniert in Chrome/Edge am Computer.' : 'MIDI ist auf iPad/iPhone im Browser nicht verfügbar – dafür ist das Mikrofon da.'}</p>
      ${st.input === 'midi' ? '<button class="btn ghost" data-a="midi">MIDI-Gerät verbinden</button><span class="midi-state muted"></span>' : ''}
    </div>

    <h2>Mikrofon-Test</h2>
    <div class="mictest">
      <div class="mt-meter"><i></i></div>
      <div class="mt-note">–</div>
      <button class="btn ghost" data-a="mictest">${ICON.mic} Test starten</button>
      <p class="hint-line">Spiel einzelne Töne. Steht unten zuverlässig der richtige Name, passt alles. Leg das iPad nah ans Klavier, Lautsprecher-Seite Richtung Tasten.</p>
      <label>Empfindlichkeit <b class="sens-v">${Math.round(st.sens * 100)} %</b></label>
      <input type="range" min="0.1" max="1" step="0.05" value="${st.sens}" data-r="sens">
      <label>Latenz-Ausgleich (Rhythmus-Modus) <b class="lat-v">${st.latency} ms</b></label>
      <input type="range" min="0" max="250" step="10" value="${st.latency}" data-r="latency">
      <p class="hint-line">Zeigt die App im Rhythmus-Modus ständig „zu spät“, obwohl du im Takt bist? Dann den Wert erhöhen.</p>
    </div>

    <h2>Spielen</h2>
    <div class="form">
      <label>Akkorde werten</label>
      ${seg('chord', [['locker', 'Locker (oberster Ton)'], ['normal', 'Normal'], ['streng', 'Streng (alle Töne)']])}
      <label>Hilfen</label>
      ${seg('hints', [['auto', 'Automatisch'], ['2', 'Namen + Tasten'], ['1', 'Nur Tasten'], ['0', 'Keine']])}
      <p class="hint-line">Automatisch: In Welt 1 mit Notennamen, in Welt 2 nur leuchtende Tasten, danach ohne. Bleibst du hängen, hilft die App nach 7 Sekunden.</p>
      <label>Intonation (Kontrabass)</label>
      ${seg('inton', [['streng', 'Streng ±15 ct'], ['mittel', 'Mittel ±25 ct'], ['locker', 'Locker ±40 ct']])}
      <label>Begleitung (Kontrabass, Rhythmus-Modus)</label>
      ${seg('accomp', [[true, 'An'], [false, 'Aus']])}
      <p class="hint-line">Klavier und Schlagzeug spielen mit. Am besten mit Kopfhörern, damit das Mikrofon nur deinen Bass hört.</p>
      <label>Metronom im Rhythmus-Modus</label>
      ${seg('metronome', [[true, 'An'], [false, 'Aus']])}
      <label>Ton bei Bildschirm-Tasten</label>
      ${seg('touchSound', [[true, 'An'], [false, 'Aus']])}
      <label>Tagesziel</label>
      ${seg('goal', [[30, '30 XP · locker'], [60, '60 XP · normal'], [100, '100 XP · intensiv']])}
    </div>

    <h2>Fortschritt übertragen</h2>
    <div class="form">
      <p class="hint-line">Kopiere den Code auf dem einen Gerät und füge ihn auf dem anderen ein (z. B. per AirDrop oder Notizen). Beim Einfügen wird immer der bessere Stand behalten.</p>
      <button class="btn ghost" data-a="export">Sync-Code kopieren</button>
      <textarea class="code" rows="3" placeholder="Hier Sync-Code einfügen (beginnt mit KQ1-)"></textarea>
      <button class="btn primary" data-a="import">Code übernehmen</button>
      <span class="sync-msg muted"></span>
    </div>

    <h2>Neu anfangen</h2>
    <div class="form">
      <button class="btn danger" data-a="reset">Fortschritt löschen …</button>
    </div>
    <p class="muted center">Klavier-Quest · Stücke: eigene Kompositionen sowie Beethoven und Petzold (gemeinfrei) · Notenglyphen: Bravura (SIL OFL)</p>
  </div>`;
  const $ = s => app.querySelector(s);
  let testing = false;
  Listener.onLevel = (l, n) => {
    const i = $('.mt-meter i'); if (i) i.style.width = Math.max(0, Math.min(100, (l - n) / 30 * 100)) + '%';
    const p = Listener.pitch, nt = $('.mt-note');
    if (nt && testing) nt.textContent = p && p.clarity > 0.86 ? midiLabel(Math.round(p.midi)) : '–';
  };
  app.oninput = e => {
    const r = e.target.dataset.r; if (!r) return;
    st[r] = +e.target.value;
    if (r === 'sens') { Listener.sens = st.sens; $('.sens-v').textContent = Math.round(st.sens * 100) + ' %'; }
    if (r === 'latency') $('.lat-v').textContent = st.latency + ' ms';
    save();
  };
  app.onclick = async e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) {
      let v = b.dataset.v;
      if (v === 'true') v = true; else if (v === 'false') v = false; else if (/^\d+$/.test(v) && b.dataset.k === 'goal') v = +v;
      st[b.dataset.k] = v; save(); return settings();
    }
    const a = b.dataset.a;
    if (a === 'back') { Listener.onLevel = null; if (testing) { Listener.setExpected([]); } return home(); }
    if (a === 'mictest') {
      try { Listener.mode = isBass() ? 'bass' : 'piano'; await Listener.start(); Listener.sens = st.sens; testing = true; Listener.setExpected([]); b.textContent = 'Test läuft – spiel einen Ton'; }
      catch (err) { $('.mt-note').textContent = 'Kein Zugriff aufs Mikrofon'; }
    }
    if (a === 'midi') {
      try { const n = await Midi.connect(); $('.midi-state').textContent = n ? `${n} Gerät(e) verbunden` : 'Kein Gerät gefunden'; }
      catch (err) { $('.midi-state').textContent = 'MIDI nicht erlaubt'; }
    }
    if (a === 'export') {
      const code = exportCode();
      $('.code').value = code;
      try { await navigator.clipboard.writeText(code); $('.sync-msg').textContent = 'Kopiert!'; }
      catch (err) { $('.code').select(); $('.sync-msg').textContent = 'Markiert – jetzt kopieren.'; }
    }
    if (a === 'import') {
      try { importCode($('.code').value); $('.sync-msg').textContent = 'Übernommen!'; toast('Fortschritt übernommen'); }
      catch (err) { $('.sync-msg').textContent = err.message || 'Ungültiger Code'; }
    }
    if (a === 'reset') confirmBox('Wirklich alles löschen? XP, Sterne und Erfolge sind dann weg. Tipp: Vorher Sync-Code sichern.', 'Ja, löschen', () => { resetAll(); home(); });
  };
}

function confirmBox(text, yes, fn) {
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="result"><h2>Sicher?</h2><p>${esc(text)}</p><div class="row"><button class="btn ghost" data-c="no">Abbrechen</button><button class="btn danger" data-c="yes">${esc(yes)}</button></div></div>`;
  document.body.appendChild(ov);
  ov.onclick = e => { const b = e.target.closest('button'); if (!b) return; ov.remove(); if (b.dataset.c === 'yes') fn(); };
}

function destroyPlayer() { if (current) { current.destroy(); current = null; } }

const LOGO = '<svg viewBox="0 0 40 40" class="logo-mark"><rect x="2" y="6" width="36" height="28" rx="7" fill="var(--ink)"/><rect x="7" y="11" width="6" height="18" rx="1.5" fill="#fff"/><rect x="17" y="11" width="6" height="18" rx="1.5" fill="#fff"/><rect x="27" y="11" width="6" height="18" rx="1.5" fill="var(--accent)"/><rect x="11.5" y="11" width="3.5" height="10" rx="1" fill="var(--ink)"/><rect x="21.5" y="11" width="3.5" height="10" rx="1" fill="var(--ink)"/></svg>';

// Start
document.addEventListener('visibilitychange', () => { if (document.hidden && current?.running) current.stop(); });
home();
