// import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";
import { weatherTool } from "@/lib/tools/weather";
import { webSearchTool } from "./tools/webSearch";
import { calculatorTool } from "./tools/calculator";
import { imageGenerationTool } from "./tools/imageGeneration";
import { youtubeTranscriptFetcherTool } from "./tools/youtubeTranscriptFetcher";
import { imageSearchTool } from "./tools/imageSearch";

export const tools = [
  weatherTool,
  webSearchTool,
  calculatorTool,
  imageSearchTool,
  imageGenerationTool,
  youtubeTranscriptFetcherTool,
];

// export const model = new ChatGroq({
//   model: process.env.GROQ_MODEL_ID || "openai/gpt-oss-120b",
//   temperature: 0,
// }).bindTools(tools);

export const model = new ChatOpenAI({
  model: "c1-exp/anthropic/claude-haiku-4.5/v-20251230",
  configuration: {
    baseURL: "https://api.thesys.dev/v1/embed",
    apiKey: process.env.THESYS_API_KEY,
  },
}).bindTools(tools);
