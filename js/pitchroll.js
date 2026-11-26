// Gesang: Tonhöhen-Anzeige statt Klaviatur. Zeigt Zielton als Balken und die eigene Stimme als Linie.
import { Input, Synth, Listener, unlockAudio } from './audio.js';
import { midiName } from './score.js';
import { S } from './store.js';

const SPAN = 7;          // Halbtöne über/unter der Mitte
const WIN = 4;           // Sekunden Verlauf

export class PitchRoll {
  constructor(host, opt = {}) {
    this.host = host;
    this.tol = opt.tol || 25;
    this.target = null;
    this.grip = null;
    this.trace = [];
    this.center = opt.center || 52;
    host.classList.add('pr-host');
    host.innerHTML = `
      <div class="pr-wrap"><canvas class="pr-cv"></canvas></div>
      <div class="pr-side">
        <div class="pr-note">–</div>
        <div class="pr-txt">Sing einen Ton</div>
        <button class="btn ghost small pr-tone" data-a="tone">Ton</button>
      </div>`;
    this.cv = host.querySelector('canvas');
    this.ctx = this.cv.getContext('2d');
    this.cv.addEventListener('pointerdown', e => this.tap(e));
    host.querySelector('.pr-tone').addEventListener('click', e => { e.stopPropagation(); this.playTarget(); });
    this.ro = new ResizeObserver(() => this.draw());
    this.ro.observe(host);
    this.draw();
  }
  setTol(t) { this.tol = t; this.draw(); }
  reveal() {}
  hint(midis = [], names = false, ev = null) {
    this.target = midis.length ? midis[0] : (ev ? ev.midis[0] : this.target);
    if (!midis.length && !ev) this.target = null;
    this.names = names;
    const n = this.host.querySelector('.pr-note');
    if (n && this.target != null && !this.live) n.textContent = midiName(this.target) + (Math.floor(this.target / 12) - 1);
    this.draw();
  }
  playTarget() {
    if (this.target == null) return;
    unlockAudio();
    Synth.voice(this.target, 0, 1.0, 0.9);
    Listener.muteUntil = performance.now() / 1000 + 1.3;
  }
  flash(m, cls) {
    this.flashC = { m, cls, t: performance.now() };
    this.draw();
  }
  setPitch(p) {
    const now = performance.now() / 1000;
    this.trace.push(p ? { t: now, m: p.midi } : { t: now, m: null });
    while (this.trace.length && now - this.trace[0].t > WIN) this.trace.shift();
    const note = this.host.querySelector('.pr-note'), tx = this.host.querySelector('.pr-txt');
    this.live = !!p;
    if (p && note) {
      let ref = Math.round(p.midi);
      if (this.target != null && Math.abs(p.midi - this.target) < 0.7) ref = this.target;
      const c = Math.round((p.midi - ref) * 100);
      note.textContent = midiName(ref) + (Math.floor(ref / 12) - 1);
      const ok = Math.abs(c) <= this.tol && (this.target == null || ref === this.target);
      tx.textContent = this.target != null && ref !== this.target ? `Ziel: ${midiName(this.target)}${p.midi < this.target ? ' · höher' : ' · tiefer'}` : ok ? 'sauber' : c > 0 ? `${c} ct zu hoch` : `${-c} ct zu tief`;
      tx.className = 'pr-txt ' + (ok ? 'good' : 'bad');
    }
    this.draw();
  }
  yOf(m, h) { return h / 2 - (m - this.center) * (h / (2 * SPAN + 1)); }
  draw() {
    const cv = this.cv, r = cv.getBoundingClientRect();
    if (!r.width) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(r.width * dpr) || cv.height !== Math.round(r.height * dpr)) { cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); }
    const g = this.ctx, w = r.width, h = r.height;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    // Mitte folgt Ziel oder Stimme
    const last = [...this.trace].reverse().find(x => x.m != null);
    const want = this.target ?? (last ? Math.round(last.m) : this.center);
    if (Math.abs(want - this.center) > 4 || this.target != null) this.center = want;
    const css = getComputedStyle(this.host);
    const ink = css.getPropertyValue('--ink3').trim() || '#999', line = css.getPropertyValue('--line').trim() || '#ddd';
    const rowH = h / (2 * SPAN + 1);
    g.font = '600 11px Manrope, sans-serif';
    for (let m = this.center - SPAN; m <= this.center + SPAN; m++) {
      const y = this.yOf(m, h);
      const nat = ![1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
      g.fillStyle = nat ? 'rgba(127,127,127,.07)' : 'rgba(127,127,127,.0)';
      g.fillRect(36, y - rowH / 2, w - 36, rowH);
      g.strokeStyle = line; g.lineWidth = 0.5;
      g.beginPath(); g.moveTo(36, y + rowH / 2); g.lineTo(w, y + rowH / 2); g.stroke();
      const pc = ((m % 12) + 12) % 12;
      if (nat && (rowH >= 15 || ![5, 11].includes(pc))) { g.fillStyle = ink; g.fillText(midiName(m) + (Math.floor(m / 12) - 1), 4, y + 4); }
    }
    // Zielbalken
    if (this.target != null) {
      const y = this.yOf(this.target, h), bh = Math.max(6, rowH * this.tol / 50);
      g.fillStyle = 'rgba(64,192,87,.28)';
      g.fillRect(36, y - bh / 2, w - 36, bh);
      g.fillStyle = 'rgba(47,158,68,.9)'; g.fillRect(36, y - 1, w - 36, 2);
    }
    // Verlauf
    const now = performance.now() / 1000;
    const X = t => 36 + (w - 46) * (1 - (now - t) / WIN);
    g.lineWidth = 3; g.lineCap = 'round'; g.lineJoin = 'round';
    let prev = null;
    for (const p of this.trace) {
      if (p.m == null) { prev = null; continue; }
      let m = p.m;
      // Oktavsprünge der Anzeige vermeiden: in den sichtbaren Bereich falten
      while (m > this.center + SPAN + 0.5) m -= 12;
      while (m < this.center - SPAN - 0.5) m += 12;
      const ok = this.target != null && Math.abs(m - this.target) * 100 <= this.tol;
      const pt = [X(p.t), this.yOf(m, h)];
      if (prev && Math.abs(prev[1] - pt[1]) < rowH * 3) {
        g.strokeStyle = ok ? '#2f9e44' : this.target == null ? '#4c6ef5' : '#f08c00';
        g.beginPath(); g.moveTo(prev[0], prev[1]); g.lineTo(pt[0], pt[1]); g.stroke();
      }
      prev = pt;
    }
    if (prev) { g.fillStyle = '#4c6ef5'; g.beginPath(); g.arc(prev[0], prev[1], 5, 0, 7); g.fill(); }
    // Treffer-Blitz
    if (this.flashC && performance.now() - this.flashC.t < 450) {
      const y = this.yOf(this.flashC.m, h);
      g.fillStyle = this.flashC.cls === 'ok' ? 'rgba(47,158,68,.35)' : 'rgba(224,49,49,.25)';
      g.fillRect(w - 60, y - rowH / 2, 60, rowH);
    }
  }
  tap(e) {
    const r = this.cv.getBoundingClientRect();
    const y = e.clientY - r.top;
    const m = Math.round(this.center + (r.height / 2 - y) / (r.height / (2 * SPAN + 1)));
    unlockAudio();
    if (S.settings.touchSound) { Synth.voice(m, 0, 0.5, 0.8); Listener.muteUntil = performance.now() / 1000 + 0.8; }
    this.flash(m, 'ok');
    Input.emit(m, 'touch', performance.now() / 1000, { cents: 0 });
  }
  destroy() { this.ro?.disconnect(); }
}
