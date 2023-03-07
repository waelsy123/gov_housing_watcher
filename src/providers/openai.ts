import OpenAI from "chatgpt-official";
import { Configuration, OpenAIApi } from "openai";
import { config } from "../lib/config";
import { randomUUID } from "crypto";

// let options = {
//   temperature: 0.7, // OpenAI parameter
//   max_tokens: config.maxModelTokens, // OpenAI parameter [Max response size by tokens]
//   top_p: 0.9, // OpenAI parameter
//   frequency_penalty: 0, // OpenAI parameter
//   presence_penalty: 0, // OpenAI parameter
//   // instructions: ``,
//   model: "gpt-3.5-turbo", // OpenAI parameter  `gpt-3.5-turbo` is PAID
// };

// OpenAI Client (DALL-E)
export const openai = new OpenAIApi(
  new Configuration({
    apiKey: config.openAIAPIKey
  })
);

export const askGPT = async (prompt: string) => {
  let bot = new OpenAI(config.openAIAPIKey);

  let response = await bot.ask(prompt);
  console.log(response);

  return response;
}

export const askDallE = async (prompt: any) => {
  try {

    // Send the prompt to the API
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
      // response_format: "b64_json"
    });


    const obj = response.data.data[0] // .b64_json as string;

    return obj
  } catch (error: any) {
    console.log("🚀 ~ file: openai.ts:52 ~ askDallE ~ error:", error.data.error)
    return { 'err': 1 }
  }
};
