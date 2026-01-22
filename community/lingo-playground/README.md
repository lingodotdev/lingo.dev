# Lingo.dev UX Playground

An interactive visualization tool designed to demonstrate the physical and functional challenges of software localization. This playground simulates how UI components adapt—or break—across different languages, cultural tones, and reading directions.

## 🎯 What This App Does

This application provides a "hands-on" environment for developers and designers to witness the real-time impact of translation on specific UI patterns. Instead of static mockups, it offers live, interactive components that switch instantly between **English (US)**, **German (DE)**, **Spanish (MX)**, **Japanese (JP)**, and **Arabic (SA)**.

It answers the question: *"Why isn't translation just swapping words?"*

## 🚀 Key Lingo.dev Features Highlighted

This demo focuses on several core localization implementations:

### 1. Spatial Adaptation & Content Expansion
*   **Problem**: German text often expands by 30-50% compared to English.
*   **Demo**: The **Adaptive Button** and **Modal** components demonstrate how fixed-width constraints cause text overflow and truncation, while auto-layout containers (Flexbox) adapt gracefully.

### 2. Bi-directional Layouts (RTL)
*   **Problem**: Arabic requires a complete mirror of the layout (Right-to-Left), not just text alignment.
*   **Demo**: The **Adaptive Card** and **Playground Header** automatically flip margins, padding, and flex directions when Arabic is selected, ensuring a native feel.

### 3. Vertical vs. Horizontal Density
*   **Problem**: Asian languages like Japanese are more concise horizontally but often require more vertical line-height for legibility.
*   **Demo**: The **Modal Sizing** visualization shows how vertical rhythm changes between concise languages (English) and dense languages (Japanese).

### 4. Locale-Specific Formatting
*   **Problem**: Dates and Currencies vary wildly by region (e.g., `MM/DD/YYYY` vs `DD.MM.YYYY`).
*   **Demo**: The **Lingo Insights** panel and card metadata dynamically format launch dates and costs using native `Intl` formatters.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS v4 (with sophisticated Dark Mode support)
*   **Animation**: Framer Motion (Layout transitions, Staggered entrances)
*   **State**: React Context API (Theming & I18n)

## 💻 How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/lingo-playground.git
    cd lingo-playground
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Layout & Design
The app defaults to a **Dark Mode** "terminal" aesthetic to appeal to developers but includes a fully supported **Light Mode** for accessibility checks. It features a cinematic introduction sequence to set the stage for the importance of localization.
