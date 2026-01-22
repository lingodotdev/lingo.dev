'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ITransaction } from '@/models/Transaction';
import { IBudget } from '@/models/Budget';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

interface BudgetComparisonData {
  category: string;
  budget: number;
  actual: number;
  percentage: number;
  icon: React.ReactElement;
  color: string;
}

interface BudgetComparisonChartProps {
  transactions: ITransaction[];
  budgets: IBudget[];
  selectedMonth: string;
  selectedYear: number;
}

export function BudgetComparisonChart({ 
  transactions, 
  budgets, 
  selectedMonth, 
  selectedYear 
}: BudgetComparisonChartProps) {
  // Filter transactions for selected month/year
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const transactionMonth = transactionDate.getMonth() + 1;
    const transactionYear = transactionDate.getFullYear();
    return transactionMonth === parseInt(selectedMonth) && transactionYear === selectedYear;
  });

  // Calculate actual spending by category
  const actualSpending: { [key: string]: number } = filteredTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Create comparison data
  const comparisonData: BudgetComparisonData[] = budgets.map(budget => {
    const actual = actualSpending[budget.category] || 0;
    const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;
    
    return {
      category: budget.category,
      budget: budget.amount,
      actual: actual,
      percentage: percentage,
      icon: getCategoryIcon(budget.category),
      color: getCategoryColor(budget.category),
    };
  });

  // Add categories with spending but no budget
  Object.keys(actualSpending).forEach(category => {
    if (!budgets.some(budget => budget.category === category)) {
      comparisonData.push({
        category: category,
        budget: 0,
        actual: actualSpending[category],
        percentage: 0,
        icon: getCategoryIcon(category),
        color: getCategoryColor(category),
      });
    }
  });

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: BudgetComparisonData }[]; label?: string }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="flex items-center gap-2 font-medium">
            {data.category}
          </p>
        </div>
      );
    }
    return null;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (comparisonData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Budget vs Actual - {monthNames[parseInt(selectedMonth) - 1]} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No budget data available for this period
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Budget vs Actual - {monthNames[parseInt(selectedMonth) - 1]} {selectedYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="budget" fill="#8884d8" name="Budget" />
            <Bar dataKey="actual" fill="#82ca9d" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Budget Status Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comparisonData.map((item) => (
            <div key={item.category} className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.category}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Budget:</span>
                  <span className="font-medium">{formatCurrency(item.budget)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actual:</span>
                  <span className="font-medium">{formatCurrency(item.actual)}</span>
                </div>
                {item.budget > 0 && (
                  <div className="flex justify-between">
                    <span>Usage:</span>
                    <span className={`font-medium ${
                      item.percentage > 100 ? 'text-red-600' : 
                      item.percentage > 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.percentage.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
              {item.budget > 0 && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.percentage > 100 ? 'bg-red-500' : 
                      item.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(item.percentage, 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
