import { LingoDotDevEngine } from "lingo.dev/sdk";

if (!process.env.LINGO_API_KEY) {
    throw new Error("Missing LINGO_API_KEY environment variable");
}

export const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.LINGO_API_KEY,
});