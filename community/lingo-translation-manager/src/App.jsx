import React, { useState, useEffect } from 'react';
import { Globe, Languages, FileText, Download, Upload, Play, CheckCircle, AlertCircle, Sparkles, Code, Eye, Settings, Search, Filter, Plus, X, Save, RefreshCw } from 'lucide-react';

const LingoDevTranslationManager = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [translations, setTranslations] = useState({
    en: {
      'app.welcome': 'Welcome to our application',
      'app.description': 'This is a powerful tool for managing translations',
      'button.submit': 'Submit',
      'button.cancel': 'Cancel',
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.contact': 'Contact'
    },
    es: {
      'app.welcome': 'Bienvenido a nuestra aplicación',
      'app.description': 'Esta es una herramienta poderosa para gestionar traducciones',
      'button.submit': 'Enviar',
      'button.cancel': 'Cancelar',
      'nav.home': 'Inicio',
      'nav.about': 'Acerca de',
      'nav.contact': 'Contacto'
    },
    fr: {
      'app.welcome': 'Bienvenue dans notre application',
      'app.description': 'Ceci est un outil puissant pour gérer les traductions',
      'button.submit': 'Soumettre',
      'button.cancel': 'Annuler',
      'nav.home': 'Accueil',
      'nav.about': 'À propos',
      'nav.contact': 'Contact'
    }
  });
  
  const [selectedLang, setSelectedLang] = useState('en');
  const [previewLang, setPreviewLang] = useState('en');
  const [searchTerm, setSearchTerm] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [missingTranslations, setMissingTranslations] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  useEffect(() => {
    checkMissingTranslations();
  }, [translations]);

  const checkMissingTranslations = () => {
    const allKeys = new Set();
    Object.values(translations).forEach(lang => {
      Object.keys(lang).forEach(key => allKeys.add(key));
    });

    const missing = [];
    Object.keys(translations).forEach(lang => {
      allKeys.forEach(key => {
        if (!translations[lang][key] === undefined) {
          missing.push({ lang, key });
        }
      });
    });
    setMissingTranslations(missing);
  };

  const addNewTranslation = () => {
    if (!newKey || !newValue) return;
    
    const updated = { ...translations };
    updated[selectedLang] = {
      ...updated[selectedLang],
      [newKey]: newValue
    };
    setTranslations(updated);
    setNewKey('');
    setNewValue('');
    setShowAddModal(false);
  };

  const updateTranslation = (lang, key, value) => {
    const updated = { ...translations };
    updated[lang] = {
      ...updated[lang],
      [key]: value
    };
    setTranslations(updated);
  };

  const deleteTranslation = (key) => {
    const updated = {};
  Object.keys(translations).forEach(lang => {
    const { [key]: _, ...rest } = translations[lang];
    updated[lang] = rest;
  });
    setTranslations(updated);
  };

  const generateAiSuggestion = (key, sourceLang, targetLang) => {
    const sourceText = translations[sourceLang][key];
     if (!sourceText) return;
    const suggestion = `[AI] ${sourceText} (${targetLang})`;
    setAiSuggestions(prev => ({
      ...prev,
      [`${targetLang}-${key}`]: suggestion
    }));
  };

  const exportTranslations = () => {
  let dataStr;

  if (exportFormat === 'json') {
    dataStr = JSON.stringify(translations, null, 2);
  } else if (exportFormat === 'yaml') {
    // Simple YAML-like output (safe for demo)
    dataStr = Object.entries(translations)
      .map(
        ([lang, keys]) =>
          `${lang}:\n${Object.entries(keys)
            .map(([k, v]) => `  ${k}: "${v}"`)
            .join('\n')}`
      )
      .join('\n\n');
  } else {
    // properties format
    dataStr = Object.entries(translations)
      .map(
        ([lang, keys]) =>
          `# ${lang.toUpperCase()}\n${Object.entries(keys)
            .map(([k, v]) => `${k}=${v}`)
            .join('\n')}`
      )
      .join('\n\n');
  }

  const blob = new Blob([dataStr], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `translations.${exportFormat}`;
  document.body.appendChild(link);
  link.click();

  // ✅ cleanup (IMPORTANT)
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


  const filteredKeys = Object.keys(translations[selectedLang] || {}).filter(key =>
    key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (translations[selectedLang][key] || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DemoPreview = () => {
    const t = translations[previewLang] || translations.en;
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <nav className="bg-indigo-600 text-white p-4 flex gap-6">
            <span className="hover:text-indigo-200 cursor-pointer">{t['nav.home']}</span>
            <span className="hover:text-indigo-200 cursor-pointer">{t['nav.about']}</span>
            <span className="hover:text-indigo-200 cursor-pointer">{t['nav.contact']}</span>
          </nav>
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{t['app.welcome']}</h1>
            <p className="text-gray-600 mb-6">{t['app.description']}</p>
            <div className="flex gap-4">
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                {t['button.submit']}
              </button>
              <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">
                {t['button.cancel']}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl">
                <Globe className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Lingo.dev Translation Manager</h1>
                <p className="text-gray-600">Visual translation editor with AI assistance & live preview</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
  onClick={exportTranslations}
  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
>
                <Download size={18} />
                Export
              </button>
              <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                <Upload size={18} />
                Import
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Languages</p>
                <p className="text-2xl font-bold text-gray-800">{Object.keys(translations).length}</p>
              </div>
              <Languages className="text-indigo-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Translation Keys</p>
                <p className="text-2xl font-bold text-gray-800">{Object.keys(translations.en || {}).length}</p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Complete</p>
                <p className="text-2xl font-bold text-green-600">
  {(() => {
    const total =
      Object.keys(translations).length *
      Object.keys(translations.en || {}).length;

    return total > 0
      ? Math.round((1 - missingTranslations.length / total) * 100)
      : 0;
  })()}%
</p>

              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Missing</p>
                <p className="text-2xl font-bold text-orange-600">{missingTranslations.length}</p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'editor'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Code size={20} />
              Translation Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Eye size={20} />
              Live Preview
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'ai'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Sparkles size={20} />
              AI Assistant
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'export'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings size={20} />
              Export Settings
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'editor' && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search translations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Plus size={20} />
                    Add Key
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredKeys.map((key) => (
                    <div key={key} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-mono text-gray-600 mb-2">{key}</p>
                          <input
                            type="text"
                            value={translations[selectedLang][key] || ''}
                            onChange={(e) => updateTranslation(selectedLang, key, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          />
                          {aiSuggestions[`${selectedLang}-${key}`] && (
  <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded-lg">
    <p className="text-sm text-purple-700">
      🤖 Suggestion: {aiSuggestions[`${selectedLang}-${key}`]}
    </p>

    <button
      onClick={() =>
        updateTranslation(
          selectedLang,
          key,
          aiSuggestions[`${selectedLang}-${key}`]
        )
      }
      className="mt-1 text-xs text-purple-600 hover:underline"
    >
      Apply suggestion
    </button>
  </div>
)}

                        </div>
                        <button
                          onClick={() => deleteTranslation(key)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Language
                  </label>
                  <select
                    value={previewLang}
                    onChange={(e) => setPreviewLang(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <DemoPreview />
              </div>
            )}

            {activeTab === 'ai' && (
              <div>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6 border border-purple-200">
                  <div className="flex items-start gap-4">
                    <Sparkles className="text-purple-600 mt-1" size={24} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Translation Assistance</h3>
                      <p className="text-gray-600 mb-4">
                        Get intelligent translation suggestions and automatically fill missing translations using AI.
                      </p>
                      <button 
  onClick={() => missingTranslations.forEach(item => generateAiSuggestion(item.key, 'en', item.lang))}
 className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
>
                        <RefreshCw size={18} />
                        Generate Missing Translations
                      </button>
                    </div>
                  </div>
                </div>

                {missingTranslations.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 mb-3">Missing Translations</h4>
                    {missingTranslations.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm text-gray-600">{item.key}</p>
                            <p className="text-sm text-gray-500">Missing in: {item.lang.toUpperCase()}</p>
                          </div>
                          <button
                            onClick={() => generateAiSuggestion(item.key, 'en', item.lang)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                          >
                            <Sparkles size={16} />
                            Suggest
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                    <p className="text-gray-600">All translations are complete! 🎉</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'export' && (
              <div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    value={exportFormat}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="json">JSON</option>
                    <option value="properties">Properties</option>
                    <option value="yaml">YAML</option>
                  </select>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 mb-6 text-white font-mono text-sm overflow-x-auto">
                  <pre>{exportFormat === 'json' ? JSON.stringify(translations, null, 2) : 'Preview for other formats...'}</pre>
                </div>

                <button
                  onClick={exportTranslations}
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Translations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Translation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Translation Key</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g., button.save"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value ({selectedLang.toUpperCase()})</label>
                <input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter translation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={addNewTranslation}
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LingoDevTranslationManager;