// Node.js >=18. No dependencies. Reads stored records only; never generates.
const key = process.env.WORDORB_API_KEY;
const batchSize = Number(process.env.WORDORB_BATCH_SIZE || 10);
if (!key) throw new Error('Set WORDORB_API_KEY to an existing API key.');
if (![10, 50].includes(batchSize)) {
  throw new Error('WORDORB_BATCH_SIZE must be 10 (free) or 50 (paid).');
}

const input = process.argv.slice(2);
if (!input.length) throw new Error('Pass words, e.g. courage wisdom resilience.');
const words = [...new Set(input.map(word => word.trim().toLowerCase()))];
const invalid = words.filter(word => !/^[a-z]+(?:-[a-z]+)*$/.test(word));
if (invalid.length) throw new Error('Use English words or hyphenated words: ' + invalid.join(', '));

const output = { requested: words.length, records: [], not_found: [], errors: [] };
for (let offset = 0; offset < words.length; offset += batchSize) {
  const chunk = words.slice(offset, offset + batchSize);
  const response = await fetch('https://wordorb.ai/api/words/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ words: chunk }),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    // Never log credentials or response bodies that could contain private data.
    throw new Error(`Batch failed with HTTP ${response.status}; check key, plan and quota. No fallback attempted.`);
  }
  const data = await response.json();
  if (!Array.isArray(data.words) || !Number.isInteger(data.not_found) ||
      (data.errors !== undefined && !Array.isArray(data.errors))) {
    throw new Error('Unexpected batch response shape. No fallback attempted.');
  }
  for (const record of data.words) {
    if (!record || typeof record.word !== 'string') {
      throw new Error('Unexpected word record. No fallback attempted.');
    }
    const visible = { word: record.word };
    for (const field of ['def', 'pos', 'ipa', 'etym', 'langs']) {
      const value = record[field];
      if (value !== undefined && value !== null && value !== '' &&
          !(typeof value === 'object' && Object.keys(value).length === 0)) {
        visible[field] = record[field];
      }
    }
    output.records.push(visible);
  }
  // The API's numeric not_found includes all failures, not only absent words.
  // Preserve the per-word distinction; never retry through generation.
  for (const error of data.errors || []) {
    output.errors.push({ word: error.word, error: error.error });
    if (error.error === 'not_found') output.not_found.push(error.word);
  }
}
console.log(JSON.stringify(output, null, 2));
