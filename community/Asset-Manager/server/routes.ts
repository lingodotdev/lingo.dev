import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { LingoDotDevEngine } from "lingo.dev/sdk";

const API_KEY = process.env.VITE_LINGODOTDEV_API_KEY;
const lingo = API_KEY ? new LingoDotDevEngine({ apiKey: API_KEY }) : null;

if (lingo) {
  console.log("Lingo translation service initialized on server.");
} else {
  console.warn("Lingo translation service NOT initialized - check API KEY.");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.memes.create.path, async (req, res) => {
    try {
      const input = api.memes.create.input.parse(req.body);
      const meme = await storage.createMeme(input);
      res.status(201).json(meme);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.memes.list.path, async (req, res) => {
    const memes = await storage.getMemes();
    res.json(memes);
  });

  app.post("/api/translate", async (req, res) => {
    if (!lingo) {
      return res.status(503).json({ message: "Translation service not configured" });
    }

    try {
      const { text, targetLocale, context } = req.body;
      const options: any = {
        sourceLocale: "en",
        targetLocale
      };
      if (context) options.context = context;

      const result = await lingo.localizeText(text, options);
      res.json({ translatedText: result });
    } catch (err) {
      console.error("Translation error:", err);
      res.status(500).json({ message: "Translation failed" });
    }
  });

  return httpServer;
}
