'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ITransaction } from '@/models/Transaction';
import { getCategoryIcon, getCategoryColor } from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

interface DashboardSummaryProps {
  transactions: ITransaction[];
  icons?: {
    totalExpenses: string;
    thisMonth: string;
    averageTransaction: string;
    topCategory: string;
  };
}

export function DashboardSummary({ transactions, icons }: DashboardSummaryProps) {
  const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const categoryTotals = transactions.reduce((acc: { [key: string]: number }, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentMonthExpenses = transactions
    .filter(transaction => {
      const transactionMonth = new Date(transaction.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      return transactionMonth === currentMonth;
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const averageTransaction = transactions.length > 0 ? totalExpenses / transactions.length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <span className={`text-2xl ${icons?.totalExpenses || ''}`}></span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">
            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <span className={`text-2xl ${icons?.thisMonth || ''}`}></span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(currentMonthExpenses)}</div>
          <p className="text-xs text-muted-foreground">{currentMonth}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
          <span className={`text-2xl ${icons?.averageTransaction || ''}`}></span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageTransaction)}</div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          <span className={`text-2xl ${icons?.topCategory || ''}`}></span>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {topCategories.length > 0 ? formatCurrency(topCategories[0][1]) : formatCurrency(0)}
          </div>
          <p className="text-xs text-muted-foreground">
            {topCategories.length > 0 ? topCategories[0][0] : 'No data'}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topCategories.length > 0 ? (
              topCategories.map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(category)}</span>
                    <span className="text-sm">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{formatCurrency(amount)}</span>
                    <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(amount / topCategories[0][1]) * 100}%`,
                          backgroundColor: getCategoryColor(category),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction._id as string} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(transaction.category)}</span>
                    <div>
                      <p className="text-sm font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(transaction.amount)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent transactions</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
