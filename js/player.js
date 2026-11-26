// Spieler: Noten anzeigen, Eingabe auswerten (Warte- und Rhythmus-Modus), Klaviatur
import { renderScore } from './notation.js';
import { Input, Listener, Synth, Accomp, getCtx, unlockAudio } from './audio.js';
import { Fingerboard, parseChords, chordLabel, TOLERANCE } from './bass.js';
import { midiName, midiLabel, parseVoice, sliceScore } from './score.js';
import { S, save } from './store.js';

const isBlack = m => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);

// ---------------- Klaviatur ----------------
export class Keyboard {
  constructor(host, lo, hi, opt = {}) {
    this.host = host;
    this.opt = opt;
    lo = Math.max(36, lo); hi = Math.min(96, hi);
    // auf ganze Oktaven erweitern
    lo -= ((lo % 12) + 12) % 12;
    hi = hi + (11 - (((hi % 12) + 12) % 12));
    if (hi > 96) hi = 96;
    while (hi - lo < 23) { if (lo > 36) lo -= 12; else hi = Math.min(96, hi + 12); if (hi === 96 && lo === 36) break; }
    this.lo = lo; this.hi = hi;
    const whites = [];
    for (let m = lo; m <= hi; m++) if (!isBlack(m)) whites.push(m);
    const N = whites.length;
    const w = 100 / N, bw = w * 0.62;
    let html = '<div class="kb-inner" style="--n:' + N + '">';
    whites.forEach((m, i) => {
      const lab = m % 12 === 0 ? `<span class="kl">${midiLabel(m)}</span>` : '';
      html += `<div class="k w" data-m="${m}" style="left:${i * w}%;width:${w}%"><span class="kn">${midiName(m)}</span>${lab}</div>`;
    });
    for (let m = lo; m <= hi; m++) {
      if (!isBlack(m)) continue;
      const wi = whites.indexOf(m + 1);
      html += `<div class="k b" data-m="${m}" style="left:${wi * w - bw / 2}%;width:${bw}%"><span class="kn">${midiName(m)}</span></div>`;
    }
    html += '</div>';
    host.innerHTML = html;
    this.inner = host.firstChild;
    this.keys = {};
    host.querySelectorAll('.k').forEach(k => (this.keys[k.dataset.m] = k));
    host.addEventListener('pointerdown', e => {
      const k = e.target.closest('.k');
      if (!k) return;
      e.preventDefault();
      const m = +k.dataset.m;
      unlockAudio();
      if (opt.sound !== false && S.settings.touchSound) { Synth.note(m, 0, 0.35, 0.6); Listener.muteUntil = performance.now() / 1000 + 0.7; }
      k.classList.add('down');
      setTimeout(() => k.classList.remove('down'), 160);
      Input.emit(m, 'touch');
    });
  }
  hint(midis = [], names = false) {
    for (const k of Object.values(this.keys)) k.classList.remove('hint', 'named');
    for (const m of midis) {
      const k = this.keys[m];
      if (k) { k.classList.add('hint'); if (names) k.classList.add('named'); }
    }
    if (midis.length) this.reveal(midis);
  }
  reveal(midis) {
    const k = this.keys[midis[0]];
    if (!k || this.host.scrollWidth <= this.host.clientWidth) return;
    const r = k.offsetLeft + k.offsetWidth / 2 - this.host.clientWidth / 2;
    this.host.scrollTo({ left: r, behavior: 'smooth' });
  }
  flash(m, cls) {
    const k = this.keys[m];
    if (!k) return;
    k.classList.remove('ok', 'bad');
    void k.offsetWidth;
    k.classList.add(cls);
    clearTimeout(k._t);
    k._t = setTimeout(() => k.classList.remove(cls), 420);
  }
}

// ---------------- Player ----------------
export class Player {
  // opt: {score, title, sub, hint(0..2), boss, mode, onFinish(result), onExit}
  constructor(root, opt) {
    this.root = root;
    this.o = opt;
    this.score = opt.score;
    this.full = opt.score;
    this.mode = opt.mode || (opt.boss ? 'rhythm' : 'wait');
    this.pkey = opt.pkey || null;
    this.tempoF = (this.pkey && S.tempi && S.tempi[this.pkey]) || 1;
    this.loop = false; this.loopUp = true; this.loopRuns = 0;
    this.nBars = Math.round(this.score.total / this.score.measure);
    this.hint = opt.hint ?? 0;
    this.running = false;
    this.bass = !!opt.bass;
    this.tol = TOLERANCE[S.settings.inton || 'streng'] || 15;
    this.chords = this.score.chordStr ? parseChords(this.score.chordStr, this.score.measure).map(k => ({ ...k, label: chordLabel(k.chord.sym) })) : null;
    this.mel = this.score.melStr ? parseVoice(this.score.melStr, 't').notes : null;
    if (this.mel && !this.chords) this.chords = [];
    this.chordsFull = this.chords; this.melFull = this.mel;
    this.accOn = S.settings.accomp !== false;
    this.build();
  }

