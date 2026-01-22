import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import crypto from "crypto";
import { createClient } from "redis";
import { GoogleGenAI, Modality, MediaResolution } from "@google/genai";
import { LingoDotDevEngine } from "lingo.dev/sdk";

dotenv.config();

const agentPrompt = `
You are a text-to-speech (TTS) agent.
Your ONLY task is to speak aloud exactly the text provided by the client.
Do not add greetings, explanations, confirmations, or introductions.
Do not rephrase, expand, summarize, or translate the text.
Do not include extra words, punctuation, or commentary.
Output strictly the spoken audio of the client's exact text, nothing more.
`;

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

const wss = new WebSocketServer({ server, path: "/ws" });

const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (e) => console.error("Redis Error:", e));
await redis.connect();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

const hash = (t) => crypto.createHash("sha256").update(t).digest("hex");

function parseSampleRateFromMime(m = "") {
  const parts = m.split(";").map((s) => s.trim());
  for (const p of parts) {
    if (p.startsWith("rate=")) {
      const v = parseInt(p.split("=")[1], 10);
      if (!isNaN(v)) return v;
    }
  }
  return 24000;
}

wss.on("connection", (socket) => {
  console.log("⚡ Client connected");

  socket.on("message", async (msg) => {
    try {
      const { text, sourceLocale, targetLocale } = JSON.parse(msg.toString());
      if (!text) return;

      // Translation
      const tKey = `translation:${sourceLocale}:${targetLocale}:${hash(text)}`;
      let translatedText = await redis.get(tKey);
      if (!translatedText) {
        console.log("🐢 Translating new text:", text);
        translatedText = await lingo.localizeText(text, {
          sourceLocale,
          targetLocale,
          fast: true,
        });
        await redis.set(tKey, translatedText);
      }

      socket.send(JSON.stringify({ type: "text", translated: translatedText }));

      // Stream audio from AI
      const session = await ai.live.connect({
        model: MODEL,
        callbacks: {
          onmessage(message) {
            const part = message.serverContent?.modelTurn?.parts?.[0];
            if (!part) return;

            if (part.inlineData) {
              const base64 = part.inlineData.data;
              const mimeType =
                part.inlineData.mimeType || "audio/pcm;rate=24000";
              const sampleRate = parseSampleRateFromMime(mimeType);

              console.log("📤 Sending audio chunk, size:", base64.length);

              socket.send(
                JSON.stringify({
                  type: "audio-chunk",
                  data: base64,
                  mimeType,
                  sampleRate,
                  channels: 1,
                }),
              );
            }

            if (message.serverContent?.turnComplete) {
              console.log("✅ AI model turn complete");
            }
          },
          onerror(e) {
            console.error("AI error:", e?.message);
          },
          onclose(e) {
            console.log("AI session closed:", e?.reason);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          mediaResolution: MediaResolution.MEDIA_RESOLUTION_LOW,
          systemInstruction: agentPrompt,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Fenrir" } },
          },
        },
      });

      session.sendClientContent({ turns: [translatedText] });
    } catch (err) {
      console.error(err);
      socket.send(JSON.stringify({ error: err.message }));
    }
  });

  socket.on("close", async () => {
    console.log("❌ Client disconnected.");
  });
});

server.listen(PORT, () => {
  console.log(`🔌 WS server running on port ${PORT}`);
  console.log(`ws://localhost:${PORT}/ws`);
});
