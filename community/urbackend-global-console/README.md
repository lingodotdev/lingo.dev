# urBackend Global Console 🌍

> **A Community Submission for Lingo.dev**  
> *Showcasing the power of Zero-Key Internationalization in a production-grade developer tool.*

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC) ![Lingo.dev](https://img.shields.io/badge/Lingo.dev-Zero--Key_i18n-orange)

## 📖 Introduction

**urBackend Global Console** is a premium, real-time developer dashboard designed for [urBackend](https://github.com/yash-pouranik/urbackend). It visualizes critical infrastructure metrics—database health, storage usage, and API analytics—in a single, unified interface.

This project was built to demonstrate how **Lingo.dev** allows developers to build complex, content-rich applications without worrying about localization overhead. We write standard English JSX, and Lingo.dev handles the rest.

## ✨ Lingo.dev Features Showcased

This demo highlights the core **Zero-Key Internationalization** workflow:

1.  **Plain English Source Code**: No keys, no `_t('auth.login_button_text')`. Just `<button>Login</button>`.
    *   *See `src/components/Sidebar.tsx` or `src/app/[lang]/page.tsx`.*
2.  **Seamless Routing**: Implements `/[lang]/` routing automatically to serve localized content.
    *   *See `src/middleware.ts`.*
3.  **Simulated Compiler**: For this standalone demo, we use a `demo-dictionary` to mimic the Lingo compiler's output in the browser, allowing you to experience the language switching live without running the full CLI pipeline.

## 🚀 Key Features

*   **Premium Design System**: Built with **Tailwind CSS v4**, featuring glassmorphism, smooth animations, and a high-contrast dark mode tailored for developer tools.
*   **Live Data Simulation**: Includes a custom `useRealData` hook that mimics a live WebSocket connection to a backend, generating realistic traffic patterns, latency spikes, and storage updates in real-time.
*   **Complete Dashboard**:
    *   **Overview**: Real-time request volume and health badges.
    *   **Activity Log**: Live scrolling log of API methods (GET, POST, etc.) with status codes and latency.
    *   **Resources**: Visual tracking for Database Collections and Object Storage usage.

## 🛠️ How to Run Locally

### Prerequisites
*   Node.js 18+
*   pnpm

### Steps

1.  **Clone & Install**
    ```bash
    # Navigate to the project folder
    cd community/urbackend-global-console
    
    # Install dependencies
    pnpm install
    ```

2.  **Start the Development Server**
    ```bash
    pnpm dev
    ```

3.  **Experience the App**
    *   Open [http://localhost:3000](http://localhost:3000)
    *   **Switch Languages**: Use the globe icon in the top right to switch between English, Hindi, Spanish, and French.
    *   **Watch it Update**: Observe how the UI text changes instantly while the "Live Data" numbers continue to tick uninterrupted.

## 📁 Project Structure

```bash
/src
  /app
    /[lang]          # Localized page routes (Next.js App Router)
      /analytics     # Analytics placeholder
      /database      # Database management
      /storage       # Storage bucket management
  /components        # Reusable UI (Sidebar, Metrics Cards)
  /lib
    demo-dictionary.ts  # Simulates Lingo.dev translation output
    useRealData.ts      # Generates realistic mock backend traffic
  middleware.ts      # Handles locale detection and redirection
```

## 🤝 Contribution

This project follows the [Lingo.dev Community Guidelines](https://github.com/lingodotdev/lingo.dev/tree/main/community).
Verified to be compliant with directory structure and documentation standards.

---
*Built with ❤️ for the Lingo.dev Community.*
