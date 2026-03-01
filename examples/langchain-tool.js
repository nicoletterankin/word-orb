/**
 * Word Orb as a LangChain Tool
 *
 * npm install @lotd/word-orb langchain @langchain/core
 */

const { DynamicTool } = require("@langchain/core/tools");
const { WordOrb } = require("@lotd/word-orb");

const orb = new WordOrb({ apiKey: process.env.WORD_ORB_KEY });

const wordOrbTool = new DynamicTool({
  name: "word_lookup",
  description: "Look up a word to get its definition, pronunciation, etymology, and translations in 47 languages. Input should be a single English word.",
  func: async (word) => {
    const result = await orb.word(word.trim());
    return JSON.stringify({
      word: result.word,
      definition: result.def,
      pronunciation: result.ipa,
      etymology: result.etym,
      translations: {
        spanish: result.langs?.es,
        french: result.langs?.fr,
        mandarin: result.langs?.zh,
        arabic: result.langs?.ar,
        japanese: result.langs?.ja,
      },
    });
  },
});

// Use in a chain or agent:
// const result = await wordOrbTool.invoke("serendipity");
// console.log(result);

module.exports = { wordOrbTool };
