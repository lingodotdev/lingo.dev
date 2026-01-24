import React, { useState, useEffect } from 'react';
import {
  Globe, Languages, FileText, Download, Upload,
  CheckCircle, AlertCircle, Sparkles, Code,
  Eye, Settings, Search, Plus, X, RefreshCw
} from 'lucide-react';

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
  const [exportFormat, setExportFormat] = useState('json');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');

  /** ✅ DATA-DRIVEN LANGUAGES (IMPORTANT FIX) */
  const languageOptions = Object.keys(translations);

  /** ✅ KEEP SELECTED LANG VALID */
  useEffect(() => {
    if (!languageOptions.includes(selectedLang)) {
      setSelectedLang(languageOptions[0] || 'en');
    }
    if (!languageOptions.includes(previewLang)) {
      setPreviewLang(languageOptions[0] || 'en');
    }
  }, [translations]);

  useEffect(() => {
    checkMissingTranslations();
  }, [translations]);

  const checkMissingTranslations = () => {
    const allKeys = new Set();
    Object.values(translations).forEach(lang =>
      Object.keys(lang).forEach(k => allKeys.add(k))
    );

    const missing = [];
    Object.keys(translations).forEach(lang => {
      allKeys.forEach(key => {
        if (translations[lang][key] === undefined) {
          missing.push({ lang, key });
        }
      });
    });

    setMissingTranslations(missing);
  };

  const updateTranslation = (lang, key, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: { ...prev[lang], [key]: value }
    }));
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
    const sourceText = translations[sourceLang]?.[key];
    if (!sourceText) return;

    setAiSuggestions(prev => ({
      ...prev,
      [`${targetLang}-${key}`]: `[AI] ${sourceText} (${targetLang})`
    }));
  };

  /** =========================
   * ✅ IMPORT HANDLER (FIXED)
   * ========================= */
  const handleImport = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);

        if (!imported || typeof imported !== 'object') {
          throw new Error('Invalid translation file');
        }

        setTranslations(imported);

        const langs = Object.keys(imported);
        if (!langs.includes(selectedLang)) {
          setSelectedLang(langs[0] || 'en');
        }

        setImportSuccess('Translations imported successfully!');
        setImportError('');
      } catch (err) {
        setImportError(err.message);
        setImportSuccess('');
      }
    };

    reader.readAsText(file);
  };

  /** =========================
   * EXPORT
   * ========================= */
  const exportTranslations = () => {
    let dataStr = '';

    if (exportFormat === 'json') {
      dataStr = JSON.stringify(translations, null, 2);
    } else if (exportFormat === 'yaml') {
      dataStr = Object.entries(translations)
        .map(([lang, keys]) =>
          `${lang}:\n${Object.entries(keys).map(([k, v]) => `  ${k}: "${v}"`).join('\n')}`
        ).join('\n\n');
    } else {
      dataStr = Object.entries(translations)
        .map(([lang, keys]) =>
          `# ${lang.toUpperCase()}\n${Object.entries(keys).map(([k, v]) => `${k}=${v}`).join('\n')}`
        ).join('\n\n');
    }

    const blob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `translations.${exportFormat}`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredKeys = Object.keys(translations[selectedLang] || {}).filter(
    key =>
      key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (translations[selectedLang][key] || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const DemoPreview = () => {
    const t = translations[previewLang] || translations[languageOptions[0]] || {};
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h1>{t['app.welcome']}</h1>
        <p>{t['app.description']}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-6">
          <button onClick={exportTranslations} className="bg-green-600 text-white px-4 py-2 rounded">
            Export
          </button>

          <input
            type="file"
            hidden
            id="import"
            accept=".json"
            onChange={e => handleImport(e.target.files[0])}
          />
          <button
            onClick={() => document.getElementById('import').click()}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Import
          </button>
        </div>

        {importError && <p className="text-red-600">{importError}</p>}
        {importSuccess && <p className="text-green-600">{importSuccess}</p>}

        {/* LANGUAGE SELECT */}
        <select
          value={selectedLang}
          onChange={e => setSelectedLang(e.target.value)}
          className="mb-4 p-2 border rounded"
        >
          {languageOptions.map(lang => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>

        {/* EDITOR */}
        {filteredKeys.map(key => (
          <div key={key} className="bg-white p-4 mb-2 rounded">
            <input
              value={translations[selectedLang][key] || ''}
              onChange={e => updateTranslation(selectedLang, key, e.target.value)}
              className="border p-2 w-full"
            />

            {aiSuggestions[`${selectedLang}-${key}`] && (
              <div className="mt-2 text-purple-600 text-sm">
                🤖 {aiSuggestions[`${selectedLang}-${key}`]}
                <button
                  className="ml-2 underline"
                  onClick={() => updateTranslation(selectedLang, key, aiSuggestions[`${selectedLang}-${key}`])}
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        ))}

        {/* PREVIEW */}
        {activeTab === 'preview' && <DemoPreview />}
      </div>
    </div>
  );
};

export default LingoDevTranslationManager;
