import { LingoDotDevEngine } from "lingo.dev/sdk";

/**
 * Lingo.dev SDK instance initialized with the API Key.
 * Used for server-side translation and language detection.
 */
export const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY || "placeholder_key_for_build_verification",
});
