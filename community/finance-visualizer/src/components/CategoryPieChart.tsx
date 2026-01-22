'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ITransaction } from '@/models/Transaction';
import { getCategoryColor, getCategoryIcon } from '@/lib/categories';
import { formatCurrency } from '@/lib/currency';

interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon: React.ReactElement;
}

interface CategoryPieChartProps {
  data: ITransaction[];
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const categoryData: CategoryData[] = data.reduce((acc: CategoryData[], transaction: ITransaction) => {
    const existing = acc.find((item) => item.name === transaction.category);
    if (existing) {
      existing.value += transaction.amount;
    } else {
      acc.push({
        name: transaction.category,
        value: transaction.amount,
        color: getCategoryColor(transaction.category),
        icon: getCategoryIcon(transaction.category),
      });
    }
    return acc;
  }, []);

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: CategoryData }[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border rounded-lg shadow-lg">
          <p className="flex items-center gap-2">
            <span>{data.icon}</span>
            <span className="font-medium">{data.name}</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(data.value)} ({((data.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: { payload?: { value: string; color: string }[] }) => {
    return (
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {payload?.map((entry, index) => (
          <div key={index} className="flex items-center gap-1 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ percent }: { percent?: number }) => percent ? `${(percent * 100).toFixed(1)}%` : ''}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