  build() {
    const o = this.o;
    this.root.innerHTML = `
      <div class="pl">
        <header class="pl-top">
          <button class="icon-btn" data-a="exit" aria-label="Zurück">${ICON.back}</button>
          <div class="pl-title"><b>${esc(o.title)}</b><span>${esc(o.sub || '')}</span></div>
          <div class="mic-pill" data-a="mic" title="Eingabe">${ICON.mic}<span class="meter"><i></i></span><em>aus</em></div>
        </header>
        <div class="pl-bar">
          <div class="seg" role="tablist">
            <button data-mode="wait" class="${this.mode === 'wait' ? 'on' : ''}">Warten</button>
            <button data-mode="rhythm" class="${this.mode === 'rhythm' ? 'on' : ''}">Rhythmus</button>
          </div>
          <div class="tempo ${this.mode === 'rhythm' ? '' : 'dim'}">
            <button data-a="slower" aria-label="Langsamer">−</button>
            <span><b class="tv">${this.bpm()}</b> BPM</span>
            <button data-a="faster" aria-label="Schneller">+</button>
          </div>
          <div class="seg small">
            <button data-hint="2" class="${this.hint === 2 ? 'on' : ''}" title="Notennamen + Griff">Namen</button>
            <button data-hint="1" class="${this.hint === 1 ? 'on' : ''}" title="Nur Griff zeigen">${this.bass ? 'Griff' : 'Tasten'}</button>
            <button data-hint="0" class="${this.hint === 0 ? 'on' : ''}" title="Keine Hilfen">Ohne</button>
          </div>
          <button class="btn ghost" data-a="range" title="Takte auswählen, Schleife üben">${ICON.loop} Takte</button>
          <button class="btn ghost" data-a="listen">${ICON.play} Anhören</button>
          ${this.chords ? `<button class="btn ghost" data-a="along" title="Nur Begleitung, ohne Mikrofon – funktioniert auch mit Bluetooth-Box und AirPods">${ICON.play} Mitspielen</button>` : ''}
          ${this.chords ? `<button class="btn ghost tog ${this.accOn ? 'on' : ''}" data-a="acc" title="Klavier und Schlagzeug im Rhythmus-Modus">Begleitung ${this.accOn ? 'an' : 'aus'}</button>` : ''}
          ${o.boss ? '<span class="boss-tag">Boss · Rhythmus-Modus, ab 2 Sternen geschafft</span>' : ''}
        </div>
        <div class="range-panel" hidden>
          <label>Von Takt <select data-r="from">${Array.from({ length: this.nBars }, (_, i) => `<option ${i === 0 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label>
          <label>bis <select data-r="to">${Array.from({ length: this.nBars }, (_, i) => `<option ${i === this.nBars - 1 ? 'selected' : ''}>${i + 1}</option>`).join('')}</select></label>
          <div class="seg small"><button data-loop="0" class="on">Einmal</button><button data-loop="1">Schleife</button></div>
          <div class="seg small"><button data-up="1" class="on">Tempo steigern</button><button data-up="0">Tempo halten</button></div>
          <button class="btn primary small" data-a="apply">Übernehmen</button>
          <button class="btn ghost small" data-a="whole">Ganzes Stück</button>
          <span class="muted range-info">Schleife: Nach jedem Durchgang mit mindestens 90 % geht das Tempo um 5 % hoch.</span>
        </div>
        <div class="staff-wrap">
          <div class="staff-move"><svg class="staff"></svg></div>
          <div class="playhead"></div>
          <div class="countin"></div>
        </div>
        <div class="pl-status">
          <div class="fb"></div>
          <div class="stats"><span>Treffer <b class="st-acc">–</b></span><span>Combo <b class="st-combo">0</b></span><span><b class="st-pos">0</b>/${this.score.events.length}</span></div>
          <button class="btn primary" data-a="start">${ICON.play} Start</button>
        </div>
        <div class="kb"></div>
      </div>`;
    const $ = s => this.root.querySelector(s);
    this.$ = $;
    this.svg = $('.staff');
    this.move = $('.staff-move');
    this.wrap = $('.staff-wrap');
    this.kb = this.bass ? new Fingerboard($('.kb'), { tol: this.tol }) : new Keyboard($('.kb'), this.score.lo, this.score.hi);
    this.layout();
    this.root.querySelector('.pl').addEventListener('click', e => this.onClick(e));
    this.unsub = Input.on(ev => this.onNote(ev));
    this.ro = new ResizeObserver(() => this.layout(true));
    this.ro.observe(this.wrap);
    Listener.onLevel = (l, n, g) => {
      const v = Math.max(0, Math.min(1, (l - n) / 30));
      const i = this.root.querySelector('.meter i');
      if (i) i.style.width = (v * 100) + '%';
    };
    this.setMicState();
    this.reset();
  }

  bpm() { return Math.round(this.score.tempo * this.tempoF); }

  layout(keep) {
    const h = this.wrap.clientHeight || 300;
    const n = this.score.staves.length;
    const space = Math.max(7, Math.min(n === 2 ? 17 : this.bass ? 19 : 24, (h - 8) / (n === 2 ? 27.5 : this.bass ? 20.8 : 17)));
    this.L = renderScore(this.svg, this.score, { space, pxPerBeat: space * 6, names: this.hint >= 2, tall: this.bass, chords: this.chords });
    this.paint();
    if (keep) this.scrollTo(this.mode === 'wait' ? this.idx : null, true);
  }

  setMicState() {
    const pill = this.root.querySelector('.mic-pill em');
    const inp = S.settings.input;
    if (!pill) return;
    if (inp === 'touch') pill.textContent = 'Touch';
    else if (inp === 'midi') pill.textContent = 'MIDI';
    else pill.textContent = Listener.running ? 'hört zu' : 'aus';
    this.root.querySelector('.mic-pill').classList.toggle('live', Listener.running && inp === 'mic');
  }

  async onClick(e) {
    const b = e.target.closest('button,[data-a]');
    if (!b) return;
    if (b.dataset.mode) {
      this.stopPreview();
      if (this.running) this.stop();
      this.mode = b.dataset.mode;
      this.root.querySelectorAll('[data-mode]').forEach(x => x.classList.toggle('on', x === b));
      this.root.querySelector('.tempo').classList.toggle('dim', this.mode !== 'rhythm');
      this.reset();
      return;
    }
    if (b.dataset.hint != null) {
      this.hint = +b.dataset.hint;
      this.root.querySelectorAll('[data-hint]').forEach(x => x.classList.toggle('on', x === b));
      this.layout(true);
      this.updateHint();
      return;
    }
    if (b.dataset.loop != null) { this.root.querySelectorAll('[data-loop]').forEach(x => x.classList.toggle('on', x === b)); return; }
    if (b.dataset.up != null) { this.root.querySelectorAll('[data-up]').forEach(x => x.classList.toggle('on', x === b)); return; }
    const a = b.dataset.a;
    if (a === 'exit') { this.destroy(); this.o.onExit?.(); }
    if (a === 'range') { const p = this.$('.range-panel'); p.hidden = !p.hidden; this.layout(true); }
    if (a === 'apply' || a === 'whole') {
      let f = +this.$('[data-r=from]').value, t = +this.$('[data-r=to]').value;
      if (a === 'whole') { f = 1; t = this.nBars; this.$('[data-r=from]').value = 1; this.$('[data-r=to]').value = this.nBars; }
      if (t < f) [f, t] = [t, f];
      this.loop = this.$('[data-loop="1"]').classList.contains('on') && a !== 'whole';
      this.loopUp = this.$('[data-up="1"]').classList.contains('on');
      this.setRange(f, t);
      this.$('.range-panel').hidden = true;
      this.layout(true);
    }
    if (a === 'slower' || a === 'faster') {
      this.tempoF = Math.max(0.5, Math.min(1.3, this.tempoF + (a === 'faster' ? 0.1 : -0.1)));
      this.tempoF = Math.round(this.tempoF * 20) / 20;
      this.root.querySelector('.tv').textContent = this.bpm();
      if (this.pkey) { (S.tempi ||= {})[this.pkey] = this.tempoF; save(); }
    }
    if (a === 'listen') this.preview(true);
    if (a === 'along') this.preview(false);
    if (a === 'acc') {
      this.accOn = !this.accOn;
      S.settings.accomp = this.accOn; save();
      b.classList.toggle('on', this.accOn);
      b.textContent = 'Begleitung ' + (this.accOn ? 'an' : 'aus');
      if (!this.accOn) Accomp.stop();
    }
    if (a === 'start') {
      if (this.running || this.loopT) { clearTimeout(this.loopT); this.loopT = null; const was = this.loop; this.stop(); if (was && this.loopRuns) this.feedback(`Schleife beendet nach ${this.loopRuns} Durchgängen.`, 'tip', 3000); this.flushStats(); this.reset(); }
      else this.start();
    }
    if (a === 'mic') this.toggleMic();
  }

  async toggleMic() {
    if (S.settings.input !== 'mic') return;
    if (Listener.running) { Listener.stop(); this.setMicState(); return; }
    await this.ensureMic();
  }
  async ensureMic() {
    Listener.mode = this.bass ? 'bass' : 'piano';
    Listener.onPitch = this.bass ? p => this.kb.setPitch(p) : null;
    if (S.settings.input !== 'mic' || Listener.running) return true;
    try {
      await Listener.start();
      Listener.sens = S.settings.sens;
      this.setMicState();
      return true;
    } catch (err) {
      this.feedback('Kein Mikrofon-Zugriff. Erlaube das Mikrofon in den Browser-Einstellungen oder nutze die Bildschirm-Tastatur.', 'bad', 6000);
      return false;
    }
  }

  setRange(f, t) {
    if (this.running) this.stop();
    this.stopPreview();
    this.range = [f, t];
    const whole = f === 1 && t === this.nBars;
    this.score = whole ? this.full : sliceScore(this.full, f, t);
    const s = (f - 1) * this.full.measure, e = t * this.full.measure;
    const cut = list => list ? list.filter(k => k.beat >= s - 1e-6 && k.beat < e - 1e-6).map(k => ({ ...k, beat: k.beat - s })) : null;
    this.chords = whole ? this.chordsFull : cut(this.chordsFull);
    this.mel = whole ? this.melFull : cut(this.melFull);
    this.loopRuns = 0;
    this.layout();
    this.reset();
    this.feedback(whole ? 'Ganzes Stück ausgewählt.' : `Takt ${f}–${t}${this.loop ? ' in Schleife' : ''} ausgewählt.`, 'tip', 2500);
  }
  // Fehlerstatistik je Ton sammeln
  stat(midi, err, cents) {
    const b = (this.statBuf ||= {});
    const k = midi;
    const x = (b[k] ||= { n: 0, err: 0, c: 0, cn: 0 });
    x.n++; x.err += err;
    if (cents != null) { x.c += Math.abs(cents); x.cn++; }
  }
  flushStats() {
    if (!this.statBuf) return;
    const inst = this.bass ? 'bass' : 'piano';
    const all = ((S.noteStats ||= {})[inst] ||= {});
    for (const [k, v] of Object.entries(this.statBuf)) {
      const x = (all[k] ||= { n: 0, err: 0, c: 0, cn: 0 });
      x.n += v.n; x.err += v.err; x.c += v.c; x.cn += v.cn;
    }
    this.statBuf = null;
    save();
  }
  startRec() {
    this.recUrl = null;
    try {
      if (!Listener.running || !window.MediaRecorder || S.settings.record === false) return;
      const chunks = [];
      this.rec = new MediaRecorder(Listener.stream);
      this.rec.ondataavailable = e => e.data.size && chunks.push(e.data);
      this.rec.onstop = () => { this.recUrl = URL.createObjectURL(new Blob(chunks, { type: this.rec.mimeType || 'audio/mp4' })); };
      this.rec.start();
    } catch (e) { this.rec = null; }
  }
  stopRec() { try { if (this.rec && this.rec.state === 'recording') this.rec.stop(); } catch (e) { /* egal */ } }

  reset() {
    this.idx = 0;
    this.combo = 0; this.best = 0;
    this.wrong = 0;
    this.ev = this.score.events.map(e => ({ ...e, status: 'pending', tries: 0, hits: {}, pts: 0 }));
    this.paint();
    this.updateStats();
    this.$('.playhead').style.display = this.mode === 'rhythm' ? 'block' : 'none';
    this.$('[data-a=start]').innerHTML = `${ICON.play} Start`;
    this.scrollTo(this.mode === 'wait' ? 0 : null, true);
    if (this.mode === 'rhythm') this.placeRhythm(-this.score.measure);
    this.updateHint();
    this.feedback(this.mode === 'wait' ? 'Warte-Modus: Spiel die markierte Note – die App wartet auf dich.' : 'Rhythmus-Modus: Nach einem Takt Vorzähler läuft die Musik im Tempo.');
  }

  paint() {
    if (!this.L || !this.ev) return;
    this.L.evEls.forEach((g, i) => {
      if (!g) return;
      const e = this.ev[i];
      g.setAttribute('class', 'ev ' + (e.status !== 'pending' ? e.status : (this.mode === 'wait' && i === this.idx && this.running ? 'cur' : (this.mode === 'wait' && i === this.idx ? 'next' : ''))));
    });
  }

  scrollTo(i, instant) {
    if (i == null || !this.L) return;
    const e = this.score.events[Math.min(i, this.score.events.length - 1)];
    if (!e) return;
    const vw = this.wrap.clientWidth;
    const target = Math.min(0, Math.max(vw - this.L.width - 20, vw * 0.3 - this.L.X(e.beat)));
    const x = i === 0 ? 0 : target;
    this.move.style.transition = instant ? 'none' : 'transform .35s cubic-bezier(.2,.7,.2,1)';
    this.move.style.transform = `translateX(${x}px)`;
  }
  placeRhythm(beat) {
    const vw = this.wrap.clientWidth;
    const ph = Math.round(vw * 0.28);
    this.$('.playhead').style.left = ph + 'px';
    this.move.style.transition = 'none';
    this.move.style.transform = `translateX(${ph - this.L.X(beat)}px)`;
  }

  updateHint(force) {
    const e = this.ev?.[this.idx];
    if (this.mode === 'wait' && e && (this.hint >= 1 || force)) this.kb.hint(e.midis, this.hint >= 2 || force, e);
    else this.kb.hint([]);
    if (this.bass && e) { this.kb.target = e.midis[0]; this.kb.grip = e.grip; }
  }

  feedback(t, cls = '', ms = 0) {
    const f = this.$('.fb');
    f.textContent = t;
    f.className = 'fb ' + cls;
    clearTimeout(this._fb);
    if (ms) this._fb = setTimeout(() => { f.textContent = ''; f.className = 'fb'; }, ms);
  }
  updateStats() {
    const done = this.ev.filter(e => e.status !== 'pending');
    const acc = done.length ? this.accuracy(done.length) : null;
    this.$('.st-acc').textContent = acc == null ? '–' : Math.round(acc * 100) + ' %';
    this.$('.st-combo').textContent = this.combo;
    this.$('.st-pos').textContent = done.length;
  }
  accuracy(n = this.ev.length) {
    const pts = this.ev.reduce((a, e) => a + e.pts, 0);
    const pen = this.mode === 'rhythm' ? Math.min(pts * 0.3, this.wrong * 0.25) : 0;
    return Math.max(0, (pts - pen) / n);
  }

  required(e) {
    const ms = e.midis;
    const mode = S.settings.chord;
    if (ms.length === 1 || mode === 'streng') return ms;
    const top = ms[ms.length - 1];
    if (mode === 'locker') return [top];
    if (ms.length <= 2) return ms;
    const need = Math.ceil(ms.length * 0.6);
    return { top, need };
  }
  satisfied(e, hits) {
    const r = this.required(e);
    if (Array.isArray(r)) return r.every(m => hits[m] != null);
    if (hits[r.top] == null) return false;
    return Object.keys(hits).filter(m => e.midis.includes(+m)).length >= r.need;
  }

  stopPreview() {
    if (!this.previewing) return;
    this.previewing = false;
    cancelAnimationFrame(this.praf);
    Synth.stopAll();
    Accomp.stop();
    Listener.muted = false;
    this.resetPreviewBtns();
  }

  resetPreviewBtns() {
    const a = this.$('[data-a=listen]'); if (a) a.innerHTML = `${ICON.play} Anhören`;
    const b = this.$('[data-a=along]'); if (b) b.innerHTML = `${ICON.play} Mitspielen`;
  }

  async start() {
    this.stopPreview();
    await unlockAudio();
    if (!(await this.ensureMic()) && S.settings.input === 'mic') { /* Touch geht trotzdem */ }
    this.reset();
    this.running = true;
    this.t0wall = performance.now();
    this.$('[data-a=start]').innerHTML = `${ICON.stop} Stopp`;
    this.wake();
    this.startRec();
    if (this.mode === 'wait') {
      this.evStart = performance.now() / 1000;
      Listener.setExpected(this.ev[0].midis);
      this.paint();
      this.feedback('Los geht’s – spiel die blaue Note.');
      this.stuckTimer = setInterval(() => {
        if (!this.running) return;
        if (performance.now() / 1000 - this.evStart > 7 && this.hint < 1) {
          this.updateHint(true);
          this.feedback('Tipp: Die gesuchte Taste leuchtet unten.', 'tip');
        }
      }, 1000);
    } else {
      this.startRhythm();
    }
  }

  stop() {
    this.running = false;
    this.stopRec();
    Synth.stopAll();
    this.$('.countin')?.classList.remove('on');
    this.$('[data-a=start]').innerHTML = `${ICON.play} Start`;
    cancelAnimationFrame(this.raf);
    clearInterval(this.stuckTimer);
    Accomp.stop();
    Listener.setExpected([]);
    Listener.muted = false;
    this.unwake();
  }

  // ----- Warte-Modus -----
  onNote({ midi, t, source, cents }) {
    if (!this.running) return;
    if (this.mode === 'rhythm') return this.onNoteRhythm(midi, t, source, cents);
    const e = this.ev[this.idx];
    if (!e) return;
    if (this.bass && source === 'mic') {
      const mt = this.bassMatch(midi, cents, [...e.midis, ...(this.ev[this.idx - 1]?.midis || [])]);
      if (mt) { midi = mt.midi; cents = mt.cents; }
    }
    if (e.midis.includes(midi) && this.bass && source === 'mic' && cents != null) {
      const c = Math.round(cents), ac = Math.abs(c);
      e.inton = c;
      e.intonPts = this.intonPts(ac);
    }
    if (e.midis.includes(midi)) {
      e.hits[midi] = t;
      for (const k of Object.keys(e.hits)) if (t - e.hits[k] > 0.8) delete e.hits[k];
      this.kb.flash(midi, 'ok');
      if (this.satisfied(e, e.hits)) this.advance();
      return;
    }
    // klingt die vorige Note noch nach?
    const prev = this.ev[this.idx - 1];
    if (prev && prev.midis.includes(midi) && t - this.lastAdvance < 0.6) return;
    if (t - (this.lastWrong || 0) < 0.35) return;
    this.lastWrong = t;
    this.kb.flash(midi, 'bad');
    // Kontrabass: Fehlerkennungen (Nachklang, Resonanz) nicht bestrafen
    if (this.bass && source === 'mic') { this.feedback(`Gehört: ${midiName(midi)}`, 'tip', 1200); return; }
    e.tries++;
    this.combo = 0;
    const g = this.L.evEls[this.idx];
    if (g) { g.classList.add('shake'); setTimeout(() => g.classList.remove('shake'), 400); }
    this.feedback(`Das war ${midiName(midi)} – versuch’s nochmal.`, 'bad', 2000);
    this.updateStats();
  }
  // Kontrabass: großzügige Zuordnung (bis 70 Cent daneben, Oktavfehler des Mikrofons)
  bassMatch(midi, cents, cands) {
    const f = midi + (cents || 0) / 100;
    let best = null;
    for (const m of new Set(cands)) for (const oct of [0, 12, -12]) {
      const d = f - (m + oct);
      if (Math.abs(d) <= 0.7 && (!best || Math.abs(d) < Math.abs(best.d))) best = { midi: m, d };
    }
    return best ? { midi: best.midi, cents: best.d * 100 } : null;
  }
  intonPts(ac) {
    const full = Math.max(30, this.tol * 2);
    return ac <= full ? 1 : ac <= 55 ? 0.9 : 0.75;
  }
  advance() {
    const e = this.ev[this.idx];
    for (const m of e.midis) this.stat(m, e.tries ? 1 : 0, e.inton);
    const ip = e.intonPts ?? 1;
    e.status = e.tries === 0 && ip >= 0.9 ? 'ok' : 'meh';
    e.pts = (e.tries === 0 ? 1 : e.tries === 1 ? 0.5 : 0.25) * ip;
    if (e.tries === 0) { this.combo++; this.best = Math.max(this.best, this.combo); }
    this.lastAdvance = performance.now() / 1000;
    this.idx++;
    this.evStart = this.lastAdvance;
    if (e.tries === 0 && this.combo > 0 && this.combo % 10 === 0) this.feedback(`${this.combo}er-Combo!`, 'good', 1500);
    else if (e.tries === 0 && ip === 1) this.feedback('', '');
    if (this.idx >= this.ev.length) { this.paint(); this.updateStats(); return this.finish(); }
    Listener.setExpected(this.ev[this.idx].midis);
    this.paint();
    this.updateStats();
    this.updateHint();
    this.scrollTo(this.idx);
  }

  // ----- Rhythmus-Modus -----
  startRhythm() {
    const spb = 60 / this.bpm();
    this.spb = spb;
    const c = getCtx();
    const lead = 0.4;
    const countBeats = this.score.measure;
    const perfNow = performance.now() / 1000;
    this.tStart = perfNow + lead + countBeats * spb;
    const ctxStart = c.currentTime + lead;
    for (let i = 0; i < countBeats; i++) Synth.click(ctxStart + i * spb, i === 0);
    if (S.settings.metronome) {
      const total = Math.ceil(this.score.total);
      for (let b = 0; b < total; b++) Synth.click(ctxStart + (countBeats + b) * spb, b % this.score.measure === 0);
    }
    if (this.chords && this.accOn) Accomp.schedule(this.chords, spb, ctxStart + countBeats * spb, this.score.style || 'straight', this.score.measure, S.settings.accVol ?? 1, this.mel);
    this.missIdx = 0;
    this.win = this.bass ? Math.max(0.32, Math.min(0.5, spb * 0.6)) : Math.max(0.22, Math.min(0.32, spb * 0.4));
    this.paint();
    const ci = this.$('.countin');
    const loop = () => {
      if (!this.running) return;
      const now = performance.now() / 1000;
      const songT = now - this.tStart;
      const beat = songT / spb;
      this.placeRhythm(beat);
      if (songT < 0) {
        const n = Math.ceil(-songT / spb);
        ci.textContent = n <= countBeats ? n : '';
        ci.classList.toggle('on', n <= countBeats);
      } else ci.classList.remove('on');
      // erwartete Töne fürs Mikrofon
      const exp = [];
      for (let i = this.missIdx; i < this.ev.length; i++) {
        const te = this.ev[i].beat * spb;
        if (te > songT + 0.5) break;
        if (te > songT - 0.4 && this.ev[i].status === 'pending') exp.push(...this.ev[i].midis);
      }
      Listener.setExpected([...new Set(exp)]);
      // Kontrabass: Tonwiederholung ohne hörbaren neuen Anschlag trotzdem werten
      if (this.bass && S.settings.input === 'mic') {
        for (let i = this.missIdx; i < this.ev.length; i++) {
          const e = this.ev[i], te = e.beat * spb;
          if (te > songT) break;
          const pv = this.ev[i - 1];
          if (e.status !== 'pending' || !pv || pv.status === 'miss' || pv.status === 'pending' || pv.midis[0] !== e.midis[0] || songT - te < 0.06) continue;
          const p = Listener.pitch;
          if (p && p.clarity > 0.75 && Math.abs(((p.midi - e.midis[0] + 6) % 12 + 12) % 12 - 6) < 0.7) {
            e.status = 'ok'; e.pts = 0.92; this.combo++; this.best = Math.max(this.best, this.combo); this.paint(); this.updateStats();
          }
        }
      }
      // verpasste
      while (this.missIdx < this.ev.length && this.ev[this.missIdx].beat * spb + this.win < songT) {
        const e = this.ev[this.missIdx];
        if (e.status === 'pending') { e.midis.forEach(m => this.stat(m, 1)); e.status = 'miss'; e.pts = 0; this.combo = 0; this.feedback('Verpasst', 'bad', 700); this.paint(); this.updateStats(); }
        this.missIdx++;
      }
      // Hinweis-Tasten
      if (this.hint >= 1) {
        const nx = this.ev.find(e => e.status === 'pending' && e.beat * spb > songT - this.win);
        const key = nx ? nx.i : -1;
        if (key !== this._lastHint) { this._lastHint = key; this.kb.hint(nx ? nx.midis : [], this.hint >= 2, nx); }
      }
      if (songT > this.score.total * spb + 0.6) return this.finish();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }
  onNoteRhythm(midi, t, source, cents) {
    const lat = source === 'mic' ? (this.bass ? (S.settings.latencyBass ?? (S.settings.latency || 0) * 0.4) : (S.settings.latency || 0)) / 1000 : source === 'touch' ? 0.02 : 0;
    const songT = t - this.tStart - lat;
    if (this.bass && source === 'mic') {
      const near = this.ev.filter(e => Math.abs(e.beat * this.spb - songT) <= this.win + 0.1).flatMap(e => e.midis);
      const mt = this.bassMatch(midi, cents, near);
      if (mt) { midi = mt.midi; cents = mt.cents; }
    }
    let best = null, bd = 9;
    for (let i = Math.max(0, this.missIdx - 2); i < this.ev.length; i++) {
      const e = this.ev[i];
      const te = e.beat * this.spb;
      if (te > songT + this.win) break;
      if (e.status !== 'pending' || !e.midis.includes(midi) || e.hits[midi] != null) continue;
      const d = Math.abs(te - songT);
      if (d <= this.win && d < bd) { bd = d; best = e; }
    }
    if (!best) {
      // Nachklang des gerade getroffenen Tons ignorieren
      const recent = this.ev.find(e => e.status !== 'pending' && e.status !== 'miss' && e.midis.includes(midi) && Math.abs(e.beat * this.spb - songT) < 0.5);
      if (recent) return;
      if (this.bass && source === 'mic') { this.kb.flash(midi, 'bad'); return; }
      this.wrong++;
      this.combo = 0;
      this.kb.flash(midi, 'bad');
      this.feedback(`Falscher Ton: ${midiName(midi)}`, 'bad', 900);
      this.updateStats();
      return;
    }
    best.hits[midi] = songT;
    if (this.bass && source === 'mic' && cents != null) best.inton = Math.round(cents);
    this.kb.flash(midi, 'ok');
    if (this.satisfied(best, best.hits)) {
      const te = best.beat * this.spb;
      const dts = Object.values(best.hits).map(h => Math.abs(h - te));
      const dt = Math.max(...dts);
      let grade, pts;
      const [tp, tg] = this.bass ? [0.13, 0.25] : [0.08, 0.16];
      if (dt <= tp) { grade = 'Perfekt'; pts = 1; best.status = 'ok'; }
      else if (dt <= tg) { grade = 'Gut'; pts = this.bass ? 0.92 : 0.8; best.status = 'ok'; }
      else { grade = 'OK'; pts = this.bass ? 0.78 : 0.5; best.status = 'meh'; }
      let itxt = '';
      if (this.bass && best.inton != null) {
        const ac = Math.abs(best.inton);
        pts *= this.intonPts(ac);
        if (ac > Math.max(30, this.tol * 2)) itxt = ` · etwas ${best.inton > 0 ? 'hoch' : 'tief'}`;
      }
      best.pts = pts;
      best.midis.forEach(m => this.stat(m, pts >= 0.9 ? 0 : 0.5, best.inton));
      this.combo++; this.best = Math.max(this.best, this.combo);
      const early = Object.values(best.hits).reduce((a, h) => a + (h - te), 0) / dts.length;
      this.feedback(grade + (grade !== 'Perfekt' ? (early < 0 ? ' · zu früh' : ' · zu spät') : '') + itxt, grade === 'OK' || itxt ? 'tip' : 'good', 800);
      this.paint();
      this.updateStats();
    }
  }

  // ----- Vorhören -----
  // withMelody=false: nur Begleitung zum Mitspielen (ohne Mikrofon -> läuft auch über Bluetooth-Box/AirPods)
  async preview(withMelody = true) {
    if (this.previewing) { const same = this.previewBtn === (withMelody ? 'listen' : 'along'); this.stopPreview(); this.reset(); if (same) return; }
    await unlockAudio();
    if (this.running) this.stop();
    if (Listener.running) { Listener.stop(); this.setMicState(); }
    Synth.stopAll();
    this.reset();
    this.previewBtn = withMelody ? 'listen' : 'along';
    const spb = 60 / this.bpm();
    const c = getCtx();
    const t0 = c.currentTime + 0.3;
    const tr = this.score.transpose || 0;
    if (!withMelody) {
      const cb = this.score.measure;
      for (let i = 0; i < cb; i++) Synth.click(t0 + i * spb, i === 0);
    }
    const tM = withMelody ? t0 : t0 + this.score.measure * spb;
    if (withMelody) for (const n of this.score.notes) if (!n.rest && !n.tiedFrom) for (const p of n.pitches) {
      const d = n.playDur || n.dur;
      if (this.bass) Synth.bass(p.midi + tr, t0 + n.beat * spb, d * spb * (this.score.tech === 'pizz' ? 0.6 : 0.92), this.score.tech === 'pizz', 0.9);
      else Synth.note(p.midi, t0 + n.beat * spb, d * spb * 0.95, n.staff === 'b' ? 0.6 : 0.8);
    }
    if (this.chords && (this.accOn || !withMelody)) Accomp.schedule(this.chords, spb, tM, this.score.style || 'straight', this.score.measure, S.settings.accVol ?? 1, this.mel);
    Listener.muted = true;
    this.$('.playhead').style.display = 'block';
    const p0 = performance.now() / 1000 + 0.3 + (tM - t0);
    this.previewing = true;
    this.$(`[data-a=${this.previewBtn}]`).innerHTML = `${ICON.stop} Stopp`;
    const loop = () => {
      const s = performance.now() / 1000 - p0;
      this.placeRhythm(s / spb);
      if (s < this.score.total * spb + 0.5 && this.previewing) this.praf = requestAnimationFrame(loop);
      else {
        this.previewing = false;
        Accomp.stop();
        Listener.muted = false;
        this.resetPreviewBtns();
        this.reset();
      }
    };
    this.praf = requestAnimationFrame(loop);
  }

  finish() {
    this.stop();
    this.flushStats();
    this.$('[data-a=start]').innerHTML = `${ICON.play} Start`;
    const acc = this.accuracy();
    if (this.loop) {
      this.loopRuns++;
      let msg = `Durchgang ${this.loopRuns}: ${Math.round(acc * 100)} %`;
      if (this.mode === 'rhythm' && this.loopUp && acc >= 0.9 && this.tempoF < 1.3) {
        this.tempoF = Math.min(1.3, Math.round((this.tempoF + 0.05) * 20) / 20);
        this.$('.tv').textContent = this.bpm();
        msg += ` · schneller: ${this.bpm()} BPM`;
      }
      this.feedback(msg + ' · Stopp beendet die Schleife', 'good', 3000);
      this.loopT = setTimeout(() => { if (!this.running && this.loop) this.start(); }, 1500);
      return;
    }
    const [s3, s2, s1] = this.bass ? [0.88, 0.7, 0.5] : [0.95, 0.8, 0.6];
    const st = acc >= s3 ? 3 : acc >= s2 ? 2 : acc >= s1 ? 1 : 0;
    const res = {
      accuracy: acc, stars: st, mode: this.mode, tempoF: this.tempoF, best: this.best,
      wrong: this.wrong + this.ev.reduce((a, e) => a + e.tries, 0),
      perfect: this.mode === 'rhythm' && this.ev.every(e => e.pts === 1) && this.wrong === 0,
      seconds: (performance.now() - this.t0wall) / 1000,
      inton: this.bass ? (() => { const v = this.ev.filter(e => e.inton != null).map(e => Math.abs(e.inton)); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; })() : null,
    };
    this.o.onFinish?.(res, this);
  }

  async wake() { try { this.wl = await navigator.wakeLock?.request('screen'); } catch (e) { /* egal */ } }
  unwake() { try { this.wl?.release(); } catch (e) { /* egal */ } this.wl = null; }

  destroy() {
    clearTimeout(this.loopT); this.loop = false;
    this.flushStats();
    this.stopPreview();
    this.stop();
    cancelAnimationFrame(this.praf);
    this.unsub?.();
    this.ro?.disconnect();
    Listener.onLevel = null;
    Listener.onPitch = null;
    Listener.muted = false;
    Accomp.stop();
  }
}

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ICON = {
  back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
  stop: '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="currentColor"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0013 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="currentColor"/></svg>',
  flame: '<svg viewBox="0 0 24 24"><path d="M12.5 2.5c.5 3.2-1.6 4.8-3 6.6C8 11 7 12.7 7 15a5 5 0 0010 0c0-1.8-.7-3.3-1.6-4.4-.2 1.4-.9 2.4-2 2.9.6-3.6-.2-7.6-.9-11z" fill="currentColor"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.2" fill="currentColor"/><path d="M8 10.5V8a4 4 0 018 0v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/></svg>',
  crown: '<svg viewBox="0 0 24 24"><path d="M3.5 8l4.5 4 4-7 4 7 4.5-4-2 11h-13z" fill="currentColor"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5zM12 6.5v13" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  note: '<svg viewBox="0 0 24 24"><path d="M9 17.5a3 3 0 11-2-2.83V4l11-2v12.5a3 3 0 11-2-2.83V5.4L9 6.7z" fill="currentColor"/></svg>',
  ear: '<svg viewBox="0 0 24 24"><path d="M7 9a5.5 5.5 0 0111 0c0 3.2-3 4.2-3.5 6.5-.4 2-1.6 3.5-3.5 3.5a3 3 0 01-3-3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M10 9.5a2.5 2.5 0 015 0c0 1.5-1.5 2-2 3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  bolt: '<svg viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 01-10 0zM7 5H3.5a3.5 3.5 0 003.7 4.5M17 5h3.5a3.5 3.5 0 01-3.7 4.5M12 13v4M8 21h8M9.5 17h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  piece: '<svg viewBox="0 0 24 24"><path d="M5 4h14v16H5z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 9h8M8 12.5h8M8 16h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  loop: '<svg viewBox="0 0 24 24"><path d="M17 3l3 3-3 3M20 6H8a4 4 0 00-4 4v1M7 21l-3-3 3-3M4 18h12a4 4 0 004-4v-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  rec: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="6.5" fill="currentColor"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  edit: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  cloud: '<svg viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 00.5-8 6 6 0 00-11.5 1.5A3.3 3.3 0 007 18z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  scale: '<svg viewBox="0 0 24 24"><path d="M3 20h4v-4h4v-4h4V8h4V4h2" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  jam: '<svg viewBox="0 0 24 24"><path d="M9 18V6l11-2v12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="6.5" cy="18" r="2.6" fill="currentColor"/><circle cx="17.5" cy="16" r="2.6" fill="currentColor"/></svg>',
  wand: '<svg viewBox="0 0 24 24"><path d="M4 20L15 9M14 4v3M19 9h-3M18 5l-2 2M10 4l.7 1.6M20 14l-1.6-.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  tuner: '<svg viewBox="0 0 24 24"><path d="M4 16a8 8 0 0116 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 16l4-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16" r="1.8" fill="currentColor"/></svg>',
  drill: '<svg viewBox="0 0 24 24"><path d="M3 7h18M3 11h18M3 15h18" stroke="currentColor" stroke-width="1.6"/><ellipse cx="9" cy="13" rx="2.6" ry="2" fill="currentColor"/><path d="M11.4 13V4" stroke="currentColor" stroke-width="1.8"/><ellipse cx="16" cy="9" rx="2.6" ry="2" fill="currentColor"/><path d="M18.4 9V1.8" stroke="currentColor" stroke-width="1.8"/></svg>',
};
