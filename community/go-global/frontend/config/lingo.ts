import { LingoDotDevEngine } from "lingo.dev/sdk";

export const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});