'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { categories } from '@/lib/categories';
import { IBudget } from '@/models/Budget';
import { formatCurrency } from '@/lib/currency';

const budgetSchema = z.object({
  category: z.string().min(1, { message: 'Please select a category.' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number.' }),
  month: z.string().min(1, { message: 'Please select a month.' }),
  year: z.coerce.number().min(2020).max(2030, { message: 'Please enter a valid year.' }),
});

interface BudgetFormProps {
  onSuccess: () => void;
}

export function BudgetForm({ onSuccess }: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingBudgets, setExistingBudgets] = useState<IBudget[]>([]);

  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: '',
      amount: 0,
      month: (new Date().getMonth() + 1).toString(),
      year: new Date().getFullYear(),
    },
  });

  const fetchBudgets = useCallback(async () => {
    try {
      const month = form.getValues('month');
      const year = form.getValues('year');
      const res = await fetch(`/api/budgets?month=${month}&year=${year}`);
      const { data } = await res.json();
      setExistingBudgets(data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    }
  }, [form]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const watchMonth = form.watch('month');
  const watchYear = form.watch('year');

  useEffect(() => {
    if (watchMonth && watchYear) {
      fetchBudgets();
    }
  }, [watchMonth, watchYear, fetchBudgets]);

  async function onSubmit(values: z.infer<typeof budgetSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error('Failed to save budget');
      }

      form.reset();
      onSuccess();
      fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    try {
      const res = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchBudgets();
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to delete budget:', err);
    }
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Monthly Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Month</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map(month => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            <span className="flex items-center gap-2">
                              <i className={`bi ${category.icon}`} aria-hidden="true"></i>
                              <span>{category.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="500" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Set Budget'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {existingBudgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Current Budgets - {months.find(m => m.value === watchMonth)?.label} {watchYear}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingBudgets.map((budget) => {
                const category = categories.find(c => c.value === budget.category);
                return (
                  <div key={budget._id as string} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category?.icon}</span>
                      <div>
                        <p className="font-medium">{budget.category}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(budget.amount)}</p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBudget(budget._id as string)}
                    >
                      Delete
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
