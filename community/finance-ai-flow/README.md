# Finance AI Flow

A modern, intelligent financial overview dashboard powered by AI. Finance AI Flow helps you track your global growth, manage transactions, and gain actionable insights from your spending patterns.

## Features

- **Global Financial Tracking**: seamless, multi-currency support (USD, EUR, JPY).
- **AI-Powered Insights**: "Flow.ai" analyzes your spending to provide actionable savings tips.
- **Interactive Visualizations**: Beautiful, responsive charts to track cash flow over time.
- **Transaction Management**: Easily add, edit, and delete income and expense transactions.
- **Account Overview**: Track balances across multiple accounts (Checking, Savings, etc.).
- **Modern UI/UX**: A dark-mode first design with glassmorphism, smooth animations (Framer Motion), and responsive layout.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Standard CSS (with CSS Variables & Modules), Lucide React for icons.
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Language**: TypeScript

## Getting Started

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/your-username/finance-ai-flow.git
    cd finance-ai-flow
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open your browser**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the app in action.

## Project Structure

- `app/`: Next.js App Router directory.
    - `page.tsx`: Main dashboard entry point.
    - `layout.tsx`: Root layout configuration.
    - `globals.css`: Global styles and design system tokens.
    - `components/`: reusable UI components (Modals, Charts, etc.).
    - `types.ts`: TypeScript definitions for Transactions and Accounts.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
