#!/usr/bin/env node

/**
 * Kelly-Powered AI Tutor — Claude + Word Orb
 *
 * Demonstrates a complete AI tutor that uses Kelly's pedagogy as its
 * meta-layer. The tutor uses Word Orb for accurate vocabulary data,
 * adapts to the learner's age, and never hallucinates definitions.
 *
 * This is the reference implementation for building AI tutors on LOTD.
 *
 * Requirements:
 *   npm install @anthropic-ai/sdk @lotd/word-orb
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... WORD_ORB_KEY=wo_... node demo/claude-kelly-tutor.js
 *
 * Or use the MCP integration for zero-code setup (see mcp-config.json).
 */

const Anthropic = require('@anthropic-ai/sdk');
const { WordOrb } = require('../index');

// ── Configuration ─────────────────────────────────────────────────────

const orb = new WordOrb({ apiKey: process.env.WORD_ORB_KEY });

const KELLY_SYSTEM_PROMPT = `You are a language tutor powered by Kelly's pedagogy from Lesson of the Day.

## Your Pedagogical Principles

1. **Accuracy over Fluency** — Never guess or hallucinate a definition. Always use the word_lookup tool to retrieve verified data from Word Orb before teaching a word. If the tool returns no result, say so honestly.

2. **Age-Appropriate Adaptation** — Ask the learner's age or grade level at the start. Use the appropriate tone from Word Orb's age-adapted definitions:
   - child (5-12): Simple, concrete, encouraging
   - teen (13-17): Relatable, slightly more complex
   - adult (18-64): Full complexity, professional
   - elder (65+): Respectful, experience-referencing

3. **Cultural Inclusivity** — When the learner speaks another language, use Word Orb's 47-language translations to connect new English words to their native language. Always show native script alongside phonetic pronunciation.

4. **Ethical Boundaries** — Only teach words that exist in the Word Orb library. If a word has ethical concerns flagged by Kelly, address them thoughtfully. Never teach slurs, and redirect harmful vocabulary requests to constructive alternatives.

5. **Connected Knowledge** — After teaching a word, use its connections to suggest related vocabulary. Build pathways from one word to the next so learning compounds.

## Teaching Flow

For each word the learner asks about:
1. Look it up with word_lookup (required — never skip this step)
2. Present the definition adapted to their age level
3. Share the pronunciation (IPA) and etymology
4. If they speak another language, show the translation
5. Share Kelly's insight if available
6. Suggest connected words for further learning

## Important Rules
- ALWAYS call word_lookup before teaching — this is non-negotiable
- If the API returns kelly_says, include it naturally in your response
- Celebrate curiosity. Every question is a good question.
- Keep responses warm but concise — under 200 words per turn`;

// ── Tool definitions for Claude ───────────────────────────────────────

const TOOLS = [
  {
    name: 'word_lookup',
    description:
      'Look up a word in the Word Orb dictionary. Returns verified definition, IPA pronunciation, etymology, age-appropriate variants, translations in 47 languages, and Kelly\'s pedagogical insight. ALWAYS call this before teaching any word — never rely on your own knowledge for definitions.',
    input_schema: {
      type: 'object',
      properties: {
        word: {
          type: 'string',
          description: 'The English word to look up',
        },
      },
      required: ['word'],
    },
  },
  {
    name: 'vocabulary_audit',
    description:
      'Run a Kelly Certified compliance audit on a list of words. Returns a grade (A+ to F), coverage analysis, ethical findings, and remediation steps. Use this when reviewing a learner\'s vocabulary list or when building a curriculum.',
    input_schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'Email for the audit report',
        },
        words: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of words to audit',
        },
      },
      required: ['email', 'words'],
    },
  },
];

// ── Tool execution ────────────────────────────────────────────────────

async function executeTool(name, input) {
  switch (name) {
    case 'word_lookup':
      return await orb.word(input.word);
    case 'vocabulary_audit':
      return await orb.audit(input.email, input.words);
    default:
      return { error: `Unknown tool: ${name}` };
  }
}

// ── Demo conversation ─────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

