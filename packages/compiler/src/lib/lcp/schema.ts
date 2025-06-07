import { z } from "zod";

// LCP

export const lcpScope = z.object({
  type: z.enum(["element", "attribute"]),
  content: z.string(),
  hash: z.string(),
  context: z.string().optional(),
  skip: z.boolean().optional(),
  overrides: z.record(z.string(), z.string()).optional(),
});

export type LCPScope = z.infer<typeof lcpScope>;

export const lcpFile = z.object({
  scopes: z.record(z.string(), lcpScope).optional(),
});

export type LCPFile = z.infer<typeof lcpFile>;

export const lcpSchema = z.object({
  version: z.number().default(0.1),
  files: z.record(z.string(), lcpFile).optional(),
});

export type LCPSchema = z.infer<typeof lcpSchema>;

// Dictionary

export const dictionaryFile = z.object({
  entries: z.record(z.string(), z.string()),
});

export type DictionaryFile = z.infer<typeof dictionaryFile>;

export const dictionarySchema = z.object({
  version: z.number().default(0.1),
  locale: z.string(),
  files: z.record(z.string(), dictionaryFile),
});

export type DictionarySchema = z.infer<typeof dictionarySchema>;

// Dictionary Cache

export const dictionaryCacheFile = z.object({
  entries: z.record(
    z.string(),
    z.object({
      content: z.record(z.string(), z.string()),
      hash: z.string(),
    }),
  ),
});

export const dictionaryCacheSchema = z.object({
  version: z.number().default(0.1),
  files: z.record(z.string(), dictionaryCacheFile),
});

export type DictionaryCacheSchema = z.infer<typeof dictionaryCacheSchema>;
