# Yo Lingo Server

The backend service for the Yo Lingo application, built with [Hono](https://hono.dev/) and running on [Bun](https://bun.sh/). This server handles content fetching (jokes, quotes, GitHub stats), manages usage statistics, and performs automatic multi-language translation using the [Lingo.dev](https://lingo.dev/) SDK.

## Features

- **Content API**: Fetches random jokes and quotes from external sources.
- **Auto-Translation**: Automatically translates content into 7 languages (Spanish, French, German, Hindi, Japanese, Russian, Chinese) using Lingo.dev.
- **Smart Context**: Ensures both the content text and metadata (like author names) are correctly translated or transliterated.
- **Usage Tracking**: Tracks global usage statistics across all users.
- **CORS Enabled**: Configured to allow requests from the Yo Lingo frontend.
- **🆕 Content Caching**: PostgreSQL-backed caching system to reduce API calls and improve performance.
- **🆕 Rate Limiting**: IP-based rate limiting (2 fresh translations per user) to conserve API credits.
- **🆕 API Fallback**: Graceful degradation with cached data when external APIs fail.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- A [Lingo.dev](https://lingo.dev/) API Key
- PostgreSQL database (e.g., [Neon](https://neon.tech/))

## Setup & Running Locally

1.  **Clone the repository** (if you haven't already).

2.  **Navigate to the server directory**:
    ```bash
    cd community/yo-lingo-server
    ```

3.  **Install dependencies**:
    ```bash
    bun install
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file in the root of `yo-lingo-server`:
    ```bash
    touch .env
    ```
    Add your Lingo API key and database URL:
    ```env
    LINGO_API_KEY=your_actual_api_key_here
    PORT=3001
    NEON_PG_URL=your_actual_neon_pg_url_here
    ```

5.  **Run Database Migrations**:
    ```bash
    bun run drizzle-kit generate
    bun run drizzle-kit migrate
    ```

6.  **Run the Development Server**:
    ```bash
    bun run dev
    ```
    The server will start on `http://localhost:3001` (or your configured port).

## API Endpoints

### `GET /api/joke`
Fetches a random joke and translates it.

**Caching Behavior**:
- First 2 requests per IP: Fresh translations (may call Lingo.dev API if not cached)
- 3+ requests per IP: Serves from cache only (0 API calls)
- API failure: Returns random cached joke

**Response**:
```json
{
  "en": { "text": "...", "author": "..." },
  "es": { "text": "...", "author": "..." },
  "fr": { "text": "...", "author": "..." },
  "de": { "text": "...", "author": "..." },
  "hi": { "text": "...", "author": "..." },
  "ja": { "text": "...", "author": "..." },
  "ru": { "text": "...", "author": "..." },
  "zh": { "text": "...", "author": "..." }
}
```

### `GET /api/quote`
Fetches a random quote and translates it.

**Caching Behavior**: Same as `/api/joke`

**Response**: Similar structure to `/api/joke`.

### `GET /api/stats`
Returns the total number of content items generated globally.

**Response**:
```json
{ "count": 1234 }
```

### `GET /api/github`
Fetches current stats for the Lingo.dev repository.

**Caching Behavior**:
- Attempts to fetch fresh stats from GitHub API
- On success: Caches in database and returns
- On failure: Returns cached stats from database
- No cache: Returns 502 error

**Response**:
```json
{
  "stargazers_count": 5137,
  "watchers_count": 5137
}
```

## Architecture

### Caching System
- **Database**: PostgreSQL with Drizzle ORM
- **Cache Tables**:
  - `cached_content`: Stores translated jokes/quotes with MD5 hash keys
  - `github_stats`: Stores GitHub repository statistics
- **Cache Strategy**: Hash-based deduplication prevents duplicate translations

### Rate Limiting
- **Strategy**: IP-based with in-memory tracking
- **Limits**: 2 fresh API calls per content type per IP per hour
- **Reset**: Automatic hourly cleanup of rate limit counters
- **Scope**: Independent limits for jokes vs quotes

### Error Handling
- **Concurrent Inserts**: `onConflictDoNothing` prevents duplicate key errors
- **API Failures**: Automatic fallback to cached content
- **Timeouts**: 5-second timeout on all external API calls
- **Graceful Degradation**: Returns cached data instead of errors when possible

## Database Schema

### `cached_content`
```sql
CREATE TABLE cached_content (
  id SERIAL PRIMARY KEY,
  content_hash TEXT UNIQUE NOT NULL,
  content_type TEXT NOT NULL,
  translations JSONB NOT NULL,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### `github_stats`
```sql
CREATE TABLE github_stats (
  id SERIAL PRIMARY KEY,
  stargazers_count INTEGER NOT NULL,
  watchers_count INTEGER NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### `stats`
```sql
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  count INTEGER DEFAULT 0
);
```

## API Credit Conservation

**Before Optimization**: Unlimited API calls per user
**After Optimization**: ~80-90% reduction in API usage

- First-time content: 1 API call (cached for future)
- Repeated content: 0 API calls (served from cache)
- Rate-limited users: 0 API calls (cache-only mode)
- API failures: 0 API calls (fallback to cache)
