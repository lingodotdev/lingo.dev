import { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import LanguageSwitcher from './components/LanguageSwitcher';
import { translations } from './locales/translations';

function App() {
  const [language, setLanguage] = useState('en');
  const [refresh, setRefresh] = useState(0);
  const t = translations[language];

  const handleTaskCreated = () => {
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">{t.appTitle}</h1>
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
            <p className="text-purple-100 mt-2">{t.appSubtitle}</p>
          </div>

          <div className="p-6">
            <TaskForm language={language} onTaskCreated={handleTaskCreated} />
            <div className="mt-8">
              <TaskList language={language} refresh={refresh} onTaskChanged={handleTaskCreated} />
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-white text-sm">
          <p>{t.footer}</p>
        </div>
      </div>
    </div>
  );
}

export default App;