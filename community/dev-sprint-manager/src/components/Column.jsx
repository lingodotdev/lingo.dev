import React from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const Column = ({ title, tasks, status, color, onAddTask, locale }) => {
    return (
        <div className="kanban-column glass-panel-enhanced">
            {/* Column Header */}
            <div className="column-header">
                <div className="flex items-center gap-3">
                    <div
                        className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                        style={{ backgroundColor: color }}
                    />
                    <h2 className="column-title">
                        {/* Demonstrate Lingo Override if title contains 'To Do' */}
                        {title === 'To Do' ? (
                            <div className="inline-flex items-center gap-1">
                                <div className="tooltip-wrapper group">
                                    <span
                                        data-lingo-override="Sprint Backlog"
                                        className="lingo-override-text"
                                    >
                                        To Do
                                    </span>

                                    {/* Pulse Effect */}
                                    <span className="tooltip-pulse-container">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                    </span>

                                    {/* Enhanced Tooltip */}
                                    <div className="lingo-tooltip">
                                        <div className="tooltip-header">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                                            <span className="tooltip-title">Lingo Logic</span>
                                        </div>
                                        <div className="tooltip-body">
                                            <p className="text-slate-400">Contextual ambiguity detected.</p>
                                            <div className="tooltip-code-block">
                                                <span className="block text-[10px] text-purple-300 mb-1">Override Applied:</span>
                                                <span className="text-white font-mono">"Sprint Backlog"</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            title
                        )}
                    </h2>
                </div>
                <span className="column-count">
                    {tasks.length}
                </span>
            </div>

            {/* Tasks Container */}
            <div className="task-list custom-scrollbar">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} locale={locale} />
                ))}
            </div>

            {/* Footer Action */}
            <div className="p-3 pt-0">
                <button
                    onClick={onAddTask}
                    className="add-task-btn group interactive-enhanced"
                >
                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Add Task</span>
                </button>
            </div>
        </div>
    );
};

export default Column;
