import { config } from 'dotenv';
config();

import '@/ai/flows/answer-tool-queries.ts';
import '@/ai/flows/generate-tool-documentation.ts';
import '@/ai/flows/suggest-relevant-tools.ts';
import '@/ai/flows/summarize-lingo-tool.ts';
import '@/ai/flows/summarize-topic.ts';
