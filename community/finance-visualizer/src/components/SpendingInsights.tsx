'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ITransaction } from '@/models/Transaction';
import { IBudget } from '@/models/Budget';
import { getCategoryIcon } from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

interface SpendingInsightsProps {
  transactions: ITransaction[];
  budgets: IBudget[];
  selectedMonth: string;
  selectedYear: number;
  icons?: {
    trendingUp: string;
    budgetPerformance: string;
    quickStats: string;
  };
}

export function SpendingInsights({ 
  transactions, 
  budgets, 
  selectedMonth, 
  selectedYear,
  icons
}: SpendingInsightsProps) {
  // Filter transactions for selected month/year
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();
    return transactionMonth === parseInt(selectedMonth) && transactionYear === selectedYear;
  });

  // Get previous month transactions for comparison
  const prevMonth = parseInt(selectedMonth) === 1 ? 12 : parseInt(selectedMonth) - 1;
  const prevYear = parseInt(selectedMonth) === 1 ? selectedYear - 1 : selectedYear;
  
  const prevMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();
    return transactionMonth === prevMonth && transactionYear === prevYear;
  });

  // Calculate spending by category
  const currentSpending: { [key: string]: number } = currentMonthTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as { [key: string]: number });

  const prevSpending: { [key: string]: number } = prevMonthTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Calculate totals
  const currentTotal = Object.values(currentSpending).reduce((sum, amount) => sum + amount, 0);
  const prevTotal = Object.values(prevSpending).reduce((sum, amount) => sum + amount, 0);
  const totalChange = currentTotal - prevTotal;
  const totalChangePercentage = prevTotal > 0 ? (totalChange / prevTotal) * 100 : 0;

  // Calculate budget utilization
  const budgetMap: { [key: string]: number } = budgets.reduce((acc, budget) => {
    acc[budget.category] = budget.amount;
    return acc;
  }, {} as { [key: string]: number });

  const overBudgetCategories = Object.keys(currentSpending).filter(category => {
    const budget = budgetMap[category];
    return budget && currentSpending[category] > budget;
  });

  const underBudgetCategories = Object.keys(currentSpending).filter(category => {
    const budget = budgetMap[category];
    return budget && currentSpending[category] < budget * 0.8; // Under 80% of budget
  });

  // Find highest spending category
  const highestSpendingCategory = Object.keys(currentSpending).reduce((max, category) => 
    currentSpending[category] > currentSpending[max] ? category : max, 
    Object.keys(currentSpending)[0]
  );

  // Calculate average transaction amount
  const avgTransaction = currentMonthTransactions.length > 0 ? 
    currentTotal / currentMonthTransactions.length : 0;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const insights = [
    {
      title: 'Monthly Spending Comparison',
      icon: icons?.trendingUp || 'bi-arrow-up-circle',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>This Month:</span>
            <span className="font-medium">{formatCurrency(currentTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Month:</span>
            <span className="font-medium">{formatCurrency(prevTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Change:</span>
            <span className={`font-medium ${totalChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {totalChange >= 0 ? '+' : ''}{formatCurrency(totalChange)} 
              ({totalChangePercentage >= 0 ? '+' : ''}{totalChangePercentage.toFixed(1)}%)
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Budget Performance',
      icon: icons?.budgetPerformance || 'bi-exclamation-circle',
      content: (
        <div className="space-y-2">
          {overBudgetCategories.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-600 mb-1">Over Budget:</p>
              {overBudgetCategories.map(category => (
                <div key={category} className="flex items-center gap-2 text-sm">
                  <span>{getCategoryIcon(category)}</span>
                  <span>{category}</span>
                  <span className="text-red-600">
                    {formatCurrency(currentSpending[category] - budgetMap[category])} over
                  </span>
                </div>
              ))}
            </div>
          )}
          {underBudgetCategories.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-600 mb-1">Under Budget:</p>
              {underBudgetCategories.map(category => (
                <div key={category} className="flex items-center gap-2 text-sm">
                  <span>{getCategoryIcon(category)}</span>
                  <span>{category}</span>
                  <span className="text-green-600">
                    {formatCurrency(budgetMap[category] - currentSpending[category])} remaining
                  </span>
                </div>
              ))}
            </div>
          )}
          {overBudgetCategories.length === 0 && underBudgetCategories.length === 0 && (
            <p className="text-sm text-gray-600">No significant budget variances</p>
          )}
        </div>
      )
    },
    {
      title: 'Quick Stats',
      icon: icons?.quickStats || 'bi-lightning-fill',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Transactions:</span>
            <span className="font-medium">{currentMonthTransactions.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Average Transaction:</span>
            <span className="font-medium">{formatCurrency(avgTransaction)}</span>
          </div>
          {highestSpendingCategory && (
            <div className="flex justify-between">
              <span>Top Category:</span>
              <span className="font-medium flex items-center gap-1">
                <span>{getCategoryIcon(highestSpendingCategory)}</span>
                <span>{highestSpendingCategory}</span>
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Categories Active:</span>
            <span className="font-medium">{Object.keys(currentSpending).length}</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Spending Insights - {monthNames[parseInt(selectedMonth) - 1]} {selectedYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xl ${insight.icon}`}></span>
                <h3 className="font-medium">{insight.title}</h3>
              </div>
              {insight.content}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
