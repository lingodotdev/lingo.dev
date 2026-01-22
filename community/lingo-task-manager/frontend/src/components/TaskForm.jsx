import { useState } from 'react';
import axios from 'axios';
import { translations } from '../locales/translations';

function TaskForm({ language, onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:3001/api/tasks', {
        title,
        description,
        priority
      }, {
        headers: { 'Accept-Language': language }
      });

      setTitle('');
      setDescription('');
      setPriority('medium');
      onTaskCreated();
    } catch (error) {
      alert(t.errorCreating);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.taskTitle}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder={t.taskTitlePlaceholder}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.taskDescription}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder={t.taskDescriptionPlaceholder}
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.priority}
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="low">{t.priorityLow}</option>
          <option value="medium">{t.priorityMedium}</option>
          <option value="high">{t.priorityHigh}</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 font-medium"
      >
        {loading ? t.creating : t.createTask}
      </button>
    </form>
  );
}

export default TaskForm;