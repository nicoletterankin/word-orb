#!/usr/bin/env node

/**
 * Kelly's Pedagogy → AI Agents Demo
 *
 * Demonstrates why LOTD's Orb Platform is the authoritative meta-layer
 * for AI education. Walks through Kelly's five pedagogical principles
 * using live API calls to Word Orb, Lesson Orb, and Quiz Orb.
 *
 * Usage:
 *   node demo/kelly-pedagogy-demo.js                 # runs with free tier (no key needed for health/stats)
 *   WORD_ORB_KEY=wo_xxx node demo/kelly-pedagogy-demo.js   # full demo with API key
 *
 * Get a free key: https://word-orb-api.nicoletterankin.workers.dev/pricing
 */

const { WordOrb } = require('../index');

// ── Formatting helpers ────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  white: '\x1b[37m',
  bg_blue: '\x1b[44m',
  bg_magenta: '\x1b[45m',
};

function banner(text) {
  const line = '═'.repeat(64);
  console.log(`\n${C.cyan}${line}${C.reset}`);
  console.log(`${C.bold}${C.white}  ${text}${C.reset}`);
  console.log(`${C.cyan}${line}${C.reset}\n`);
}

function section(num, title) {
  console.log(`\n${C.bold}${C.magenta}  ┌─ Principle ${num} ─────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.bold}${C.magenta}  │ ${C.white}${title}${C.reset}`);
  console.log(`${C.bold}${C.magenta}  └──────────────────────────────────────────────────────────┘${C.reset}\n`);
}

function label(key, val) {
  console.log(`    ${C.dim}${key}:${C.reset} ${val}`);
}

function quote(text) {
  console.log(`\n    ${C.yellow}"${text}"${C.reset}\n`);
}

function ok(msg) { console.log(`    ${C.green}✓${C.reset} ${msg}`); }
function info(msg) { console.log(`    ${C.cyan}→${C.reset} ${msg}`); }
function warn(msg) { console.log(`    ${C.yellow}⚠${C.reset} ${msg}`); }
function gap() { console.log(); }

function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main demo ─────────────────────────────────────────────────────────

