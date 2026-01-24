# Next.js Multilingual Chat with Lingo.dev

## 1. Project Overview
This project is a real-time, multilingual chat application built with Next.js 16 (App Router) and **Lingo.dev**. It demonstrates how to build applications that automatically break down language barriers between users, allowing them to communicate seamlessly in their native languages.

## 2. Key Features
- **Real-Time Translation**: Users see all messages in their preferred language, regardless of the original language they were sent in.
- **Automatic Language Detection**: The system automatically detects the language of any sent message.
- **Language Routing**: URLs determine the user's interface language (e.g., `/en/chat`, `/es/chat`).
- **Professional UI**: A responsive, dark-mode interface with a sidebar for easy language switching.

## 3. How Lingo.dev is Used

We utilize the **Lingo.dev SDK** (`lingo.dev/sdk`) for two critical AI functions:

### A. Message Translation (Runtime)
When a user fetches messages, the backend translates them on-the-fly to the requested language.
- **File**: `app/api/messages/route.ts` (GET handler)
- **Function**: `lingoDotDev.localizeText(text, { sourceLocale, targetLocale })`
- **Logic**: The API iterates through stored messages. If a message's language differs from the user's requested language (e.g., user wants `es`, message is `en`), the SDK calls Lingo's AI engine to return a context-aware translation.

### B. Language Auto-Detection
When a user sends a message, we verify which language they are writing in to ensure future translations are accurate.
- **File**: `app/api/messages/route.ts` (POST handler)
- **Function**: `lingoDotDev.recognizeLocale(text)`
- **Logic**: The API analyzes the input text (e.g., "Bonjour, comment ça va?") and identifies the correct locale code (`fr`). This `language` tag is saved with the message, serving as the source of truth for all future translations.

## 4. Project Structure
```text
├── app/
│   ├── [lang]/chat/page.tsx  # Main Chat UI. Client Component that handles display & sending.
│   ├── api/messages/route.ts # Backend API. Handles storage, translation, and auto-detection.
│   └── page.tsx              # Root redirect (redirects localhost:3000 -> /en/chat)
├── lib/
│   └── lingo.ts              # Initializes the LingoDotDevEngine with the API Key.
├── i18n.json                 # Lingo configuration file.
└── .env.local                # Stores the LINGODOTDEV_API_KEY.
```

## 5. Getting Started

### Prerequisites
- Node.js installed.
- A Lingo.dev API Key.

### Installation
1.  **Clone & Install**
    ```bash
    npm install
    ```

2.  **Configure Environment**
    Create a file named `.env.local` in the root directory and add your key:
    ```bash
    LINGODOTDEV_API_KEY=your_actual_api_key_here
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```

### How to Test
1.  Open `http://localhost:3000/en/chat` (English view).
2.  Open `http://localhost:3000/es/chat` (Spanish view) in a separate browser window or tab.
3.  **Chat**: Send a message in English in the first tab.
4.  **Observe**: See it appear instantly in Spanish in the second tab!
5.  **Auto-Detect**: Try typing a French sentence like *"Merci beaucoup"* in the English tab. The system will detect it as French and translate it correctly for the Spanish user.

---

#### Powered by Next.js and Lingo.dev
