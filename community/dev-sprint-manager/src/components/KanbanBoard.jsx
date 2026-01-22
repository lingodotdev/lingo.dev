import React, { useState, useEffect } from 'react';
import Column from './Column';
import AddTaskModal from './AddTaskModal';
import { getUITranslations } from '../lib/translations';

const KanbanBoard = ({ locale = 'en' }) => {
    const [tasks, setTasks] = useState([
        // Demo tasks for project showcase
        {
            id: 'task-1',
            title: 'Design user authentication flow',
            status: 'todo',
            priority: 'high',
            estimate: 3,
            tag: 'Design',
            created_at: new Date().toISOString()
        },
        {
            id: 'task-2', 
            title: 'Implement API endpoints',
            status: 'inprogress',
            priority: 'medium',
            estimate: 5,
            tag: 'Backend',
            created_at: new Date().toISOString()
        },
        {
            id: 'task-3',
            title: 'Setup CI/CD pipeline',
            status: 'review',
            priority: 'low',
            estimate: 2,
            tag: 'DevOps',
            created_at: new Date().toISOString()
        },
        {
            id: 'task-4',
            title: 'Write unit tests',
            status: 'done',
            priority: 'medium',
            estimate: 4,
            tag: 'Testing',
            created_at: new Date().toISOString()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeColumn, setActiveColumn] = useState('todo');
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        // Demo mode - no real-time updates needed
        setLoading(false);
    }, []);

    const openAddTaskModal = (status) => {
        setActiveColumn(status);
        setIsModalOpen(true);
    };

    const handleCreateTask = async (taskData) => {
        try {
            const newTask = {
                id: `task-${Date.now()}`,
                title: taskData.title,
                status: taskData.status,
                priority: taskData.priority,
                estimate: taskData.estimate,
                tag: taskData.tag || 'General',
                created_at: new Date().toISOString()
            };
            
            setTasks(prev => [...prev, newTask]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error creating task:', error.message);
            alert('Could not create task.');
        }
    };

    // Load translations when locale changes
    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const uiTranslations = await getUITranslations(locale);
                setTranslations(uiTranslations);
            } catch (error) {
                console.error('Failed to load translations:', error);
                // Fallback to English
                setTranslations({
                    todo: 'To Do',
                    inprogress: 'In Progress', 
                    review: 'Review',
                    done: 'Done'
                });
            }
        };
        
        loadTranslations();
    }, [locale]);

    const columns = [
        { id: 'todo', title: translations.todo || 'To Do', color: 'var(--status-todo)' },
        { id: 'inprogress', title: translations.inprogress || 'In Progress', color: 'var(--status-progress)' },
        { id: 'review', title: translations.review || 'Review', color: 'var(--status-review)' },
        { id: 'done', title: translations.done || 'Done', color: 'var(--status-done)' },
    ];

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400">
                    <div className="spinner-enhanced"></div>
                    <span className="text-sm font-mono tracking-wide">{translations.loading || 'Syncing Board...'}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex overflow-x-auto pb-4 gap-6 h-full custom-scrollbar pl-1 pt-1">
                {columns.map(col => (
                    <Column
                        key={col.id}
                        title={col.title}
                        color={col.color}
                        status={col.id}
                        tasks={tasks.filter(t => t.status === col.id)}
                        onAddTask={() => openAddTaskModal(col.id)}
                        locale={locale}
                    />
                ))}
            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateTask}
                initialStatus={activeColumn}
                locale={locale}
            />
        </div>
    );
};

export default KanbanBoard;

