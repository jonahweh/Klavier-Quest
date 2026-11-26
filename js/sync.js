// Cloud-Sync über ein privates GitHub-Gist: kein eigener Server nötig, nur ein Token mit „gist“-Recht.
import { S, onChange, mergeData } from './store.js';

const TK = 'kq-gh-token', GK = 'kq-gist-id', FILE = 'klavier-quest.json', DESC = 'Klavier-Quest Sync';

export const Cloud = {
  status: '', last: null, busy: false, merging: false, subs: new Set(),
  token() { try { return localStorage.getItem(TK) || ''; } catch (e) { return ''; } },
  setToken(t) { try { t ? localStorage.setItem(TK, t.trim()) : (localStorage.removeItem(TK), localStorage.removeItem(GK)); } catch (e) { /* egal */ } },
  on(f) { this.subs.add(f); return () => this.subs.delete(f); },
  emit() { this.subs.forEach(f => f(this)); },
  async api(path, opt = {}) {
    const r = await fetch('https://api.github.com' + path, {
      ...opt,
      headers: { Authorization: 'Bearer ' + this.token(), Accept: 'application/vnd.github+json', ...(opt.body ? { 'Content-Type': 'application/json' } : {}) },
    });
    if (r.status === 401) throw new Error('Token ungültig oder abgelaufen.');
    if (r.status === 403 || r.status === 404) throw new Error('Kein Zugriff – hat der Token das Recht „gist“?');
    if (!r.ok) throw new Error('GitHub antwortet mit Fehler ' + r.status);
    return r.json();
  },
  async findGist() {
    let id = null;
    try { id = localStorage.getItem(GK); } catch (e) { /* egal */ }
    if (id) return id;
    for (let page = 1; page <= 3; page++) {
      const list = await this.api(`/gists?per_page=100&page=${page}`);
      const g = list.find(x => x.description === DESC && x.files && x.files[FILE]);
      if (g) { try { localStorage.setItem(GK, g.id); } catch (e) { /* egal */ } return g.id; }
      if (list.length < 100) break;
    }
    return null;
  },
  async sync() {
    if (!this.token() || this.busy || !navigator.onLine) return;
    this.busy = true; this.status = 'Synchronisiere …'; this.emit();
    try {
      let id = await this.findGist();
      if (id) {
        let g;
        try { g = await this.api('/gists/' + id); }
        catch (e) { try { localStorage.removeItem(GK); } catch (x) { /* egal */ } id = await this.findGist(); g = id ? await this.api('/gists/' + id) : null; }
        if (g) {
          const f = g.files[FILE];
          let content = f && f.content;
          if (f && f.truncated) content = await (await fetch(f.raw_url)).text();
          if (content) { this.merging = true; try { mergeData(JSON.parse(content), true); } finally { this.merging = false; } }
          await this.api('/gists/' + id, { method: 'PATCH', body: JSON.stringify({ files: { [FILE]: { content: JSON.stringify(S) } } }) });
        }
      }
      if (!id) {
        const g = await this.api('/gists', { method: 'POST', body: JSON.stringify({ description: DESC, public: false, files: { [FILE]: { content: JSON.stringify(S) } } }) });
        try { localStorage.setItem(GK, g.id); } catch (e) { /* egal */ }
      }
      this.last = new Date();
      this.status = 'Synchronisiert um ' + this.last.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      this.status = 'Sync fehlgeschlagen: ' + e.message;
    } finally { this.busy = false; this.emit(); }
  },
  init(onPulled) {
    if (!this.token()) return;
    this.sync().then(() => onPulled && onPulled());
    let t = null;
    onChange(() => { if (this.merging) return; clearTimeout(t); t = setTimeout(() => this.sync(), 15000); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(t); this.sync(); } });
  },
};
