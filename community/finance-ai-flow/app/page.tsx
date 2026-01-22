'use client';

import { useState } from 'react';
import {
    BarChart3,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Sparkles,
    Globe,
    Repeat,
    Trash2,
    Pencil,
    LayoutDashboard,
    CreditCard,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Transaction, Account } from './types';
import { TransactionModal } from './components/TransactionModal';
import { AccountModal } from './components/AccountModal';
import { CurrencySelector } from './components/CurrencySelector';
import { OverviewChart } from './components/OverviewChart';

// Mock Data
const INITIAL_TRANSACTIONS: Transaction[] = [];

const INITIAL_ACCOUNTS: Account[] = [];

export default function Home() {
    const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
    const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
    const [locale, setLocale] = useState('en-US');
    const [isTransModalOpen, setIsTransModalOpen] = useState(false);
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Derived State
    const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0)
        + transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0)
        - transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const monthlyExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

    const formatCurrency = (amount: number) => {
        let currencyCode = 'USD';
        switch (locale) {
            case 'en-US': currencyCode = 'USD'; break;
            case 'de-DE': case 'fr-FR': currencyCode = 'EUR'; break;
            case 'ja-JP': currencyCode = 'JPY'; break;
            case 'en-IN': currencyCode = 'INR'; break;
            default: currencyCode = 'USD';
        }

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2
        }).format(amount);
    };

    const handleSaveTransaction = (data: Omit<Transaction, 'id'>) => {
        if (editingTransaction) {
            setTransactions(transactions.map(t =>
                t.id === editingTransaction.id ? { ...data, id: t.id } : t
            ));
            setEditingTransaction(null);
        } else {
            const newTrans: Transaction = {
                id: Math.random().toString(),
                ...data
            };
            setTransactions([newTrans, ...transactions]);
        }
    };

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const handleAddAccount = (data: Omit<Account, 'id'>) => {
        const newAccount: Account = {
            id: Math.random().toString(),
            ...data
        };
        setAccounts([...accounts, newAccount]);
    };

    const startEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsTransModalOpen(true);
    };

    const closeModal = () => {
        setIsTransModalOpen(false);
        setEditingTransaction(null);
    };

    const refreshAiInsights = () => {
        setAiLoading(true);
        setTimeout(() => {
            setAiLoading(false);
        }, 1500);
    };

    return (
        <div className="dashboard-grid">
            <TransactionModal
                isOpen={isTransModalOpen}
                onClose={closeModal}
                onSubmit={handleSaveTransaction}
                initialData={editingTransaction}
            />

            <AccountModal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
                onSubmit={handleAddAccount}
            />

            {/* Sidebar */}
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '0.5rem' }}>
                        <Wallet size={24} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>Flow.ai</span>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
                        <LayoutDashboard size={20} /> Dashboard
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <BarChart3 size={20} /> Analytics
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                        <Globe size={20} /> Global Config
                    </div>
                </nav>

                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>Accounts</h4>
                        <button onClick={() => setIsAccountModalOpen(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                            <Plus size={16} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {accounts.map(acc => (
                            <div key={acc.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                <CreditCard size={16} />
                                <span style={{ flex: 1 }}>{acc.name}</span>
                                <span style={{ color: 'white' }}>{formatCurrency(acc.balance)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Sparkles size={16} className="text-secondary" />
                            <span style={{ fontSize: '0.875rem' }}>AI Assistant</span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Your spending is 12% lower than last month. Great job!
                        </p>
                    </motion.div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Financial Overview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Welcome back, track your global growth.</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ display: 'flex', gap: '1rem' }}
                    >
                        <CurrencySelector
                            currentLocale={locale}
                            onLocaleChange={setLocale}
                        />
                        <button
                            className="btn"
                            onClick={() => setIsTransModalOpen(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Plus size={18} /> New Transaction
                        </button>
                    </motion.div>
                </header>

                {/* Stats Grid */}
                <div className="grid-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Balance</span>
                            <Wallet size={20} style={{ opacity: 0.5 }} />
                        </div>
                        <div className="stat-value">{formatCurrency(totalBalance)}</div>
                        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                            <span className="badge badge-income" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <ArrowUpRight size={14} /> +2.5%
                            </span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>vs last month</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Monthly Income</span>
                            <ArrowUpRight size={20} className="text-success" color="var(--success)" />
                        </div>
                        <div className="stat-value">{formatCurrency(monthlyIncome)}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Monthly Expenses</span>
                            <ArrowDownRight size={20} style={{ color: 'var(--danger)' }} />
                        </div>
                        <div className="stat-value">{formatCurrency(monthlyExpense)}</div>
                    </motion.div>
                </div>

                {/* Charts Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="card"
                    style={{ marginBottom: '1.5rem', padding: '1.5rem' }}
                >
                    <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.25rem' }}>Cash Flow Analysis</h3>
                    <OverviewChart />
                </motion.div>

                {/* Transactions & AI */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Recent Transactions</h3>
                        </div>
                        <div>
                            {transactions.map((t, index) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    className="transaction-item"
                                >
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: t.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {t.type === 'income' ? <ArrowUpRight size={20} color="var(--success)" /> : <ArrowDownRight size={20} color="var(--danger)" />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{t.description}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                                {t.category} • {t.date}
                                                {t.isRecurring && <span style={{ marginLeft: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}><Repeat size={12} /> Recurring</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ fontWeight: 600, color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)' }}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => startEdit(t)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                                className="hover:opacity-100"
                                                title="Edit"
                                                aria-label="Edit transaction"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteTransaction(t.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.5 }}
                                                className="hover:opacity-100"
                                                title="Delete"
                                                aria-label="Delete transaction"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {transactions.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem 2rem',
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: '0.5rem',
                                    marginTop: '1rem'
                                }}>
                                    <div style={{
                                        width: '48px', height: '48px',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1rem'
                                    }}>
                                        <Plus size={24} color="var(--text-muted)" />
                                    </div>
                                    <h4 style={{ margin: '0 0 0.5rem', color: 'var(--text-main)' }}>No transactions yet</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Start tracking your finances by adding your first transaction.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="card"
                        style={{ background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 100%)', borderColor: 'var(--primary-glow)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Sparkles size={20} style={{ color: '#60a5fa' }} />
                            <h3 style={{ margin: 0 }}>AI Insights</h3>
                        </div>
                        <p style={{ lineHeight: '1.6', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            {aiLoading ? "Analyzing your latest financial data..." : "Based on your spending patterns, you could save approximately " + formatCurrency(240) + " this month by optimizing your tech subscriptions."}
                        </p>
                        {!aiLoading && (
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.75rem' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Action Items</div>
                                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    <li style={{ marginBottom: '0.5rem' }}>Review unused SaaS tools</li>
                                    <li>Consolidate cloud storage</li>
                                </ul>
                            </div>
                        )}
                        <button
                            className="btn"
                            onClick={refreshAiInsights}
                            disabled={aiLoading}
                            style={{ width: '100%', marginTop: '1.5rem', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            {aiLoading ? <RefreshCw size={18} className="animate-spin" /> : 'Generate Full Report'}
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