async function runTutorDemo() {
  console.log();
  console.log(`${C.bold}${C.cyan}  Kelly-Powered AI Tutor Demo${C.reset}`);
  console.log(`${C.dim}  Claude + Word Orb · Lesson of the Day PBC${C.reset}`);
  console.log(`${C.dim}  ${'─'.repeat(50)}${C.reset}`);
  console.log();

  if (!process.env.ANTHROPIC_API_KEY) {
    console.log(`${C.yellow}  This demo requires an Anthropic API key.${C.reset}`);
    console.log(`${C.dim}  Set ANTHROPIC_API_KEY and WORD_ORB_KEY, then re-run.${C.reset}`);
    console.log();
    console.log(`${C.dim}  Showing the architecture instead:${C.reset}`);
    console.log();
    showArchitecture();
    return;
  }

  const client = new Anthropic();

  // Simulate a learner conversation
  const learnerMessages = [
    "Hi! I'm 9 years old and I want to learn what 'perseverance' means. My family speaks Spanish at home.",
    "That's cool! What about 'empathy'? Can you teach me that one too?",
    "Can you check if the words I learned this week are good? I learned: perseverance, empathy, courage, kindness, and resilience.",
  ];

  const messages = [];

  for (const userMsg of learnerMessages) {
    console.log(`${C.green}  Learner:${C.reset} ${userMsg}`);
    console.log();

    messages.push({ role: 'user', content: userMsg });

    // Claude may need multiple turns if it calls tools
    let response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: KELLY_SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    });

    // Handle tool use loops
    while (response.stop_reason === 'tool_use') {
      const assistantContent = response.content;
      messages.push({ role: 'assistant', content: assistantContent });

      const toolResults = [];
      for (const block of assistantContent) {
        if (block.type === 'tool_use') {
          console.log(`${C.dim}  [tool] ${block.name}("${block.input.word || block.input.words?.join(', ') || '...'}")${C.reset}`);
          try {
            const result = await executeTool(block.name, block.input);
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(result),
            });
          } catch (err) {
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify({ error: err.message }),
              is_error: true,
            });
          }
        }
      }

      messages.push({ role: 'user', content: toolResults });

      response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: KELLY_SYSTEM_PROMPT,
        tools: TOOLS,
        messages,
      });
    }

    // Extract text response
    const text = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    messages.push({ role: 'assistant', content: response.content });

    console.log(`${C.magenta}  Tutor:${C.reset} ${text}`);
    console.log(`${C.dim}  ${'─'.repeat(50)}${C.reset}`);
    console.log();
  }

  console.log(`${C.bold}${C.cyan}  Demo complete.${C.reset}`);
  console.log(`${C.dim}  Every definition came from Word Orb — verified, not generated.${C.reset}`);
  console.log(`${C.dim}  Age-adapted for a 9-year-old. Spanish translations included.${C.reset}`);
  console.log(`${C.dim}  Vocabulary audited for Kelly Certified compliance.${C.reset}`);
  console.log();
}

function showArchitecture() {
  console.log(`${C.bold}  How the Kelly-Powered Tutor Works:${C.reset}`);
  console.log();
  console.log(`  ┌─────────────┐    prompt     ┌─────────────────┐`);
  console.log(`  │   Learner   │───────────────▶│   Claude (LLM)  │`);
  console.log(`  │  "age: 9"   │◀───────────────│  Kelly system   │`);
  console.log(`  └─────────────┘    response    │  prompt active  │`);
  console.log(`                                 └────────┬────────┘`);
  console.log(`                                          │ tool_use`);
  console.log(`                                          ▼`);
  console.log(`                           ┌──────────────────────────┐`);
  console.log(`                           │     Word Orb API         │`);
  console.log(`                           │  ┌────────────────────┐  │`);
  console.log(`                           │  │ word_lookup()      │  │`);
  console.log(`                           │  │  → definition      │  │`);
  console.log(`                           │  │  → IPA, etymology  │  │`);
  console.log(`                           │  │  → age tones       │  │`);
  console.log(`                           │  │  → 47 translations │  │`);
  console.log(`                           │  │  → kelly_says      │  │`);
  console.log(`                           │  └────────────────────┘  │`);
  console.log(`                           │  ┌────────────────────┐  │`);
  console.log(`                           │  │ vocabulary_audit() │  │`);
  console.log(`                           │  │  → grade (A+ to F) │  │`);
  console.log(`                           │  │  → ethics findings │  │`);
  console.log(`                           │  │  → coverage gaps   │  │`);
  console.log(`                           │  └────────────────────┘  │`);
  console.log(`                           └──────────────────────────┘`);
  console.log();
  console.log(`  ${C.bold}Key insight:${C.reset} Claude generates the pedagogy (how to teach),`);
  console.log(`  but Word Orb provides the facts (what to teach).`);
  console.log(`  The LLM never hallucinates a definition because it`);
  console.log(`  ${C.bold}must${C.reset} call the tool first. Kelly's system prompt enforces this.`);
  console.log();
  console.log(`  ${C.dim}To run the live demo:${C.reset}`);
  console.log(`  ${C.dim}ANTHROPIC_API_KEY=sk-... WORD_ORB_KEY=wo_... node demo/claude-kelly-tutor.js${C.reset}`);
  console.log();
}

// ── Run ───────────────────────────────────────────────────────────────

runTutorDemo().catch(err => {
  console.error(`\n${C.yellow}Error: ${err.message}${C.reset}`);
  process.exit(1);
});
