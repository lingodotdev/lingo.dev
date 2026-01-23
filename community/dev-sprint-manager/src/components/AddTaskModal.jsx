import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag } from 'lucide-react';
import { getUITranslations } from '../lib/translations';

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialStatus, locale = 'en' }) => {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('medium');
    const [estimate, setEstimate] = useState(1);
    const [tag, setTag] = useState('');
    const [translations, setTranslations] = useState({});

    // Load translations when locale changes
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const uiTranslations = await getUITranslations(locale);
                setTranslations(uiTranslations);
            } catch (error) {
                console.error('Failed to load translations:', error);
            }
        };
        
        loadTranslations();
    }, [locale]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({ title, priority, estimate, tag, status: initialStatus });
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setPriority('medium');
        setEstimate(1);
        setTag('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-backdrop"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="modal-enhanced"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <h3 className="modal-title">{translations.addTask || 'New Task'}</h3>
                        <button onClick={onClose} className="modal-close-btn">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">{translations.taskTitle || 'Task Title'}</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="What needs to be done?"
                                    autoFocus
                                    className="form-input-enhanced focus-enhanced"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <div className="priority-selector">
                                    {['low', 'medium', 'high'].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`priority-option ${priority === p ? `selected-${p}` : ''}`}
                                            onClick={() => setPriority(p)}
                                        >
                                            {p.charAt(0).toUpperCase() + p.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="form-group flex-1">
                                    <label className="form-label">Estimate (Hours)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={estimate === null ? '' : estimate}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setEstimate(value === '' ? null : parseFloat(value));
                                            }}
                                            className="form-input-enhanced focus-enhanced"
                                            style={{ paddingLeft: '2.5rem' }}
                                        />
                                        <Calendar size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>
                                <div className="form-group flex-1">
                                    <label className="form-label">Tag</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tag}
                                            onChange={(e) => setTag(e.target.value)}
                                            placeholder="Feature, Bug..."
                                            className="form-input-enhanced focus-enhanced"
                                            style={{ paddingLeft: '2.5rem' }}
                                        />
                                        <Tag size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" onClick={onClose} className="btn-cancel interactive-enhanced">
                                {translations.cancel || 'Cancel'}
                            </button>
                            <button type="submit" disabled={!title.trim()} className="btn-submit btn-enhanced">
                                {translations.addTask || 'Create Task'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddTaskModal;