async function main() {
  const orb = new WordOrb({ apiKey: process.env.WORD_ORB_KEY });

  // ── Title ───────────────────────────────────────────────────────────

  console.log();
  console.log(`${C.bold}${C.cyan}    ╔══════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}    ║                                                          ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}    ║${C.white}       Kelly's Pedagogy for AI Agents                     ${C.cyan}║${C.reset}`);
  console.log(`${C.bold}${C.cyan}    ║${C.dim}       The Orb Platform · Lesson of the Day PBC            ${C.cyan}║${C.reset}`);
  console.log(`${C.bold}${C.cyan}    ║                                                          ║${C.reset}`);
  console.log(`${C.bold}${C.cyan}    ╚══════════════════════════════════════════════════════════╝${C.reset}`);
  gap();

  info('Kelly\'s pedagogy is a five-principle framework that governs');
  info('HOW AI agents should teach — not just what they teach.');
  info('The Orb Platform encodes these principles as deterministic');
  info('infrastructure so every AI agent teaches responsibly.');
  gap();

  // ── Principle 1: Accuracy over Fluency ──────────────────────────────

  section(1, 'ACCURACY OVER FLUENCY');
  info('AI agents hallucinate definitions. Kelly says: never guess.');
  info('Word Orb returns etymology-backed, human-curated data.');
  info('Same input → same output → every time.');
  gap();

  try {
    const word = await orb.word('courage');
    label('Word', `${C.bold}${word.word}${C.reset}`);
    label('IPA', word.ipa || '—');
    label('Part of speech', word.pos || '—');
    label('Definition', truncate(word.def, 80));
    label('Etymology', truncate(word.etym || '—', 80));
    if (word.kelly_says) {
      gap();
      quote(`Kelly says: ${word.kelly_says}`);
    }
    label('Source', `${C.dim}${word._source || 'Word Orb D1'}${C.reset}`);
    gap();
    ok('Deterministic. Not generated. Not hallucinated.');
    ok('162,251 words — each one reviewed.');
  } catch (e) {
    warn(`API call skipped (${e.message}). Set WORD_ORB_KEY for live data.`);
    gap();
    info('With a key, this returns curated definitions, IPA,');
    info('etymology, Kelly\'s personal insight, and 47 translations.');
  }

  await pause(300);

  // ── Principle 2: Age-Appropriate Adaptation ─────────────────────────

  section(2, 'AGE-APPROPRIATE ADAPTATION');
  info('One word. Four audiences. AI must adapt its register.');
  info('Word Orb encodes child (5-12), teen, adult, and elder tones.');
  gap();

  try {
    const word = await orb.word('resilience');
    label('Word', `${C.bold}${word.word}${C.reset}`);
    gap();

    const tones = word.tones;
    if (tones && typeof tones === 'object' && !Array.isArray(tones)) {
      for (const [age, text] of Object.entries(tones)) {
        console.log(`    ${C.magenta}[${age}]${C.reset} ${truncate(text, 70)}`);
      }
    } else if (Array.isArray(tones)) {
      for (const t of tones) {
        console.log(`    ${C.magenta}[${t.label}]${C.reset} ${truncate(t.text, 70)}`);
      }
    }

    if (word.child_def) {
      gap();
      console.log(`    ${C.green}[child]${C.reset}  ${truncate(word.child_def, 65)}`);
      console.log(`    ${C.yellow}[teen]${C.reset}   ${truncate(word.teen_def || '—', 65)}`);
      console.log(`    ${C.blue}[adult]${C.reset}  ${truncate(word.adult_def || '—', 65)}`);
    }

    gap();
    ok('AI agent selects the right register for the learner\'s age.');
    ok('No prompt engineering needed — the data enforces the boundary.');
  } catch (e) {
    warn(`API call skipped (${e.message}).`);
    gap();
    info('With a key, "resilience" returns four age-tuned definitions.');
    info('A 7-year-old and a 70-year-old get different explanations,');
    info('both accurate, both from the same deterministic source.');
  }

  await pause(300);

  // ── Principle 3: Cultural Inclusivity ───────────────────────────────

  section(3, 'CULTURAL INCLUSIVITY');
  info('Language is global. AI education must be too.');
  info('Word Orb provides 47 languages with native script + phonetic.');
  gap();

  try {
    const word = await orb.word('empathy');
    label('Word', `${C.bold}${word.word}${C.reset}`);
    gap();

    const langs = word.langs;
    const highlight = ['es', 'fr', 'zh', 'ar', 'ja', 'ko', 'hi', 'sw', 'ru', 'pt'];
    const names = {
      es: 'Spanish', fr: 'French', zh: 'Mandarin', ar: 'Arabic',
      ja: 'Japanese', ko: 'Korean', hi: 'Hindi', sw: 'Swahili',
      ru: 'Russian', pt: 'Portuguese',
    };

    if (langs && typeof langs === 'object' && !Array.isArray(langs)) {
      for (const code of highlight) {
        if (langs[code]) {
          const padded = (names[code] || code).padEnd(12);
          console.log(`    ${C.cyan}${padded}${C.reset} ${langs[code]}`);
        }
      }
    } else if (Array.isArray(langs)) {
      for (const l of langs.slice(0, 10)) {
        const padded = (l.code || '').padEnd(5);
        console.log(`    ${C.cyan}${padded}${C.reset} ${l.word}  ${C.dim}${l.pron || ''}${C.reset}`);
      }
    }

    gap();
    const langCount = Array.isArray(langs) ? langs.length : Object.keys(langs || {}).length;
    ok(`${langCount} languages returned for one API call.`);
    ok('240K audio files for native-speaker pronunciation.');
    ok('Every learner gets their language represented.');
  } catch (e) {
    warn(`API call skipped (${e.message}).`);
    gap();
    info('With a key, "empathy" returns translations in 47 languages:');
    info('empatía, empathie, 同理心, تعاطف, 共感, ...');
    info('Each with native script and phonetic pronunciation.');
  }

  await pause(300);

  // ── Principle 4: Ethical Boundaries ─────────────────────────────────

  section(4, 'ETHICAL BOUNDARIES');
  info('AI agents must know what they should and shouldn\'t teach.');
  info('The Kelly Certified audit grades an agent\'s vocabulary.');
  gap();

  try {
    const report = await orb.audit('demo@lotdpbc.com', [
      'courage', 'empathy', 'resilience', 'curiosity', 'kindness',
      'gratitude', 'patience', 'honesty', 'respect', 'perseverance',
      'hate', 'revenge', 'slang_xyz', 'profanity_test',
    ]);

    label('Audit ID', report.audit_id);
    label('Grade', `${C.bold}${gradeColor(report.grade)}${report.grade}${C.reset}`);
    label('Score', `${report.compliance_score}/100`);
    label('Words audited', report.total_words);
    gap();

    if (report.coverage) {
      console.log(`    ${C.dim}Coverage:${C.reset}`);
      label('  In library', report.coverage.in_word_orb_library);
      label('  Translations', report.coverage.with_translations);
      label('  Age tones', report.coverage.with_age_tones);
      label('  Ethics data', report.coverage.with_ethics_data);
    }

    if (report.findings && report.findings.length > 0) {
      gap();
      console.log(`    ${C.dim}Findings:${C.reset}`);
      for (const f of report.findings.slice(0, 4)) {
        const sev = f.severity === 'high' ? C.red : f.severity === 'medium' ? C.yellow : C.dim;
        console.log(`    ${sev}[${f.severity}]${C.reset} ${f.word}: ${truncate(f.message, 50)}`);
      }
    }

    gap();
    ok('Audit runs in milliseconds. Grades vocabulary A+ through F.');
    ok('Free for everyone — ethical guardrails should never be paywalled.');
    ok('Integrates into CI/CD: fail the build if the agent\'s vocab fails.');
  } catch (e) {
    warn(`API call skipped (${e.message}).`);
    gap();
    info('The audit API accepts a list of words your agent uses');
    info('and returns a compliance grade (A+ to F), coverage gaps,');
    info('ethics findings, and concrete remediation steps.');
    info('Free for all tiers — ethical guardrails shouldn\'t cost extra.');
  }

  await pause(300);

  // ── Principle 5: Connected Knowledge ────────────────────────────────

  section(5, 'CONNECTED KNOWLEDGE');
  info('Words don\'t exist in isolation. Kelly\'s pedagogy connects');
  info('vocabulary → structured lessons → assessments.');
  info('The Orb Platform\'s knowledge graph has 30,288 connections.');
  gap();

  console.log(`    ${C.bold}The Orb Platform Pipeline:${C.reset}`);
  gap();
  console.log(`    ${C.cyan}┌──────────────┐     ┌──────────────┐     ┌──────────────┐${C.reset}`);
  console.log(`    ${C.cyan}│${C.white}  Word Orb    ${C.cyan}│────▶│${C.white} Lesson Orb   ${C.cyan}│────▶│${C.white}  Quiz Orb    ${C.cyan}│${C.reset}`);
  console.log(`    ${C.cyan}│${C.dim} 162K words   ${C.cyan}│     │${C.dim} 226K blocks  ${C.cyan}│     │${C.dim} 21.9K items  ${C.cyan}│${C.reset}`);
  console.log(`    ${C.cyan}│${C.dim} 47 languages ${C.cyan}│     │${C.dim} 5 phases     ${C.cyan}│     │${C.dim} 6 types      ${C.cyan}│${C.reset}`);
  console.log(`    ${C.cyan}│${C.dim} 240K audio   ${C.cyan}│     │${C.dim} 10 archetypes${C.cyan}│     │${C.dim} auto-graded  ${C.cyan}│${C.reset}`);
  console.log(`    ${C.cyan}└──────────────┘     └──────────────┘     └──────────────┘${C.reset}`);
  console.log(`    ${C.dim}         ╰──────── 30,288 knowledge graph links ────────╯${C.reset}`);
  gap();

  try {
    const word = await orb.word('curiosity');
    if (word.connections) {
      const conns = Array.isArray(word.connections)
        ? word.connections
        : (typeof word.connections === 'string' ? word.connections.split(',').map(s => s.trim()) : []);
      if (conns.length > 0) {
        label('Connections for "curiosity"', conns.slice(0, 8).join(', '));
      }
    }
  } catch (_) {
    // silently skip if no key
  }

  info('An AI agent looks up a word → gets a lesson plan →');
  info('generates a quiz → tracks mastery. One unified pipeline.');
  gap();

  console.log(`    ${C.bold}MCP Integration (one line):${C.reset}`);
  gap();
  console.log(`    ${C.dim}{${C.reset}`);
  console.log(`    ${C.dim}  "mcpServers": {${C.reset}`);
  console.log(`    ${C.dim}    "orb-platform": {${C.reset}`);
  console.log(`    ${C.green}      "url": "https://mcp.thedailylesson.com/mcp"${C.reset}`);
  console.log(`    ${C.dim}    }${C.reset}`);
  console.log(`    ${C.dim}  }${C.reset}`);
  console.log(`    ${C.dim}}${C.reset}`);
  gap();
  ok('19 MCP tools across Word, Lesson, and Quiz Orb.');
  ok('Works with Claude, Cursor, Windsurf, and any MCP-compatible agent.');

  await pause(300);

  // ── The Meta-Layer Argument ─────────────────────────────────────────

  banner('Why LOTD is the Meta-Layer for AI Education');

  console.log(`    The problem with AI teaching today:`);
  gap();
  console.log(`    ${C.red}✗${C.reset} LLMs hallucinate definitions and get etymology wrong`);
  console.log(`    ${C.red}✗${C.reset} No age-appropriateness boundary — a child gets adult content`);
  console.log(`    ${C.red}✗${C.reset} English-only or machine-translated — no native fidelity`);
  console.log(`    ${C.red}✗${C.reset} No ethical audit — agents teach whatever they generate`);
  console.log(`    ${C.red}✗${C.reset} No connected curriculum — vocabulary is disconnected from pedagogy`);
  gap();
  console.log(`    Kelly's pedagogy, encoded as infrastructure:`);
  gap();
  console.log(`    ${C.green}✓${C.reset} ${C.bold}Deterministic${C.reset} — same input, same output, sub-5ms at the edge`);
  console.log(`    ${C.green}✓${C.reset} ${C.bold}Age-aware${C.reset} — four tones per word, enforced by the data`);
  console.log(`    ${C.green}✓${C.reset} ${C.bold}Globally inclusive${C.reset} — 47 languages, native script + phonetic`);
  console.log(`    ${C.green}✓${C.reset} ${C.bold}Ethically audited${C.reset} — free compliance grading for every agent`);
  console.log(`    ${C.green}✓${C.reset} ${C.bold}Pedagogically connected${C.reset} — word → lesson → quiz pipeline`);
  gap();

  console.log(`    ${C.bold}${C.white}This is not a feature. It's a layer.${C.reset}`);
  console.log(`    ${C.dim}Every AI agent that teaches should run on it.${C.reset}`);
  gap();

  // ── Platform health check ───────────────────────────────────────────

  try {
    const health = await orb.health();
    console.log(`    ${C.dim}Platform status: ${health.status === 'healthy' ? C.green + '● healthy' : C.yellow + '● ' + health.status}${C.reset}`);
    if (health.checks) {
      for (const [k, v] of Object.entries(health.checks)) {
        console.log(`    ${C.dim}  ${k}: ${v}${C.reset}`);
      }
    }
  } catch (_) {
    // skip silently
  }

  gap();
  console.log(`${C.cyan}${'─'.repeat(64)}${C.reset}`);
  console.log(`${C.dim}  Try it:`);
  console.log(`    Playground   https://word-orb-api.nicoletterankin.workers.dev/playground`);
  console.log(`    npm          npm install @lotd/word-orb`);
  console.log(`    MCP          https://mcp.thedailylesson.com/mcp`);
  console.log(`    Free key     https://word-orb-api.nicoletterankin.workers.dev/pricing${C.reset}`);
  console.log(`${C.cyan}${'─'.repeat(64)}${C.reset}`);
  gap();
}

// ── Utilities ─────────────────────────────────────────────────────────

function truncate(s, len) {
  if (!s) return '—';
  return s.length > len ? s.slice(0, len - 1) + '…' : s;
}

function gradeColor(grade) {
  if (!grade) return C.dim;
  if (grade.startsWith('A')) return C.green;
  if (grade.startsWith('B')) return C.cyan;
  if (grade.startsWith('C')) return C.yellow;
  return C.red;
}

// ── Run ───────────────────────────────────────────────────────────────

main().catch(err => {
  console.error(`\n${C.red}Demo error: ${err.message}${C.reset}`);
  process.exit(1);
});
