import { LingoDotDevEngine } from "lingo.dev/sdk";

export const lingoDotDev = new LingoDotDevEngine({
    apiKey: process.env.LINGODOTDEV_API_KEY || "placeholder_key_for_build_verification",
});
