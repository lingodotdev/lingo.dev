import { Hono } from "hono";
import { fetchRandomJoke } from "../services/joke.js";
import { fetchRandomQuote } from "../services/quote.js";
import { fetchGitHubStats } from "../services/github.js";
import { translateContent } from "../services/lingo.js";

import { incrementCounter, getCounter } from "../services/stats.js";

const content = new Hono();
export default content;

const TARGET_LOCALES = ["es", "fr", "de", "hi", "ja", "ru", "zh"];

content.get("/joke", async (c) => {
  await incrementCounter();
  const joke = await fetchRandomJoke();
  if (!joke) return c.json({ error: "Failed to fetch joke" }, 500);
  
  const translated = await translateContent(
    { text: joke.text, author: joke.author },
    TARGET_LOCALES
  );
  return c.json(translated);
});

content.get("/quote", async (c) => {
  await incrementCounter();
  const quote = await fetchRandomQuote();
  if (!quote) return c.json({ error: "Failed to fetch quote" }, 500);

  const translated = await translateContent(
    { text: quote.text, author: quote.author },
    TARGET_LOCALES
  );
  return c.json(translated);
});

content.get("/github", async (c) => {
  return c.json(await fetchGitHubStats());
});

content.get("/stats", async (c) => {
  return c.json({ count: await getCounter() });
});
