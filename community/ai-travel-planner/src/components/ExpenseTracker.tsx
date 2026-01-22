"use i18n";
import { useState, useMemo } from "react";
import { Receipt, Plus, Trash2, PieChart, Wallet } from "lucide-react";

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  currency: string;
}

interface ExpenseTrackerProps {
  budget?: number;
  currency?: string;
}

const expenseCategories = [
  { id: "accommodation", name: "Accommodation", icon: "🏨", color: "bg-blue-500/20 text-blue-400" },
  { id: "food", name: "Food & Drinks", icon: "🍽️", color: "bg-amber-500/20 text-amber-400" },
  { id: "transport", name: "Transport", icon: "🚗", color: "bg-emerald-500/20 text-emerald-400" },
  { id: "activities", name: "Activities", icon: "🎭", color: "bg-violet-500/20 text-violet-400" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "bg-pink-500/20 text-pink-400" },
  { id: "other", name: "Other", icon: "📦", color: "bg-gray-500/20 text-gray-400" },
];

export default function ExpenseTracker({ budget = 1000, currency = "USD" }: ExpenseTrackerProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "food",
    date: new Date().toISOString().split("T")[0],
  });

  const totalSpent = useMemo(() => 
    expenses.reduce((sum, exp) => sum + exp.amount, 0), 
    [expenses]
  );

  const remaining = budget - totalSpent;
  const spentPercentage = Math.min((totalSpent / budget) * 100, 100);

  const expensesByCategory = useMemo(() => {
    return expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;

    const expense: Expense = {
      id: crypto.randomUUID(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
      currency,
    };

    setExpenses([expense, ...expenses]);
    setNewExpense({
      description: "",
      amount: "",
      category: "food",
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const getCategoryInfo = (categoryId: string) => 
    expenseCategories.find(c => c.id === categoryId) || expenseCategories[5];

  return (
    <div className="glass-card p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-400" />
          <>Expense Tracker</>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-colors"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Budget Overview */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-sky-500/10 border border-emerald-500/20">
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-sm text-gray-400"><>Total Budget</></p>
            <p className="text-2xl font-bold text-white">${budget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400"><>Remaining</></p>
            <p className={`text-2xl font-bold ${remaining >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              ${remaining.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              spentPercentage > 90 ? "bg-red-500" : spentPercentage > 70 ? "bg-amber-500" : "bg-emerald-500"
            }`}
            style={{ width: `${spentPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span><>Spent: ${totalSpent.toLocaleString()}</></span>
          <span>{Math.round(spentPercentage)}% <>used</></span>
        </div>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="w-full input-field text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="input-field text-sm"
              min="0"
              step="0.01"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="input-field text-sm"
            >
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full input-field text-sm"
          />
          <button
            onClick={addExpense}
            disabled={!newExpense.description || !newExpense.amount}
            className="w-full btn-primary py-2 text-sm disabled:opacity-50"
          >
            <span className="relative z-10"><>Add Expense</></span>
          </button>
        </div>
      )}

      {/* Category Breakdown */}
      {expenses.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            <>By Category</>
          </h4>
          <div className="space-y-2">
            {expenseCategories.map(category => {
              const amount = expensesByCategory[category.id] || 0;
              if (amount === 0) return null;
              const percentage = (amount / totalSpent) * 100;
              
              return (
                <div key={category.id} className="flex items-center gap-3">
                  <span className="text-lg">{category.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{category.name}</span>
                      <span className="text-white font-medium">${amount.toFixed(2)}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${category.color.split(" ")[0].replace("/20", "")}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wallet className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p><>No expenses yet</></p>
            <p className="text-xs mt-1"><>Click + to add your first expense</></p>
          </div>
        ) : (
          expenses.map(expense => {
            const category = getCategoryInfo(expense.category);
            return (
              <div
                key={expense.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${category.color}`}>
                  {category.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{expense.description}</p>
                  <p className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${expense.amount.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
