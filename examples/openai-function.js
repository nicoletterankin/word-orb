/**
 * Word Orb with OpenAI Function Calling
 *
 * npm install @lotd/word-orb openai
 */

const OpenAI = require("openai");
const { WordOrb } = require("@lotd/word-orb");

const openai = new OpenAI();
const orb = new WordOrb({ apiKey: process.env.WORD_ORB_KEY });

// Define the function for OpenAI
const tools = [
  {
    type: "function",
    function: {
      name: "lookup_word",
      description: "Look up a word to get its definition, pronunciation (IPA), etymology, and translations in 47 languages.",
      parameters: {
        type: "object",
        properties: {
          word: {
            type: "string",
            description: "The English word to look up",
          },
        },
        required: ["word"],
      },
    },
  },
];

async function chat(userMessage) {
  const messages = [
    { role: "system", content: "You are a helpful language tutor. Use the lookup_word tool to provide accurate word information." },
    { role: "user", content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
  });

  const msg = response.choices[0].message;

  // Handle tool calls
  if (msg.tool_calls) {
    for (const call of msg.tool_calls) {
      if (call.function.name === "lookup_word") {
        const { word } = JSON.parse(call.function.arguments);
        const result = await orb.word(word);
        messages.push(msg);
        messages.push({
          role: "tool",
          tool_call_id: call.id,
          content: JSON.stringify(result),
        });
      }
    }

    // Get final response with tool results
    const final = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    return final.choices[0].message.content;
  }

  return msg.content;
}

// Example usage:
// chat("What does 'ephemeral' mean and how do you say it in Japanese?")
//   .then(console.log);

module.exports = { chat };
