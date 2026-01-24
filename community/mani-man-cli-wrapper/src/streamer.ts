import { translateText } from "./translator";
import * as readline from "readline";

const CHUNK_SIZE = 5; // Number of paragraphs to translate at a time

interface StreamState {
  paragraphs: string[];
  currentIndex: number;
  translatedBuffer: string[];
  isTranslating: boolean;
  isDone: boolean;
}

/**
 * Creates a stream state from the input text
 */
export function createStreamState(text: string): StreamState {
  // Split into paragraphs (double newlines or significant whitespace)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== "");
  
  return {
    paragraphs,
    currentIndex: 0,
    translatedBuffer: [],
    isTranslating: false,
    isDone: false,
  };
}

/**
 * Translates the next chunk of paragraphs
 */
async function translateNextChunk(
  state: StreamState,
  targetLocale: string
): Promise<string[]> {
  const endIndex = Math.min(state.currentIndex + CHUNK_SIZE, state.paragraphs.length);
  const chunk = state.paragraphs.slice(state.currentIndex, endIndex);
  
  const translated: string[] = [];
  
  for (const paragraph of chunk) {
    if (paragraph.trim() === "") {
      translated.push(paragraph);
    } else {
      const result = await translateText(paragraph, targetLocale);
      translated.push(result);
    }
  }
  
  state.currentIndex = endIndex;
  state.isDone = state.currentIndex >= state.paragraphs.length;
  
  return translated;
}

/**
 * Runs the interactive streaming translation
 */
export async function runStreamingTranslation(
  text: string,
  targetLocale: string
): Promise<void> {
  const state = createStreamState(text);
  
  // Setup readline for capturing user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Enable raw mode to capture keystrokes immediately
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  
  console.log(`\n${"─".repeat(60)}`);
  console.log(`📖 Streaming translation mode (${state.paragraphs.length} sections)`);
  console.log(`   Press ENTER/SPACE for more, 'q' or Ctrl+C to quit`);
  console.log(`${"─".repeat(60)}\n`);

  // Translate and display first chunk immediately
  state.isTranslating = true;
  const firstChunk = await translateNextChunk(state, targetLocale);
  state.translatedBuffer.push(...firstChunk);
  console.log(firstChunk.join("\n\n"));
  state.isTranslating = false;

  if (state.isDone) {
    console.log(`\n${"─".repeat(60)}`);
    console.log("✓ End of translation");
    rl.close();
    process.exit(0);
  }

  // Pre-fetch next chunk in background
  let prefetchPromise: Promise<string[]> | null = null;
  const startPrefetch = () => {
    if (!state.isDone && !prefetchPromise) {
      prefetchPromise = translateNextChunk(state, targetLocale);
    }
  };
  startPrefetch();

  // Show continuation prompt
  const showPrompt = () => {
    const remaining = state.paragraphs.length - state.currentIndex + (prefetchPromise ? CHUNK_SIZE : 0);
    const progress = Math.round(((state.paragraphs.length - remaining) / state.paragraphs.length) * 100);
    process.stdout.write(`\n[${progress}% - ${remaining} sections remaining] Press ENTER for more, 'q' to quit: `);
  };

  showPrompt();

  // Handle input
  process.stdin.on("data", async (key: Buffer) => {
    const char = key.toString();
    
    // Handle quit commands
    if (char === "q" || char === "Q" || char === "\u0003" || char === "\u001A") {
      // q, Q, Ctrl+C, Ctrl+Z
      console.log("\n\n👋 Translation stopped by user");
      rl.close();
      process.exit(0);
    }
    
    // Handle continue commands (Enter, Space, arrow down)
    if (char === "\r" || char === "\n" || char === " " || char === "\u001B[B") {
      if (state.isDone && !prefetchPromise) {
        console.log(`\n\n${"─".repeat(60)}`);
        console.log("✓ End of translation");
        rl.close();
        process.exit(0);
      }

      // Clear the prompt line
      process.stdout.write("\r" + " ".repeat(80) + "\r");

      // Wait for prefetched content or fetch new
      let content: string[];
      if (prefetchPromise) {
        content = await prefetchPromise;
        prefetchPromise = null;
      } else {
        state.isTranslating = true;
        content = await translateNextChunk(state, targetLocale);
        state.isTranslating = false;
      }

      // Display content
      console.log("\n" + content.join("\n\n"));
      
      // Start prefetching next chunk
      if (!state.isDone) {
        startPrefetch();
        showPrompt();
      } else {
        console.log(`\n${"─".repeat(60)}`);
        console.log("✓ End of translation");
        rl.close();
        process.exit(0);
      }
    }
  });

  // Handle process signals
  process.on("SIGINT", () => {
    console.log("\n\n👋 Translation interrupted");
    rl.close();
    process.exit(0);
  });

  process.on("SIGTSTP", () => {
    console.log("\n\n👋 Translation suspended");
    rl.close();
    process.exit(0);
  });
}

/**
 * Gets the total number of sections in the text
 */
export function getSectionCount(text: string): number {
  return text.split(/\n\s*\n/).filter(p => p.trim() !== "").length;
}
