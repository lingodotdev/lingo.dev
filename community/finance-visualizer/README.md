# Finance Visualizer

A modern, responsive web application for tracking personal finances built with Next.js, React, and MongoDB, now powered by [Lingo.dev](https://lingo.dev) for seamless AI-driven internationalization.

This demo showcases how **Lingo.dev** can translate an existing application into multiple languages (Spanish, French, German, Chinese, and Japanese) with **zero code changes** to the application logic or UI components.

## Features

- **Multi-language Support**: Automatically translated into 5+ languages using Lingo.dev.
- **Transaction Tracking**: Add, edit, and delete income and expenses.
- **Visual Analytics**: Interactive charts (Pie, Bar) for spending analysis.
- **Budgeting**: Set and monitor monthly category budgets.
- **Responsive Design**: Works seamlessly on desktop and mobile.

## Lingo.dev Integration

This project demonstrates the power of the **Lingo.dev Compiler**.

- **Zero Code Changes**: No manual `t()` function calls or complex i18n setup.
- **Configuration-based**: Translation is handled entirely via `next.config.ts`.
- **AI-Powered**: Translations are generated contextually by LLMs.

To see the integration, check `next.config.ts`:

```typescript
import { withLingo } from "@lingo.dev/compiler/next";

export default async function (): Promise<NextConfig> {
  return await withLingo(nextConfig, {
    sourceLocale: "en",
    targetLocales: ["es", "fr", "de", "zh", "ja"],
    models: "lingo.dev",
  });
}
```

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- MongoDB connection string
- Lingo.dev API Key (Get one at [lingo.dev](https://lingo.dev))

### Setup

1. **Navigate to the directory**
   ```bash
   cd community/finance-visualizer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/personal-finance?retryWrites=true
   LINGO_API_KEY=your_lingo_api_key_here
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000). You will see the English version.
   To see translated versions, access the locales subpaths (e.g., depends on middleware configuration, or Lingo.dev's routing strategy).

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── transactions/
│   │       ├── route.ts          # GET, POST /api/transactions
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/transactions/:id
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main dashboard
├── components/
│   ├── BudgetComparisonChart.tsx # Budget vs actual comparison
│   ├── BudgetForm.tsx            # Budget setting form
│   ├── CategoryPieChart.tsx      # Category breakdown pie chart
│   ├── DashboardSummary.tsx      # Summary cards dashboard
│   ├── MonthlyExpensesChart.tsx  # Bar chart component
│   ├── SpendingInsights.tsx      # Spending analysis insights
│   ├── TransactionForm.tsx       # Add/Edit transaction form
│   ├── TransactionList.tsx       # Transaction table
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── categories.ts             # Category definitions and utilities
│   ├── dbConnect.ts              # MongoDB connection
│   └── utils.ts                  # Utility functions
└── models/
    ├── Budget.ts                 # Budget model
    └── Transaction.ts            # Transaction model
```

## Tech Stack

- **I18n**: [Lingo.dev](https://lingo.dev)
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB with Mongoose
- **Form Handling**: React Hook Form with Zod validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
