import { LingoDotDevEngine } from "lingo.dev/sdk";

export const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY,
});
