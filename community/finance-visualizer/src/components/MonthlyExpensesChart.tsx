'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ITransaction } from '@/models/Transaction';
import { formatCurrency } from '@/lib/currency';

interface MonthlyData {
  month: string;
  total: number;
}

interface MonthlyExpensesChartProps {
  data: ITransaction[];
}

export function MonthlyExpensesChart({ data }: MonthlyExpensesChartProps) {
  const monthlyData: MonthlyData[] = data.reduce((acc: MonthlyData[], transaction: ITransaction) => {
    const month = new Date(transaction.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.total += transaction.amount;
    } else {
      acc.push({ month, total: transaction.amount });
    }
    return acc;
  }, []);

  // Sort the data by date in ascending order
  const sortedMonthlyData = monthlyData.sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedMonthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip formatter={(value: number) => [formatCurrency(value), 'Total']} />
            <Legend />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
