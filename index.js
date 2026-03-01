/**
 * Word Orb SDK — Trusted language infrastructure for AI agents.
 * Lesson of the Day PBC
 * https://word-orb-api.nicoletterankin.workers.dev/pricing
 */

const DEFAULT_BASE = 'https://word-orb-api.nicoletterankin.workers.dev';

class WordOrb {
  constructor({ apiKey, baseUrl = DEFAULT_BASE } = {}) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async _fetch(path, { method = 'GET', body } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['Authorization'] = 'Bearer ' + this.apiKey;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.baseUrl + path, opts);
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.error || `Word Orb API error: ${res.status}`), { status: res.status, code: data.code });
    return data;
  }

  /** Look up any word — definition, pronunciation, etymology, translations, age tones. */
  word(w) { return this._fetch('/api/word/' + encodeURIComponent(w)); }

  /** Get full word library listing. */
  words() { return this._fetch('/api/words'); }

  /** Submit vocabulary feedback (vote: 1 or -1). */
  feedback(word, vote, correction) {
    return this._fetch('/api/feedback', { method: 'POST', body: { word, vote, correction } });
  }

  /** Run a Kelly Certified compliance audit on a word list. */
  audit(email, words) {
    return this._fetch('/api/audit', { method: 'POST', body: { email, words } });
  }

  /** Sign up for a free API key. */
  signup(email) {
    return this._fetch('/api/signup', { method: 'POST', body: { email } });
  }

  /** Check your API key usage and tier. */
  me() { return this._fetch('/api/keys/me'); }

  /** Get service health status. */
  health() { return this._fetch('/api/health'); }

  /** Get database and usage statistics. */
  stats() { return this._fetch('/api/stats'); }
}

module.exports = { WordOrb };
