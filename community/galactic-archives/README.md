# Galactic Archives 🌌

**Galactic Archives** is a futuristic, immersive demo application built for the [Lingo.dev Community Hackathon](https://github.com/lingodotdev/lingo.dev/issues/1761).

It simulates an intercom from a starship terminal, demonstrating how **Lingo.dev** can power "Universal Communication" across the galaxy.

## ✨ Features

### 1. The Planetary Database (JSON + next-intl)
**⭐ POWERED BY LINGO.DEV**

This section demonstrates the **Offline Translation Workflow**.
*   **The Problem:** Static sites or strict runtime environments (like edge) often cannot depend on external translation APIs at runtime.
*   **The Lingo Solution:** We use the **Lingo.dev CLI (Docker)** to bake high-quality translations right into the app during development.
*   **How it works:**
    1.  We edit `messages/en.json`.
    2.  We run `.\translate.ps1` (or `./translate.sh`).
    3.  Lingo.dev AI generates `es.json`, `fr.json`, `de.json`, etc.
    4.  Next.js serves these static files with zero runtime latency.

### 2. Subspace Transmitter (Simulation)
**Concept Demo**
A real-time chat interface simulating a future where Lingo.dev is integrated into starship comms.
*   *Note: This specific feature simulates responses to keep the demo self-contained and focused on the static workflow above.*

---

## 🚀 How to Run Locally

### Prerequisites
*   Node.js 18+
*   Docker (for generating translations)
*   Lingo.dev API Key (for generating translations)

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/lingo.dev.git
    cd lingo.dev/community/galactic-archives
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run the App**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) and explore the galaxy!

---

## 🌍 Translation Workflow (The "Standard" Way)

To add new content or languages, follow this Docker-based workflow:

1.  **Edit Content**: Update `messages/en.json`.
2.  **Translate**: Run the translation script (requires Docker):
    ```bash
    ./translate.sh
    ```
    *This spins up a Lingo.dev container, authenticates with your API key (from `.env.local`), and generates the target `messages/*.json` files.*
3.  **Commit**: Commit the generated JSON files.
4.  **Deploy**: Next.js serves the new translations statically.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Styling:** Tailwind CSS (Custom Sci-Fi Theme)
*   **Localization:** `next-intl` + Lingo.dev CLI (Docker)
*   **Animation:** Framer Motion

---

> "In space, everyone can hear you... if you have the right translator."
