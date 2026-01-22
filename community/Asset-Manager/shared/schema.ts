import { pgTable, text, serial, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users);
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const memes = pgTable("memes", {
  id: serial("id").primaryKey(),
  templateId: text("template_id").notNull(),
  imageUrl: text("image_url").notNull(),
  topText: text("top_text").notNull(),
  bottomText: text("bottom_text").notNull(),
  translations: jsonb("translations").$type<Record<string, { top: string; bottom: string }>>().notNull(),
  topPosition: integer("top_position").default(10).notNull(),
  bottomPosition: integer("bottom_position").default(10).notNull(),
  topXPosition: integer("top_x_position").default(50).notNull(),
  bottomXPosition: integer("bottom_x_position").default(50).notNull(),
  topFontSize: integer("top_font_size").default(32).notNull(),
  bottomFontSize: integer("bottom_font_size").default(32).notNull(),
});

export const insertMemeSchema = createInsertSchema(memes).omit({ id: true });

export type InsertMeme = z.infer<typeof insertMemeSchema>;
export type Meme = typeof memes.$inferSelect;
