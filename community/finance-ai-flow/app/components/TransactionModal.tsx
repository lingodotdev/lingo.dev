'use client';

import { useState, useEffect } from 'react';
import { X, ScanLine, Loader2, Camera } from 'lucide-react';
import { Transaction } from '../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<Transaction, 'id'>) => void;
    initialData?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, onSubmit, initialData }: ModalProps) {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: 'General',
        isRecurring: false,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        receiptUrl: ''
    });

    const [isScanning, setIsScanning] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description,
                amount: initialData.amount.toString(),
                type: initialData.type,
                category: initialData.category,
                isRecurring: initialData.isRecurring || false,
                date: initialData.date,
                time: initialData.time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                receiptUrl: initialData.receiptUrl || ''
            });
        } else {
            setFormData({
                description: '',
                amount: '',
                type: 'expense',
                category: 'General',
                isRecurring: false,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
                receiptUrl: ''
            });
        }
    }, [initialData, isOpen]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            simulateScanning();
        }
    };

    const simulateScanning = () => {
        setIsScanning(true);
        // Simulate AI processing delay
        setTimeout(() => {
            setIsScanning(false);
            setFormData(prev => ({
                ...prev,
                description: 'Whole Foods Market',
                amount: '84.50',
                category: 'Groceries',
                type: 'expense',
                date: new Date().toISOString().split('T')[0],
                receiptUrl: 'scanned_receipt_mock.jpg'
            }));
        }, 2000);
    };

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: Number(formData.amount),
            type: formData.type as 'income' | 'expense',
        });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', margin: '2rem', background: '#0a0a0b', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0 }}>{initialData ? 'Edit Transaction' : 'Add Transaction'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {/* AI Receipt Scanning Area */}
                {!initialData && (
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={simulateScanning}
                        style={{
                            border: `2px dashed ${dragActive ? 'var(--primary)' : 'var(--border-color)'}`,
                            background: dragActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255,255,255,0.02)',
                            borderRadius: '0.75rem',
                            padding: '1.5rem',
                            textAlign: 'center',
                            marginBottom: '1.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {isScanning ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                                <Loader2 size={32} className="animate-spin" />
                                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>AI analyzing receipt...</span>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    width: '40px', height: '40px',
                                    background: 'var(--bg-main)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 0.75rem',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <Camera size={20} color="var(--primary)" />
                                </div>
                                <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.875rem' }}>Auto-fill with AI</h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Drop a receipt here to extract details
                                </p>
                                {formData.receiptUrl && <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}><ScanLine size={12} /> Scan Complete</div>}
                            </>
                        )}
                        {/* Scan Line Animation */}
                        {isScanning && (
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                                background: 'var(--primary)',
                                boxShadow: '0 0 10px var(--primary)',
                                animation: 'scan 1.5s infinite linear'
                            }} />
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                        <input
                            className="input"
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g. Netflix Subscription"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="input"
                                required
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Type</label>
                            <select
                                className="input"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Category</label>
                        <input
                            className="input"
                            required
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            placeholder="e.g. Food, Tech, Business"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
                            <input
                                type="date"
                                className="input"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Time</label>
                            <input
                                type="time"
                                className="input"
                                required
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={formData.isRecurring}
                                onChange={e => setFormData({ ...formData, isRecurring: e.target.checked })}
                            />
                            <span>This is a recurring transaction</span>
                        </label>
                    </div>

                    <button type="submit" className="btn" style={{ width: '100%' }}>
                        {initialData ? 'Save Changes' : 'Add Transaction'}
                    </button>
                </form>
            </div>
            <style jsx>{`
                @keyframes scan {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            `}</style>
        </div>
    );
}
