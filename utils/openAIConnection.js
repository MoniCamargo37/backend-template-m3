const { Configuration, OpenAIApi } = require("openai");

async function consultaOpenAI(text, temperature, options){
  let maxTokens = 1500 - Math.round(text.length / 4);
  const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  try {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: text}],
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6
    });
    return { tokens: completion.data.usage.total_tokens, choices: completion.data.choices[0].message.content};
  } catch (error) {
    return { tokens: 0, choices: 0};
  }
}

module.exports = consultaOpenAI;