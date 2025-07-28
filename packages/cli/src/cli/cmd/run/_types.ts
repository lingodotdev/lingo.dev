import {
  bucketTypeSchema,
  I18nConfig,
  localeCodeSchema,
  bucketTypes,
} from "@lingo.dev/_spec";
import { z } from "zod";
import { ILocalizer } from "../../localizer/_types";

export type CmdRunContext = {
  flags: CmdRunFlags;
  config: I18nConfig | null;
  localizer: ILocalizer | null;
  tasks: CmdRunTask[];
  results: Map<CmdRunTask, CmdRunTaskResult>;
};

export type CmdRunTaskResult = {
  status: "success" | "error" | "skipped";
  error?: Error;
};

export type CmdRunTask = {
  sourceLocale: string;
  targetLocale: string;
  bucketType: (typeof bucketTypes)[number];
  bucketPathPattern: string;
  injectLocale: string[];
  lockedKeys: string[];
  lockedPatterns: string[];
  ignoredKeys: string[];
  onlyKeys: string[];
};

export const flagsSchema = z.object({
  bucket: z.array(bucketTypeSchema).optional(),
  key: z.array(z.string()).optional(),
  file: z.array(z.string()).optional(),
  apiKey: z.string().optional(),
  force: z.boolean().optional(),
  frozen: z.boolean().optional(),
  verbose: z.boolean().optional(),
  strict: z.boolean().optional(),
  interactive: z.boolean().default(false),
  concurrency: z.number().positive().default(10),
  debug: z.boolean().default(false),
  sourceLocale: z.string().optional(),
  targetLocale: z.array(z.string()).optional(),
  watch: z.boolean().default(false),
  debounce: z.number().positive().default(5000), // 5 seconds default
});
export type CmdRunFlags = z.infer<typeof flagsSchema>;
