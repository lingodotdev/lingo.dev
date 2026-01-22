import React, { useState, useEffect } from 'react';
import KanbanBoard from './components/KanbanBoard';
import Chat from './components/Chat';
import { Layout, MessageCircle, Command } from 'lucide-react';
import { getUITranslations } from './lib/translations';
import { triggerCLITranslation, checkCLIStatus } from './lib/cliIntegration';


/* Lingo Compiler Log Component - Inlined into App for state access */


function App() {
  const [activeTab, setActiveTab] = useState('board');
  const [loading, setLoading] = useState(false);
  const [lingoLocale, setLingoLocale] = useState('en');
  const [translations, setTranslations] = useState({});
  const [compilerLogs, setCompilerLogs] = useState([
    { text: '> Initializing Real-time Translator...', color: 'text-slate-500' },
  ]);

  useEffect(() => {
    // Initial Lingo Scan
    const sequence = [
      { text: '> Initializing real-time translation engine...', color: 'text-slate-400', delay: 800 },
      { text: '> "To Do" detected (Contextual)', color: 'text-yellow-400', delay: 1800 },
      { text: '> Reading data-lingo-override...', color: 'text-purple-400', delay: 2800 },
      { text: '✔ Applied: "Sprint Backlog"', color: 'text-green-400', delay: 3500 },
      { text: '> Real-time translation ready.', color: 'text-slate-500', delay: 4500 },
    ];

    // Simple log runner
    let timeouts = [];
    sequence.forEach((item) => {
      timeouts.push(setTimeout(() => {
        setCompilerLogs(prev => [...prev.slice(-4), item]);
      }, item.delay));
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Load initial translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const initialTranslations = await getUITranslations(lingoLocale);
        setTranslations(initialTranslations);
      } catch (error) {
        console.error('Failed to load initial translations:', error);
      }
    };
    
    loadTranslations();
  }, []);

  const handleLocaleChange = async (locale) => {
    setLingoLocale(locale);

    setCompilerLogs(prev => [
      ...prev.slice(-3),
      { text: `> Switching to real-time ${locale.toUpperCase()} translation...`, color: 'text-blue-400' },
      { text: `> No locale packs needed - translating on-demand...`, color: 'text-slate-400' }
    ]);

    try {
      // Check if real-time translation service is available
      const serviceAvailable = await checkCLIStatus();
      if (!serviceAvailable) {
        throw new Error('Translation service not available');
      }

      // Trigger real-time translation setup
      const setupSuccess = await triggerCLITranslation(locale);
      if (!setupSuccess) {
        throw new Error('Real-time translation setup failed');
      }

      setCompilerLogs(prev => [
        ...prev.slice(-4),
        { text: `✔ Real-time translation active for ${locale.toUpperCase()}`, color: 'text-green-400' }
      ]);

      // Get real translations from Lingo.dev API (no locale packs)
      const newTranslations = await getUITranslations(locale);
      setTranslations(newTranslations);
      
      setTimeout(() => {
        setCompilerLogs(prev => [
          ...prev.slice(-4),
          { text: `✔ Interface translated via real-time Lingo.dev API.`, color: 'text-green-400' }
        ]);
      }, 800);
    } catch (error) {
      console.error('Real-time translation failed:', error);
      setCompilerLogs(prev => [
        ...prev.slice(-4),
        { text: `✖ Real-time translation failed - API unavailable.`, color: 'text-red-400' }
      ]);
      
      // Keep interface in English if API fails
      setTranslations({
        board: 'Board',
        chat: 'Chat',
        todo: 'To Do',
        inprogress: 'In Progress',
        review: 'Review',
        done: 'Done',
        sprintBoard: 'Sprint Board',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        addTask: 'Add Task',
        taskTitle: 'Task Title',
        taskDescription: 'Task Description'
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-spinner"></div>
          <span className="loading-text">Loading Dev-Sprint...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div>
          {/* Logo Area */}
          <div className="sidebar-logo-area">
            <div className="logo-icon">
              <Command size={20} className="text-white" />
            </div>
            <span className="logo-text">Dev-Sprint</span>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
            <NavItemEnhanced
              icon={<Layout size={20} />}
              label={translations.board || 'Board'}
              active={activeTab === 'board'}
              onClick={() => setActiveTab('board')}
            />
            <NavItemEnhanced
              icon={<MessageCircle size={20} />}
              label={translations.chat || 'Chat'}
              active={activeTab === 'chat'}
              onClick={() => setActiveTab('chat')}
            />
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="sidebar-footer">
          {/* Lingo Locale Switcher */}
          <div className="mb-6 px-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              Global Locale
            </div>
            <div className="language-selector-enhanced">
              {['en', 'hi', 'es', 'fr', 'ja'].map((l) => (
                <button
                  key={l}
                  onClick={() => handleLocaleChange(l)}
                  className={`language-btn-enhanced ${lingoLocale === l ? 'active' : ''}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Simulated Lingo Compiler Status */}
          <div className="compiler-status-enhanced">
            <div className="compiler-header">
              <div className="status-indicator-enhanced">
                <div className="status-dot-enhanced"></div>
              </div>
              <h4>Real-time Translator</h4>
            </div>
            <div className="compiler-log">
              {compilerLogs.map((log, i) => (
                <div key={i} className={`log-line ${log.color} animate-pulse`}>
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <div className="flex flex-col">
              <h1 className="page-title">
                {activeTab === 'board' ? (translations.sprintBoard || 'Sprint Board') : 
                 activeTab === 'chat' ? (translations.chat || 'Team Chat') :
                 activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
              <div className="breadcrumb">
                <span>Workspace</span>
                <span className="dot"></span>
                <span className="text-slate-300">Lingo Fullstack</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <div className="user-avatar-container">
              <img
                src="https://i.pravatar.cc/150?u=demo-user"
                alt="User"
                className="user-avatar"
              />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="app-content">
          <div className="content-container">
            {activeTab === 'board' && <KanbanBoard locale={lingoLocale} />}
            {activeTab === 'chat' && <Chat isWidget={false} locale={lingoLocale} />}
          </div>
        </div>
      </main>

      {/* Floating Chat Widget - Only show if not on chat page */}
      {activeTab !== 'chat' && <Chat isWidget={true} locale={lingoLocale} />}
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`nav-item ${active ? 'active' : ''}`}
  >
    {React.cloneElement(icon, {
      size: 20,
      className: `nav-icon ${active ? 'active' : ''}`
    })}
    <span className="nav-label">{label}</span>
    {active && <div className="nav-active-indicator"></div>}
  </button>
);

const NavItemEnhanced = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`nav-item-enhanced ${active ? 'active' : ''}`}
  >
    {React.cloneElement(icon, {
      size: 20,
      className: `nav-icon ${active ? 'active' : ''}`
    })}
    <span className="nav-label">{label}</span>
  </button>
);

export default App;
