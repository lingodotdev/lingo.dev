import express from "express";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import crypto from "crypto";
import { createClient } from "redis";
import { GoogleGenAI, Modality, MediaResolution } from "@google/genai";
import { LingoDotDevEngine } from "lingo.dev/sdk";

dotenv.config();

/* -------------------- Constants -------------------- */

const PORT = process.env.PORT || 3001;

const TRANSLATION_CACHE_TTL_SECONDS = Number.parseInt(
  process.env.TRANSLATION_CACHE_TTL ||
    process.env.DEFAULT_TRANSLATION_TTL ||
    "86400",
  10,
);

const MODEL = "models/gemini-2.5-flash-native-audio-preview-09-2025";

const agentPrompt = `
You are a text-to-speech (TTS) agent.
Your ONLY task is to speak aloud exactly the text provided by the client.
Do not add greetings, explanations, confirmations, or introductions.
Do not rephrase, expand, summarize, or translate the text.
Do not include extra words, punctuation, or commentary.
Output strictly the spoken audio of the client's exact text, nothing more.
`;

/* -------------------- Setup -------------------- */

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

const redis = createClient({ url: process.env.REDIS_URL });
redis.on("error", (e) => console.error("Redis Error:", e));
await redis.connect();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY,
});

/* -------------------- Utils -------------------- */

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

/* -------------------- WebSocket -------------------- */

wss.on("connection", (socket) => {
  console.log("⚡ Client connected");

  let activeSession = null;

  socket.on("message", async (msg) => {
    try {
      const { text, sourceLocale, targetLocale } = JSON.parse(msg.toString());
      if (!text) return;

      /* -------- Translation (cached) -------- */

      const tKey = `translation:${sourceLocale}:${targetLocale}:${hash(text)}`;
      let translatedText = await redis.get(tKey);

      if (!translatedText) {
        console.log("🐢 Translating new text:", text);

        translatedText = await lingo.localizeText(text, {
          sourceLocale,
          targetLocale,
          fast: true,
        });

        await redis.set(tKey, translatedText, {
          EX: TRANSLATION_CACHE_TTL_SECONDS,
        });
      }

      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify({ type: "text", translated: translatedText }),
        );
      }

      /* -------- AI Session (cleanup + recreate) -------- */

      if (activeSession) {
        try {
          await activeSession.close();
        } catch (e) {
          console.warn("⚠️ Error closing previous AI session:", e?.message);
        }
        activeSession = null;
      }

      activeSession = await ai.live.connect({
        model: MODEL,
        callbacks: {
          onmessage(message) {
            if (socket.readyState !== socket.OPEN) return;

            const part = message.serverContent?.modelTurn?.parts?.[0];
            if (!part?.inlineData) return;

            const base64 = part.inlineData.data;
            const mimeType =
              part.inlineData.mimeType || "audio/pcm;rate=24000";
            const sampleRate = parseSampleRateFromMime(mimeType);

            socket.send(
              JSON.stringify({
                type: "audio-chunk",
                data: base64,
                mimeType,
                sampleRate,
                channels: 1,
              }),
            );
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
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Fenrir" },
            },
          },
        },
      });

      activeSession.sendClientContent({
        turns: [translatedText],
      });
    } catch (err) {
      console.error(err);
      if (socket.readyState === socket.OPEN) {
        socket.send(JSON.stringify({ error: err.message }));
      }
    }
  });

  socket.on("close", async () => {
    console.log("❌ Client disconnected.");

    if (activeSession) {
      try {
        await activeSession.close();
      } catch (e) {
        console.warn("⚠️ Error closing AI session on disconnect:", e?.message);
      } finally {
        activeSession = null;
      }
    }
  });
});

/* -------------------- Start Server -------------------- */

server.listen(PORT, () => {
  console.log(`🔌 WS server running on port ${PORT}`);
  console.log(`ws://localhost:${PORT}/ws`);
});
