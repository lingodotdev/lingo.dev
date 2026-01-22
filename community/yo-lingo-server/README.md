# Yo Lingo Server

The backend service for the Yo Lingo application, built with [Hono](https://hono.dev/) and running on [Bun](https://bun.sh/). This server handles content fetching (jokes, quotes, GitHub stats), manages usage statistics, and performs automatic multi-language translation using the [Lingo.dev](https://lingo.dev/) SDK.

## Features

- **Content API**: Fetches random jokes and quotes from external sources.
- **Auto-Translation**: Automatically translates content into 7 languages (Spanish, French, German, Hindi, Japanese, Russian, Chinese) using Lingo.dev.
- **Smart Context**: Ensures both the content text and metadata (like author names) are correctly translated or transliterated.
- **Usage Tracking**: Tracks global usage statistics across all users.
- **CORS Enabled**: Configured to allow requests from the Yo Lingo frontend.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- A [Lingo.dev](https://lingo.dev/) API Key

## Setup & Running Locally

1.  **Clone the repository** (if you haven't already).

2.  **Navigate to the server directory**:
    ```bash
    cd yo-lingo-server
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
    Add your Lingo API key and (optional) port configuration:
    ```env
    LINGO_API_KEY=your_actual_api_key_here
    PORT=3001
    NEON_PG_URL=your_actual_neon_pg_url_here
    ```

5.  **Run the Development Server**:
    ```bash
    bun run dev
    ```
    The server will start on `http://localhost:3001` (or your configured port).

## API Endpoints

### `GET /api/joke`
Fetches a random joke and translates it.
**Response**:
```json
{
  "en": { "text": "...", "author": "..." },
  "es": { "text": "...", "author": "..." },
  ...
}
```

### `GET /api/quote`
Fetches a random quote and translates it.
**Response**: Similar structure to `/api/joke`.

### `GET /api/stats`
Returns the total number of content items generated globally.
**Response**:
```json
{ "count": 1234 }
```

### `GET /api/github`
Fetches current stats for the Lingo.dev repository.
