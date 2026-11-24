// Audio: Klavierklang, Metronom, Mikrofon-Tonerkennung, Eingabe-Hub (Mikro / Touch / MIDI)

export const midiToFreq = m => 440 * Math.pow(2, (m - 69) / 12);
export const freqToMidi = f => 69 + 12 * Math.log2(f / 440);

let ctx = null;
export function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
  return ctx;
}
export async function unlockAudio() {
  const c = getCtx();
  if (c.state !== 'running') { try { await c.resume(); } catch (e) { /* ignoriert */ } }
  return c;
}

// ---------------- Eingabe-Hub ----------------
// Alle Quellen melden "Taste angeschlagen" hier. Später einfach weitere Quellen anschließen.
export const Input = {
  subs: new Set(),
  on(fn) { this.subs.add(fn); return () => this.subs.delete(fn); },
  emit(midi, source, t = performance.now() / 1000) { for (const f of this.subs) f({ midi, source, t }); },
};

// ---------------- Klavierklang ----------------
export const Synth = {
  out: null,
  init() {
    if (this.out) return;
    const c = getCtx();
    this.out = c.createGain();
    this.out.gain.value = 0.9;
    const comp = c.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    this.out.connect(comp); comp.connect(c.destination);
    this.listeners = new Set();
  },
  note(midi, when = 0, dur = 0.5, vel = 0.8) {
    this.init();
    const c = getCtx();
    const t0 = Math.max(c.currentTime, when || c.currentTime);
    const f = midiToFreq(midi);
    const g = c.createGain();
    g.connect(this.out);
    const peak = 0.22 * vel;
    const decay = Math.max(0.5, 2.6 - (midi - 48) * 0.035);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(peak, t0 + 0.006);
    g.gain.setTargetAtTime(peak * 0.25, t0 + 0.006, decay / 3);
    g.gain.setTargetAtTime(0.0001, t0 + dur, 0.09);
    const end = t0 + dur + 0.6;
    const parts = [1, 0.55, 0.32, 0.2, 0.12, 0.07, 0.04];
    parts.forEach((a, i) => {
      const fr = f * (i + 1) * (1 + 0.0003 * (i + 1) * (i + 1));
      if (fr > 12000) return;
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = fr;
      const pg = c.createGain();
      const amp = a * (midi > 72 ? 0.8 : 1);
      pg.gain.setValueAtTime(amp, t0);
      pg.gain.setTargetAtTime(amp * 0.15, t0, 0.25 + 0.9 / (i + 1));
      o.connect(pg); pg.connect(g);
      o.start(t0); o.stop(end);
    });
    // kleiner Hammer-Anschlag
    const n = c.createBufferSource();
    const buf = c.createBuffer(1, c.sampleRate * 0.03, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3) * 0.25;
    n.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(4000, f * 4); bp.Q.value = 1.2;
    const ng = c.createGain(); ng.gain.value = 0.25 * vel;
    n.connect(bp); bp.connect(ng); ng.connect(g); n.start(t0);
  },
  chord(midis, when, dur, vel) { midis.forEach(m => this.note(m, when, dur, vel)); },
  click(when = 0, accent = false) {
    this.init();
    const c = getCtx();
    const t0 = Math.max(c.currentTime, when || c.currentTime);
    const o = c.createOscillator(); o.type = 'square';
    o.frequency.value = accent ? 1760 : 1175;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(accent ? 0.16 : 0.09, t0 + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
    o.connect(g); g.connect(this.out); o.start(t0); o.stop(t0 + 0.06);
  },
};

// ---------------- Mikrofon-Erkennung ----------------
// Kombination aus YIN-Tonhöhenerkennung (einstimmig) und Spektral-Abgleich der erwarteten Töne (mehrstimmig).
export const Listener = {
  running: false,
  expected: [],
  muted: false,
  sens: 0.55,           // 0..1
  level: -100,
  noise: -70,
  pitch: null,          // {midi, clarity}
  onLevel: null,
  async start() {
    if (this.running) return true;
    const c = await unlockAudio();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    this.src = c.createMediaStreamSource(this.stream);
    this.an = c.createAnalyser();
    this.an.fftSize = 8192;
    this.an.smoothingTimeConstant = 0;
    this.src.connect(this.an);
    this.sr = c.sampleRate;
    this.binHz = this.sr / this.an.fftSize;
    this.td = new Float32Array(this.an.fftSize);
    this.fd = new Float32Array(this.an.frequencyBinCount);
    this.dec = new Float32Array(1024);
    this.yinBuf = new Float32Array(420);
    this.state = new Map();
    this.shortHist = [];
    this.lastOnset = 0;
    this.yinHist = [];
    this.running = true;
    this.timer = setInterval(() => this.tick(), 22);
    return true;
  },
  stop() {
    if (!this.running) return;
    clearInterval(this.timer);
    this.stream.getTracks().forEach(t => t.stop());
    this.running = false;
  },
  setExpected(midis) { this.expected = midis || []; },

  // dB-Wert eines echten Spektral-Maximums nahe f (±¼ Halbton), sonst -200
  peak(f) {
    const k = f / this.binHz;
    if (k > this.fd.length - 12 || k < 4) return -200;
    const w = Math.max(1, k * 0.0145);
    const a = Math.max(2, Math.floor(k - w)), b = Math.min(this.fd.length - 3, Math.ceil(k + w));
    let mx = -300, ai = -1;
    for (let i = a; i <= b; i++) if (this.fd[i] > mx) { mx = this.fd[i]; ai = i; }
    if (!(this.fd[ai] >= this.fd[ai - 1] && this.fd[ai] >= this.fd[ai + 1])) return -200;
    // Prominenz: echter Sinus-Peak muss deutlich aus der Umgebung ragen
    const span = Math.max(6, Math.round(k * 0.06));
    let l = 0, r = 0;
    l = Math.min(...Array.from(this.fd.subarray(Math.max(1, ai - span), ai)));
    r = Math.min(...Array.from(this.fd.subarray(ai + 1, Math.min(this.fd.length, ai + span + 1))));
    if (mx - Math.max(l, r) < 12) return -200;
    return mx;
  },
  sal(m) {
    const f = midiToFreq(m);
    const W = f < 180 ? [0.2, 0.35, 0.3, 0.15] : f < 400 ? [0.4, 0.3, 0.2, 0.1] : [0.6, 0.25, 0.15, 0];
    const R = 20 + this.sens * 14;
    let s = 0;
    const p = [];
    for (let h = 0; h < 4; h++) {
      const v = W[h] ? this.peak(f * (h + 1)) : -200;
      p.push(v);
      if (v > -200) s += W[h] * Math.max(0, Math.min(1, (v - this.gmax + R) / R));
    }
    return { s, p, lvl: Math.max(p[0], p[1]) };
  },
  yin() {
    // auf 1/2 heruntergerechnet
    const td = this.td, N = 1024, off = td.length - 2048;
    for (let i = 0; i < N; i++) this.dec[i] = (td[off + 2 * i] + td[off + 2 * i + 1]) * 0.5;
    const sr = this.sr / 2, x = this.dec;
    const tauMin = Math.floor(sr / 2200), tauMax = Math.min(400, Math.floor(sr / 60));
    const W = N - tauMax;
    const d = this.yinBuf;
    d[0] = 1;
    let run = 0;
    for (let tau = 1; tau <= tauMax; tau++) {
      let s = 0;
      for (let i = 0; i < W; i++) { const v = x[i] - x[i + tau]; s += v * v; }
      run += s;
      d[tau] = run ? s * tau / run : 1;
    }
    let tau = -1;
    for (let t = tauMin; t < tauMax; t++) {
      if (d[t] < 0.15) { while (t + 1 < tauMax && d[t + 1] < d[t]) t++; tau = t; break; }
    }
    if (tau < 0) {
      let best = 1, bt = -1;
      for (let t = tauMin; t < tauMax; t++) if (d[t] < best) { best = d[t]; bt = t; }
      if (best > 0.35) return null;
      tau = bt;
    }
    const a = d[tau - 1] ?? d[tau], b = d[tau], c = d[tau + 1] ?? d[tau];
    const den = a + c - 2 * b;
    const t2 = den ? tau + (a - c) / (2 * den) : tau;
    const f = sr / t2;
    return { midi: freqToMidi(f), clarity: 1 - b };
  },
  tick() {
    const an = this.an;
    an.getFloatTimeDomainData(this.td);
    // Pegel (kurzes Fenster ~20 ms)
    let s = 0;
    const n0 = this.td.length - 1024;
    for (let i = n0; i < this.td.length; i++) s += this.td[i] * this.td[i];
    const lvl = 10 * Math.log10(s / 1024 + 1e-12);
    this.level = lvl;
    if (lvl < this.noise) this.noise = this.noise * 0.8 + lvl * 0.2;
    else this.noise += 0.015;
    const gateDb = this.noise + 8 + (1 - this.sens) * 10;
    const gate = lvl > gateDb && lvl > -72;
    this.shortHist.push(lvl);
    if (this.shortHist.length > 6) this.shortHist.shift();
    const now = performance.now() / 1000;
    const minRecent = Math.min(...this.shortHist.slice(0, -1));
    const onset = gate && lvl - minRecent > 5 && now - this.lastOnset > 0.2;
    if (onset) this.lastOnset = now;
    if (this.onLevel) this.onLevel(lvl, this.noise, gate);
    if (this.muted || now < (this.muteUntil || 0)) return;

    an.getFloatFrequencyData(this.fd);
    const a0 = Math.floor(50 / this.binHz), b0 = Math.floor(5000 / this.binHz);
    let gmax = -300;
    for (let i = a0; i < b0; i++) if (this.fd[i] > gmax) gmax = this.fd[i];
    this.gmax = gmax;

    const y = gate ? this.yin() : null;
    this.pitch = y;
    this.yinHist.push(y && y.clarity > 0.86 ? Math.round(y.midi) : null);
    if (this.yinHist.length > 3) this.yinHist.shift();
    const yinStable = this.yinHist.length >= 2 && this.yinHist.at(-1) != null && this.yinHist.at(-1) === this.yinHist.at(-2) ? this.yinHist.at(-1) : null;
    const onsetRecent = now - this.lastOnset < 0.16;

    const cands = new Set(this.expected);
    if (yinStable != null) cands.add(yinStable);
    for (const m of cands) {
      const st = this.state.get(m) || { on: false, last: 0, hist: [] };
      const r = this.sal(m);
      st.hist.push(r.lvl);
      if (st.hist.length > 8) st.hist.shift();
      const prevMin = Math.min(...st.hist.slice(0, -1).filter(v => v > -200), r.lvl > -200 ? r.lvl - 40 : 0);
      const rise = r.lvl - prevMin;
      let present = false, emit = false;
      if (this.expected.includes(m)) {
        const f = midiToFreq(m);
        const R2 = 20 + this.sens * 14, strong = i => r.p[i] > -200 && r.p[i] > gmax - R2;
        let ok = gate && r.s >= 0.4 && (f >= 110 ? strong(0) && (strong(1) || f > 700) : strong(1) && strong(2));
        // Oktave tiefer gespielt (nicht erwartet)?
        if (ok && !this.expected.includes(m - 12)) {
          const lo = this.peak(f / 2), fifth = this.peak(f * 1.5);
          if (lo > -200 && fifth > -200 && lo > gmax - 25 && fifth > gmax - 40) ok = false;
        }
        if (this.expected.length === 1 && yinStable != null && yinStable !== m) ok = false;   // klar ein anderer Ton
        st.cnt = ok ? (st.cnt || 0) + 1 : 0;
        present = ok || yinStable === m;
        emit = present && (
          (yinStable === m && !st.on) ||
          (st.cnt >= 2 && now - this.lastOnset < 0.3 && rise >= 3 && this.lastOnset > st.last)
        );
      } else {
        const pcs = this.expected.map(x => ((x % 12) + 12) % 12);
        present = gate && yinStable === m && (this.expected.length < 2 || !pcs.includes(((m % 12) + 12) % 12));
        emit = present && !st.on && this.lastOnset > st.last - 0.2;
      }
      if (emit) { st.last = now; Input.emit(m, 'mic', now); }
      st.on = present;
      this.state.set(m, st);
    }
  // alte Zustände abbauen
    for (const [m, st] of this.state) if (!cands.has(m)) { st.on = false; }
  },
};

// ---------------- MIDI (vorbereitet) ----------------
export const Midi = {
  supported: typeof navigator !== 'undefined' && !!navigator.requestMIDIAccess,
  connected: false,
  async connect() {
    const acc = await navigator.requestMIDIAccess();
    const bind = () => {
      let n = 0;
      acc.inputs.forEach(inp => {
        n++;
        inp.onmidimessage = e => {
          const [st, note, vel] = e.data;
          if ((st & 0xf0) === 0x90 && vel > 0) Input.emit(note, 'midi');
        };
      });
      this.connected = n > 0;
      return n;
    };
    acc.onstatechange = bind;
    return bind();
  },
};
