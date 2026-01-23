const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Generate an English response to the user's prompt/content.
async function generateEnglish(content) {
  const maxRetries = 2;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a helpful assistant. Reply in English only in 100 characters.\n\nUser message:\n${content}`,
              },
            ],
          },
        ],
      });

      const maybeFn = response && response.text;
      if (typeof maybeFn === "function") return await response.text();
      return maybeFn || "";
    } catch (err) {
      if ((err?.status === 429 || err?.code === 429) && attempt < maxRetries) {
        const delayMs = 1600 * (attempt + 1);
        await new Promise((r) => setTimeout(r, delayMs));
        continue;
      }
      throw err;
    }
  }
}

module.exports = { generateEnglish };
