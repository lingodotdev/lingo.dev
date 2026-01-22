"use client";

import { useState, useEffect, useCallback } from "react";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { MonthlyExpensesChart } from "@/components/MonthlyExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { DashboardSummary } from "@/components/DashboardSummary";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetComparisonChart } from "@/components/BudgetComparisonChart";
import { SpendingInsights } from "@/components/SpendingInsights";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITransaction } from "@/models/Transaction";
import { IBudget } from "@/models/Budget";
import { PlusIcon, RotateCcw } from "lucide-react";
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function Home() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState("overview");

  const fetchTransactions = async () => {
    try {
      setError(null);
      const res = await fetch("/api/transactions");
      
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const { data } = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchBudgets = useCallback(async () => {
    try {
      const res = await fetch(`/api/budgets?month=${selectedMonth}&year=${selectedYear}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch budgets');
      }
      
      const { data } = await res.json();
      setBudgets(data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear, fetchBudgets]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">
              Personal Finance Visualizer
            </h1>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchTransactions}
                className="gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <PlusIcon className="h-4 w-4" />
                    Add Transaction
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                  </DialogHeader>
                  <TransactionForm
                    onSuccess={() => {
                      fetchTransactions();
                      setIsDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <p className="text-muted-foreground">
            Track your expenses, set budgets, and visualize your spending patterns
          </p>
        </div>
        
        {/* Main Navigation Tabs */}
        <div className="mb-8 flex gap-2">
          <Button variant={activeTab === "overview" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("overview")}>Overview</Button>
          <Button variant={activeTab === "transactions" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("transactions")}>Transactions</Button>
          <Button variant={activeTab === "analytics" ? "default" : "outline"} size="sm" onClick={() => setActiveTab("analytics")}>Analytics</Button>
        </div>
        
        {activeTab === "overview" && (
          <section className="space-y-6">
            <DashboardSummary 
              transactions={transactions} 
              icons={{
                totalExpenses: 'wallet',
                thisMonth: 'calendar',
                averageTransaction: 'calculator',
                topCategory: 'award'
              }}
            />
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-semibold">
                    Budget Management
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = i + 1;
                            const monthName = new Date(2024, i).toLocaleString('default', { month: 'long' });
                            return (
                              <SelectItem key={month} value={month.toString()}>
                                {monthName}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - 2 + i;
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">Manage Budgets</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Manage Budgets</DialogTitle>
                        </DialogHeader>
                        <BudgetForm
                          onSuccess={() => {
                            fetchBudgets();
                            setIsBudgetDialogOpen(false);
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
                <BudgetComparisonChart 
                  transactions={transactions} 
                  budgets={budgets}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
                <SpendingInsights 
                  transactions={transactions} 
                  budgets={budgets}
                  selectedMonth={selectedMonth}
                  selectedYear={selectedYear}
                  icons={{
                    trendingUp: 'trending-up',
                    budgetPerformance: 'alert-circle',
                    quickStats: 'zap'
                  }}
                />
              </CardContent>
            </Card>
          </section>
        )}
        
        {activeTab === "transactions" && (
          <section>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    Transactions
                  </h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>Add Transaction</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Transaction</DialogTitle>
                      </DialogHeader>
                      <TransactionForm
                        onSuccess={() => {
                          fetchTransactions();
                          setIsDialogOpen(false);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md mb-4 flex items-center justify-between">
                    <span>{error}</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={fetchTransactions}
                    >
                      Retry
                    </Button>
                  </div>
                )}
                <TransactionList
                  transactions={transactions}
                  fetchTransactions={fetchTransactions}
                />
              </CardContent>
            </Card>
          </section>
        )}
        
        {activeTab === "analytics" && (
          <section>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
                  <div className="h-[350px]">
                    <MonthlyExpensesChart data={transactions} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
                  <div className="h-[350px]">
                    <CategoryPieChart data={transactions} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
