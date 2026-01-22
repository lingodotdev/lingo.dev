'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Account } from '../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Account, 'id'>) => void;
}

export function AccountModal({ isOpen, onClose, onSubmit }: ModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        balance: '',
        type: 'checking'
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name: formData.name,
            balance: Number(formData.balance),
            type: formData.type as 'checking' | 'savings' | 'credit'
        });
        onClose();
        setFormData({ name: '', balance: '', type: 'checking' });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem', margin: '2rem', background: '#0a0a0b', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>Add Account</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Account Name</label>
                        <input
                            className="input"
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Travel Savings"
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Initial Balance</label>
                        <input
                            type="number"
                            step="0.01"
                            className="input"
                            required
                            value={formData.balance}
                            onChange={e => setFormData({ ...formData, balance: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                        <select
                            className="input"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                            <option value="credit">Credit Card</option>
                        </select>
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%' }}>
                        Create Account
                    </button>
                </form>
            </div>
        </div>
    );
}
