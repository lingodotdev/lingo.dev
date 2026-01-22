import { z } from 'zod';
import { insertMemeSchema, memes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  memes: {
    create: {
      method: 'POST' as const,
      path: '/api/memes',
      input: insertMemeSchema,
      responses: {
        201: z.custom<typeof memes.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/memes',
      responses: {
        200: z.array(z.custom<typeof memes.$inferSelect>()),
      },
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
