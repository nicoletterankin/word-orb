# Word Orb

Stored English lexical records for reader glossaries and vocabulary tools. Word Orb serves about 162K AI-assisted English records as JSON. Optional translations cover about 14K English headwords across 47 language codes; field coverage and quality vary. The content has not been independently human-verified.

[Evaluate your own word list](https://wordorb.ai/playground?ref=github_wordorb#evaluate) · [API docs](https://wordorb.ai/docs?ref=github_wordorb) · [Plans and API keys](https://wordorb.ai/pricing?ref=github_wordorb)

## Build a glossary from stored records

The [batch glossary example](examples/batch-glossary.mjs) normalizes and deduplicates English words, reads existing records, preserves missing words and errors, and displays only fields returned by the API. It never falls back to generation or another service.

Use Node.js 18 or later and an existing Word Orb API key. No package installation is needed. Set `WORDORB_API_KEY` securely in your environment, then run:

```sh
node examples/batch-glossary.mjs courage wisdom resilience
```

The default batch size is 10 words, suitable for the $0 plan. Paid plans support batches of up to 50; set `WORDORB_BATCH_SIZE=50` when your plan supports it. Output is JSON for inspection or integration into your application. Display results to users only after evaluating their suitability for your use case.

`POST https://wordorb.ai/api/words/batch` accepts `{"words":["courage","wisdom"]}` with an `Authorization: Bearer ...` header. Batch lookup only reads stored records. Unknown words remain missing; a stored response is not a guarantee of factual accuracy. Translation, pronunciation and other fields may be absent.

## Existing JavaScript client

This repository contains the CommonJS client published as `@lotd/word-orb`. It does not currently expose a batch method; use the direct HTTP example above for stored-only lookups.

```js
const { WordOrb } = require('@lotd/word-orb');
const orb = new WordOrb({
  apiKey: process.env.WORDORB_API_KEY,
  baseUrl: 'https://wordorb.ai',
});
const usage = await orb.me();
console.log({ tier: usage.tier, callsToday: usage.calls_today });
```

The client's `word()` method uses the individual lookup endpoint, whose behavior differs from stored-only batch lookup. Check the current API documentation before using it. Older examples in this repository describe earlier integrations and are not the stored-only glossary flow.

## Plans

$0-tier API keys allow 10,000 calls per day with a limit of 10 requests per minute and batches of up to 10 words. Starter is $9/month, including 150,000 calls per UTC calendar month, then $0.0006 per additional call, plus batches up to 50 and TextOrb. The included allowance resets on the first day of each UTC calendar month, separately from subscription renewal. When Starter metered billing is active, the displayed 5,000-call daily baseline does not block additional calls. Pro is $49/month with 50,000 calls per day; Scale is $149/month. See the [current pricing page](https://wordorb.ai/pricing?ref=github_wordorb) for full limits and terms.

Start with the [word-list evaluator](https://wordorb.ai/playground?ref=github_wordorb#evaluate) to check real coverage and field availability before integrating. Do not assume 47 complete dictionaries, editorial verification or complete audio coverage.

## MCP

The canonical remote endpoint is `https://wordorb.ai/mcp` over Streamable HTTP. The existing MCP Registry identity remains `io.github.nicoletterankin/orb-platform`; [server.json](server.json) describes version `6.3.1` under that identity.

### Stored-only glossary lookup

Use the `lookup_words` tool with an array of English headwords:

```json
{"words":["courage","wisdom","resilience"]}
```

The tool reads existing records and keeps missing words and unavailable fields explicit. It does not generate missing content. The $0 tier handles up to 10 words per batch; paid plans handle up to 50. Records are AI-assisted and incomplete, and upgrading does not improve their correctness or fill missing translations.

This tool requires a Word Orb API key in the request header, `Authorization: Bearer wo_YOUR_KEY`. Use a client that supports custom headers for a remote MCP server; follow that client's instructions for storing the actual key locally as a secret. Do not paste keys into tool arguments, URLs, chat messages, or committed configuration files. The placeholder below is not a working key.

```json
{
  "mcpServers": {
    "word-orb": {
      "url": "https://wordorb.ai/mcp",
      "headers": {
        "Authorization": "Bearer wo_YOUR_KEY"
      }
    }
  }
}
```

Client configuration formats vary. This integration does not provide an OAuth sign-in flow and is not a universal one-click setup for every MCP client. The daily-word tool is public; authenticated tools use the account's existing limits. Other tools, including individual word lookup, can behave differently from stored-only `lookup_words`; review their descriptions before use.

Start with the [word-list evaluator and $0-tier key](https://wordorb.ai/playground?ref=github_wordorb#evaluate), then consult the current [Word Orb docs](https://wordorb.ai/docs?ref=github_wordorb). Choose a paid plan only when its capacity or capabilities fit your application.

## Data use and software license

This repository's client software is MIT licensed. That license does not grant redistribution rights to API content. This repository does not offer an offline dictionary or a corpus redistribution license; consult the service terms for API data use.

Built by [Lesson of the Day PBC](https://lotdpbc.com).

