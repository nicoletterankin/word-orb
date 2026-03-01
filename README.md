# @lotd/word-orb

Language infrastructure for AI agents. 162,251 words. 47 languages. 240K audio files. Deterministic responses at the edge.

Part of the [Orb Platform](https://word-orb-api.nicoletterankin.workers.dev/pricing) — dictionary, lessons, and assessments for AI that teaches.

[![npm](https://img.shields.io/npm/v/@lotd/word-orb)](https://www.npmjs.com/package/@lotd/word-orb)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## What is Word Orb?

A dictionary API built for AI agents, educational platforms, and robotics. One API call returns:

- **Definitions** — accurate, etymology-backed, not hallucinated
- **47-language translations** — native script + phonetic pronunciation
- **Age-appropriate content** — kid (5-12), teen, adult, and elder (65+) variants
- **IPA pronunciation** — standard phonetic notation for every word
- **240K audio files** — native-speaker pronunciations via R2

Runs on Cloudflare Workers + D1. Sub-5ms edge delivery. Same input, same output, every time.

## Install

```bash
npm install @lotd/word-orb
```

## Quick Start

```js
const { WordOrb } = require('@lotd/word-orb');

const orb = new WordOrb({ apiKey: 'wo_your_api_key' });

// Look up any word
const result = await orb.word('serendipity');
console.log(result.def);    // Full definition
console.log(result.ipa);    // /ˌsɛɹ.ən.ˈdɪp.ɪ.ti/
console.log(result.etym);   // Etymology
console.log(result.langs);  // 47-language translations
```

### Get a free API key

```js
const { key } = await orb.signup('you@example.com');
// Returns: wo_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// 50 free lookups per day, upgrade anytime
```

### MCP Integration (one line)

Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "word-orb": {
      "url": "https://mcp.thedailylesson.com/mcp"
    }
  }
}
```

19 MCP tools across all three Orb Platform products. Works with Claude, Cursor, Windsurf, and any MCP-compatible agent.

## The Orb Platform

Word Orb is one of three products:

| Product | What it does | Scale |
|---------|-------------|-------|
| **Word Orb** | Dictionary + translations + pronunciation | 162,251 words, 47 languages |
| **Lesson Orb** | Structured lesson plans | 226,725 lesson blocks, 5 phases, 10 archetypes |
| **Quiz Orb** | Assessment questions | 21,900 interactions, 6 question types |

All three share a knowledge graph with 30,288 connections linking words → lessons → quizzes.

**Education Stack** bundles all three for $179/mo (21% discount).

[Try the playground →](https://word-orb-api.nicoletterankin.workers.dev/playground)

## API Reference

### `new WordOrb(options?)`

Create a client instance.

| Option    | Type     | Default | Description |
|-----------|----------|---------|-------------|
| `apiKey`  | `string` | —       | Your `wo_` API key ([get one free](https://word-orb-api.nicoletterankin.workers.dev/pricing)) |
| `baseUrl` | `string` | `https://word-orb-api.nicoletterankin.workers.dev` | API base URL |

---

### `orb.word(word)` → `Promise<WordResult>`

Look up any word. Returns definition, pronunciation (IPA), part of speech, etymology, translations across 47 languages, and age-appropriate content.

```js
const data = await orb.word('courage');
// {
//   word: 'courage',
//   ipa: '/ˈkɜːrɪdʒ/',
//   pos: 'noun',
//   def: 'Courage is the ability to face fear, danger, or difficulty...',
//   etym: 'From Old French "corage," meaning "heart, spirit"...',
//   langs: { es: 'coraje', fr: 'courage', de: 'Mut', zh: '勇气', ... },
//   tones: { child: '...', teen: '...', adult: '...' }
// }
```

---

### `orb.words()` → `Promise<WordListResult>`

Get the full word library listing.

```js
const { count, words } = await orb.words();
console.log(`${count} words available`);
```

---

### `orb.audit(email, words)` → `Promise<AuditResult>`

Run a compliance audit on your agent's vocabulary. Returns coverage analysis, age-appropriateness gaps, and a compliance grade.

```js
const report = await orb.audit('cto@company.com', [
  'understand', 'help', 'teach', 'learn', 'discover'
]);
console.log(report.grade);            // 'A-'
console.log(report.compliance_score); // 91
```

---

### `orb.feedback(word, vote, correction?)` → `Promise<{ ok: boolean }>`

Submit vocabulary feedback.

```js
await orb.feedback('serendipity', 1);                    // upvote
await orb.feedback('irregardless', -1, 'Not a word!');   // downvote + correction
```

---

### `orb.signup(email)` → `Promise<SignupResult>`

Create a free API key instantly. 50 lookups per day.

```js
const { key, tier, daily_limit } = await orb.signup('dev@company.com');
```

---

### `orb.me()` → `Promise<KeyStatus>`

Check your API key usage, tier, and remaining calls.

```js
const status = await orb.me();
console.log(status.tier);            // 'starter'
console.log(status.remaining_today); // 4873
```

---

### `orb.health()` → `Promise<HealthResult>`

Check service health.

```js
const health = await orb.health();
// { status: 'healthy', checks: { kv: 'ok', d1: 'ok (162250 words)', ... } }
```

---

### `orb.stats()` → `Promise<StatsResult>`

Get database and usage statistics.

## Pricing

| Tier | Price | API Calls/Day | Best For |
|------|-------|---------------|----------|
| **Free** | $0 | 50 | Prototyping, evaluation |
| **Starter** | $49/mo | 5,000 | Side projects, small apps |
| **Growth** | $149/mo | 50,000 | Production agents, teams |
| **Enterprise** | $499/mo | Unlimited | Scale, SLA, priority support |

[Get your API key →](https://word-orb-api.nicoletterankin.workers.dev/pricing)

## Error Handling

```js
try {
  const result = await orb.word('nonexistent');
} catch (err) {
  if (err.status === 401) console.error('Invalid API key');
  else if (err.status === 429) console.error('Rate limit reached');
  else if (err.status === 404) console.error('Word not found');
  else console.error('API error:', err.message);
}
```

## TypeScript

Full TypeScript definitions included:

```ts
import { WordOrb, WordResult } from '@lotd/word-orb';

const orb = new WordOrb({ apiKey: process.env.WORD_ORB_KEY });
const result: WordResult = await orb.word('ephemeral');
```

## Kelly's Pedagogy Demo

See the [`demo/`](./demo/) directory for a complete demonstration of Kelly's pedagogical framework for AI agents:

- **`kelly-pedagogy-demo.js`** — Interactive walkthrough of all 5 principles with live API calls
- **`claude-kelly-tutor.js`** — Full Claude-powered AI tutor using Kelly's system prompt + Word Orb tools
- **`kelly-agent-system-prompt.md`** — Copy-paste system prompt for any AI agent

```bash
# Run the interactive demo
WORD_ORB_KEY=wo_your_key node demo/kelly-pedagogy-demo.js

# Run the Claude-powered tutor
ANTHROPIC_API_KEY=sk-... WORD_ORB_KEY=wo_... node demo/claude-kelly-tutor.js
```

Kelly's five principles — Accuracy, Age-Adaptation, Inclusivity, Ethics, Connected Knowledge — are what make the Orb Platform the authoritative meta-layer for AI education. [Read more →](./demo/README.md)

## Examples

See the [`examples/`](./examples/) directory:

- **`langchain-tool.js`** — Use Word Orb as a LangChain tool
- **`crewai-agent.py`** — CrewAI agent with Word Orb vocabulary
- **`openai-function.js`** — OpenAI function calling integration
- **`mcp-config.json`** — Claude Desktop MCP configuration

## Links

- [Playground](https://word-orb-api.nicoletterankin.workers.dev/playground) — Try all three products live
- [Pricing & Signup](https://word-orb-api.nicoletterankin.workers.dev/pricing)
- [API Docs](https://word-orb-api.nicoletterankin.workers.dev/docs)
- [MCP Server](https://mcp.thedailylesson.com/mcp) — 19 tools for agent frameworks
- [npm](https://www.npmjs.com/package/@lotd/word-orb)

## About

Built by [Lesson of the Day PBC](https://lotdpbc.com). Language infrastructure for AI agents that need to get words right.

## License

MIT
