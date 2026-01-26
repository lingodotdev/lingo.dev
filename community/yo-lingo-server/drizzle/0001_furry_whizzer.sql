CREATE TABLE "cached_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"content_hash" text NOT NULL,
	"content_type" text NOT NULL,
	"translations" jsonb NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cached_content_content_hash_unique" UNIQUE("content_hash")
);
