import { Hono } from "hono";
import { fetchRandomJoke } from "../services/joke.js";
import { fetchRandomQuote } from "../services/quote.js";
import { fetchGitHubStats } from "../services/github.js";
import { translateContent } from "../services/lingo.js";
import { incrementCounter, getCounter } from "../services/stats.js";
import { hashContent, getCachedContent, setCachedContent, incrementCacheHits, getRandomCachedContent } from "../services/cache.js";
import { checkRateLimit, incrementRequestCount } from "../middleware/rate-limiter.js";

const content = new Hono();
export default content;

const TARGET_LOCALES = ["es", "fr", "de", "hi", "ja", "ru", "zh"];

content.get("/joke", async (c) => {
  await incrementCounter();
  
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const underLimit = checkRateLimit(ip, 'joke');
  
  // Fetch fresh joke
  const joke = await fetchRandomJoke();
  if (!joke) return c.json({ error: "Failed to fetch joke" }, 500);
  
  const hash = hashContent(joke.text);
  const cached = await getCachedContent(hash, 'joke');
  
  // If cached and rate limited, serve cache only
  if (cached && !underLimit) {
    await incrementCacheHits(hash);
    return c.json(cached.translations);
  }
  
  // If cached but under limit, still serve cache (save API calls)
  if (cached) {
    await incrementCacheHits(hash);
    return c.json(cached.translations);
  }
  
  // Not cached - attempt fresh translation
  try {
    const translated = await translateContent(
      { text: joke.text, author: joke.author },
      TARGET_LOCALES
    );
    
    // Store in cache for future use
    await setCachedContent(hash, 'joke', translated);
    
    // Track this fresh API call
    if (underLimit) {
      incrementRequestCount(ip, 'joke');
    }
    
    return c.json(translated);
  } catch (error) {
    // API failed - fallback to random cached content
    console.error("Lingo.dev API failed, serving from cache:", error);
    const fallback = await getRandomCachedContent('joke');
    
    if (fallback) {
      await incrementCacheHits(fallback.contentHash);
      return c.json(fallback.translations);
    }
    
    // No cache available - return error
    return c.json({ error: "Translation service unavailable and no cached content" }, 503);
  }
});

content.get("/quote", async (c) => {
  await incrementCounter();
  
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const underLimit = checkRateLimit(ip, 'quote');
  
  // Fetch fresh quote
  const quote = await fetchRandomQuote();
  if (!quote) return c.json({ error: "Failed to fetch quote" }, 500);
  
  const hash = hashContent(quote.text);
  const cached = await getCachedContent(hash, 'quote');
  
  // If cached and rate limited, serve cache only
  if (cached && !underLimit) {
    await incrementCacheHits(hash);
    return c.json(cached.translations);
  }
  
  // If cached but under limit, still serve cache (save API calls)
  if (cached) {
    await incrementCacheHits(hash);
    return c.json(cached.translations);
  }
  
  // Not cached - attempt fresh translation
  try {
    const translated = await translateContent(
      { text: quote.text, author: quote.author },
      TARGET_LOCALES
    );
    
    // Store in cache for future use
    await setCachedContent(hash, 'quote', translated);
    
    // Track this fresh API call
    if (underLimit) {
      incrementRequestCount(ip, 'quote');
    }
    
    return c.json(translated);
  } catch (error) {
    // API failed - fallback to random cached content
    console.error("Lingo.dev API failed, serving from cache:", error);
    const fallback = await getRandomCachedContent('quote');
    
    if (fallback) {
      await incrementCacheHits(fallback.contentHash);
      return c.json(fallback.translations);
    }
    
    // No cache available - return error
    return c.json({ error: "Translation service unavailable and no cached content" }, 503);
  }
});

content.get("/github", async (c) => {
  return c.json(await fetchGitHubStats());
});

content.get("/stats", async (c) => {
  return c.json({ count: await getCounter() });
});
