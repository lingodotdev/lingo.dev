// import { LucideIcon } from 'lucide-react';

export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    time: string;
    isRecurring?: boolean;
    receiptUrl?: string; // For AI Receipt Scanning
}

export interface Account {
    id: string;
    name: string;
    balance: number;
    type: 'checking' | 'savings' | 'credit';
}
