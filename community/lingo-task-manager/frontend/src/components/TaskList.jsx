import { useState, useEffect } from 'react';
import axios from 'axios';
import { translations } from '../locales/translations';

function TaskList({ language, refresh, onTaskChanged }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    fetchTasks();
  }, [language, refresh]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tasks', {
        headers: { 'Accept-Language': language }
      });
      setTasks(response.data.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await axios.put(
        `http://localhost:3001/api/tasks/${task.id}`,
        { completed: !task.completed },
        { headers: { 'Accept-Language': language } }
      );
      onTaskChanged();
    } catch (error) {
      alert(t.errorUpdating);
    }
  };

  const deleteTask = async (id) => {
    if (!confirm(t.confirmDelete)) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/tasks/${id}`, {
        headers: { 'Accept-Language': language }
      });
      onTaskChanged();
    } catch (error) {
      alert(t.errorDeleting);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">{t.loading}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">{t.noTasks}</div>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.yourTasks}</h2>
      {tasks.map(task => (
        <div
          key={task.id}
          className={`border rounded-lg p-4 transition-all ${
            task.completed ? 'bg-gray-50 opacity-60' : 'bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task)}
                className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <h3
                  className={`font-medium text-lg ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {t[`priority${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`]}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(task.createdAt).toLocaleDateString(language)}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              className="ml-2 text-red-500 hover:text-red-700 transition-colors"
              title={t.deleteTask}
            >
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;