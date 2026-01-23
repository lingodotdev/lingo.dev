'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import { Transaction } from '../types';

interface OverviewChartProps {
    transactions: Transaction[];
    onAddTransaction: () => void;
}

const EMPTY_DATA = [
    { name: 'Jan', amount: 0 },
    { name: 'Feb', amount: 0 },
    { name: 'Mar', amount: 0 },
    { name: 'Apr', amount: 0 },
    { name: 'May', amount: 0 },
    { name: 'Jun', amount: 0 },
    { name: 'Jul', amount: 0 },
];

const buildChartData = (transactions: Transaction[]) => {
    if (transactions.length === 0) return EMPTY_DATA;
    const totals = new Map<string, number>();
    for (const tx of transactions) {
        // Simple month extraction (assuming current year or generic year for demo)
        // For a robust app, we'd handle years, but this matches the demo scope
        const date = new Date(tx.date);
        if (isNaN(date.getTime())) continue; // Skip invalid dates
        const month = date.toLocaleString('en-US', { month: 'short' });

        // Income adds to height, expense could reduce it or we just track "Net" or "Income"
        // The original mock had positive values. Let's assume we want to show "Cash Flow" (Net) 
        // or just "Income" vs "Expense". The AreaChart usually shows one value.
        // The review suggested: "derive aggregated monthly amounts".
        // Let's do Net Amount (Income - Expense).
        const signedAmount = tx.type === 'expense' ? -tx.amount : tx.amount;
        totals.set(month, (totals.get(month) ?? 0) + signedAmount);
    }

    // Map EMPTY_DATA names to the calculated totals to preserve order/labels
    // We might want to ensure we don't have negative values if the chart doesn't support them well 
    // (AreaChart base is usually 0).
    return EMPTY_DATA.map(({ name }) => {
        const val = totals.get(name) ?? 0;
        return { name, amount: val };
    });
};

export function OverviewChart({ transactions, onAddTransaction }: OverviewChartProps) {
    const hasData = transactions.length > 0;
    const chartData = buildChartData(transactions);

    return (
        <div style={{ width: '100%', height: 300, position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#a1a1aa', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                    />
                    <defs>
                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={hasData ? "#3b82f6" : "#333"} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={hasData ? "#3b82f6" : "#333"} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={hasData ? "#3b82f6" : "#444"}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAmount)"
                    />
                </AreaChart>
            </ResponsiveContainer>

            {/* Empty State Overlay */}
            {!hasData && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(20, 20, 20, 0.8)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                    <div>
                        <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', color: 'white' }}>Start Tracking</h4>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Add a transaction to see your cash flow.</p>
                    </div>
                    <button
                        onClick={onAddTransaction}
                        style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem'
                        }}
                    >
                        <Plus size={16} /> Add Transaction
                    </button>
                </div>
            )}
        </div>
    );
}
