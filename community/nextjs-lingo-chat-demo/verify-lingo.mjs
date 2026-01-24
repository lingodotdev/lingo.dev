import { LingoDotDevEngine } from "lingo.dev/sdk";
import fs from "fs";
import path from "path";

// Manually load .env.local
try {
    const envPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, "utf8");
        envConfig.split(/\r?\n/).forEach((line) => {
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith("#")) return;

            const equalsIndex = trimmedLine.indexOf("=");
            if (equalsIndex !== -1) {
                const key = trimmedLine.substring(0, equalsIndex).trim();
                let value = trimmedLine.substring(equalsIndex + 1).trim();

                // Remove surrounding quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }

                if (key) {
                    process.env[key] = value;
                }
            }
        });
        console.log("Loaded .env.local");
    } else {
        console.log("No .env.local found");
    }
} catch (e) {
    console.error("Error loading .env.local", e);
}

const apiKey = process.env.LINGODOTDEV_API_KEY;

if (!apiKey) {
    console.error("❌ Error: LINGODOTDEV_API_KEY not found in environment.");
    process.exit(1);
}

const lingoDotDev = new LingoDotDevEngine({
    apiKey: apiKey,
});

console.log("Testing API with provided key...");

try {
    const result = await lingoDotDev.localizeText("Hello, world!", {
        sourceLocale: "en",
        targetLocale: "es",
    });
    console.log("✅ Success! Output:", result);
} catch (e) {
    console.error("❌ API Error:", e.message);
}
