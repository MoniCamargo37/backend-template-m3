const { Configuration, OpenAIApi } = require("openai");


async function consultaOpenAI(text, temperature, options){

    //console.log('El texto a interpretar: ', text);
    let maxTokens = 3500 - Math.round(text.length / 4);
    //console.log('Tokens máximos respuesta: ', maxTokens);
    const configuration = new Configuration({
      organization: process.env.OPENAI_ORGANIZATION,
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    try {
      const openai = new OpenAIApi(configuration);
      const completion = await openai.createCompletion({
        "model": "text-davinci-003",
        "prompt": text,
        "temperature": temperature,
        "max_tokens": maxTokens,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0.6
      });
      return { tokens: completion.data.usage.total_tokens, choices: completion.data.choices};
    } catch (error) {
        console.log("Hay un error");
      return { tokens: 0, choices: 0};      
    }
/*
      const completion = await openai.createCompletion({
        model: model,
        prompt: text,
        max_tokens: 1000,
        temperature: temperature,
        n: options,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      });
*/
}

module.exports = consultaOpenAI;