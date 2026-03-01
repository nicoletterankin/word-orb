# Kelly's Pedagogy for AI Agents — Demo

This demo positions LOTD's Orb Platform as the authoritative meta-layer for AI education by walking through Kelly's five pedagogical principles with live API calls.

## The Five Principles

| # | Principle | What it means | How the Orb Platform enforces it |
|---|-----------|---------------|----------------------------------|
| 1 | **Accuracy over Fluency** | Never guess a definition | 162K human-curated words, deterministic delivery |
| 2 | **Age-Appropriate Adaptation** | Match the learner's level | Four age tones per word (child, teen, adult, elder) |
| 3 | **Cultural Inclusivity** | Every language matters | 47 languages, native script + phonetic, 240K audio |
| 4 | **Ethical Boundaries** | Know what not to teach | Kelly Certified audit (free), compliance grading A+ to F |
| 5 | **Connected Knowledge** | Words don't exist alone | 30,288 knowledge graph links: word → lesson → quiz |

## Architecture

```
┌─────────────┐    prompt     ┌──────────────────┐
│   Learner   │──────────────▶│    AI Agent       │
│  (any age)  │◀──────────────│  (Claude, GPT,    │
└─────────────┘    response   │   LangChain, etc) │
                              └────────┬─────────┘
                                       │ tool calls
                                       ▼
                    ┌────────────────────────────────┐
                    │    LOTD Orb Platform            │
                    │    (the meta-layer)             │
                    │                                 │
                    │  ┌──────────┐  ┌────────────┐  │
                    │  │ Word Orb │─▶│ Lesson Orb │  │
                    │  │ 162K wds │  │ 226K blocks│  │
                    │  └──────────┘  └─────┬──────┘  │
                    │                      │         │
                    │                      ▼         │
                    │               ┌────────────┐   │
                    │               │  Quiz Orb  │   │
                    │               │ 21.9K items│   │
                    │               └────────────┘   │
                    │                                 │
                    │  Kelly's Pedagogy = the rules   │
                    │  Orb Platform = the data         │
                    └────────────────────────────────┘
```

**Key insight**: The LLM provides the teaching style and conversation. The Orb Platform provides the facts, structure, and guardrails. Kelly's pedagogy is the contract between them.

## What's in This Directory

| File | Description | Run it |
|------|-------------|--------|
| `kelly-pedagogy-demo.js` | Interactive terminal walkthrough of all 5 principles with live API calls | `node demo/kelly-pedagogy-demo.js` |
| `claude-kelly-tutor.js` | Full Claude-powered tutor using Kelly's system prompt + Word Orb tools | `ANTHROPIC_API_KEY=... WORD_ORB_KEY=... node demo/claude-kelly-tutor.js` |
| `kelly-agent-system-prompt.md` | Copy-paste system prompt for any AI agent | Read and use |

## Running the Demos

### 1. Kelly Pedagogy Walkthrough (no dependencies)

Shows all five principles with live API data:

```bash
# With a Word Orb API key (full experience)
WORD_ORB_KEY=wo_your_key node demo/kelly-pedagogy-demo.js

# Without a key (shows framework with placeholder data)
node demo/kelly-pedagogy-demo.js
```

Get a free key (50 lookups/day): https://word-orb-api.nicoletterankin.workers.dev/pricing

### 2. Claude-Powered Kelly Tutor

A working AI tutor that enforces Kelly's pedagogy via tool use:

```bash
npm install @anthropic-ai/sdk @lotd/word-orb

ANTHROPIC_API_KEY=sk-ant-... \
WORD_ORB_KEY=wo_... \
node demo/claude-kelly-tutor.js
```

Without API keys, it displays the full architecture diagram instead.

### 3. Zero-Code MCP Setup

Add the Orb Platform to any MCP-compatible agent:

```json
{
  "mcpServers": {
    "orb-platform": {
      "url": "https://mcp.thedailylesson.com/mcp"
    }
  }
}
```

This gives the agent access to 19 tools across Word Orb, Lesson Orb, and Quiz Orb. Pair with the system prompt in `kelly-agent-system-prompt.md` for full Kelly compliance.

## The Meta-Layer Argument

**The problem**: Every AI agent that teaches currently generates its own definitions, has no age guardrails, defaults to English, and has no ethical audit trail.

**The solution**: LOTD's Orb Platform sits between the LLM and the learner as a deterministic, auditable, multilingual meta-layer. Kelly's pedagogy defines the contract. The platform enforces it.

| Without LOTD | With LOTD |
|-------------|-----------|
| Hallucinated definitions | 162K curated, deterministic words |
| Same content for all ages | Four age-adapted tones per word |
| English-only or machine-translated | 47 native languages + 240K audio |
| No vocabulary audit | Kelly Certified compliance grading |
| Disconnected facts | Word → Lesson → Quiz knowledge graph |

**This is not a feature. It's a layer. Every AI agent that teaches should run on it.**

## Links

- [Playground](https://word-orb-api.nicoletterankin.workers.dev/playground) — Try all three Orb products
- [Pricing](https://word-orb-api.nicoletterankin.workers.dev/pricing) — Free tier available
- [MCP Server](https://mcp.thedailylesson.com/mcp) — 19 tools for agent frameworks
- [npm](https://www.npmjs.com/package/@lotd/word-orb) — `npm install @lotd/word-orb`
