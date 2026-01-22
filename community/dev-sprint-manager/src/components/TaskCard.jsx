import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertCircle, BarChart2 } from 'lucide-react';
import { translateTextRealtime } from '../lib/translations';

const TaskCard = ({ task, locale }) => {
    const [translatedTitle, setTranslatedTitle] = useState(task.title);
    const [translatedTag, setTranslatedTag] = useState(task.tag);
    const priorityColor = getPriorityColor(task.priority);
    const isHighPriority = task.priority === 'high';

    // Real-time translation of task content
    useEffect(() => {
        const translateContent = async () => {
            if (locale === 'en') {
                setTranslatedTitle(task.title);
                setTranslatedTag(task.tag);
                return;
            }

            try {
                const [titleTranslated, tagTranslated] = await Promise.all([
                    translateTextRealtime(task.title, locale),
                    translateTextRealtime(task.tag, locale)
                ]);
                
                setTranslatedTitle(titleTranslated);
                setTranslatedTag(tagTranslated);
            } catch (error) {
                console.warn('Real-time translation failed for task:', error);
                // Keep original text if translation fails
                setTranslatedTitle(task.title);
                setTranslatedTag(task.tag);
            }
        };

        translateContent();
    }, [task.title, task.tag, locale]);

    const getCriticalLabel = async () => {
        if (locale === 'en') return 'CRITICAL';
        
        try {
            return await translateTextRealtime('CRITICAL', locale);
        } catch (error) {
            return 'CRITICAL';
        }
    };

    const [criticalLabel, setCriticalLabel] = useState('CRITICAL');

    useEffect(() => {
        if (isHighPriority) {
            getCriticalLabel().then(setCriticalLabel);
        }
    }, [locale, isHighPriority]);

    return (
        <motion.div
            layoutId={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -4,
                boxShadow: `0 10px 30px -10px ${priorityColor}40`,
                borderColor: 'rgba(255,255,255,0.2)'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="task-card-enhanced group interactive-enhanced"
            style={{
                padding: '1.25rem',
            }}
        >
            {/* Priority Indicator Stripe */}
            <div
                className="priority-stripe"
                style={{ backgroundColor: priorityColor }}
            />

            <div className="task-header mb-3 pl-2">
                <span className="task-id">
                    {task.id.slice(0, 8)}
                </span>
                {isHighPriority && (
                    <div className="critical-badge animate-pulse-slow">
                        <AlertCircle size={10} />
                        <span>{criticalLabel}</span>
                    </div>
                )}
            </div>

            <h3 className="task-title">
                {translatedTitle}
            </h3>

            <div className="task-footer">
                <div className="flex items-center gap-3">
                    <div className="meta-item group-hover:text-slate-300">
                        <Clock size={12} />
                        <span>{task.estimate}h</span>
                    </div>
                    {task.tag && (
                        <div className="meta-item group-hover:text-slate-400">
                            <BarChart2 size={12} />
                            <span>{translatedTag}</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center -space-x-2">
                    {/* Placeholder for assignees */}
                    <div className="assignee-avatar">
                        DS
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const getPriorityColor = (p) => {
    switch (p) {
        case 'high': return '#ec4899'; // Pink 500
        case 'medium': return '#eab308'; // Yellow 500
        case 'low': return '#3b82f6'; // Blue 500
        default: return '#64748b'; // Slate 500
    }
};

export default TaskCard;
