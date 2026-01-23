import React, { useState, useCallback, useEffect } from 'react';
import { EditorPanel } from './components/EditorPanel';
import { LatencyBadge } from './components/LatencyBadge';
import { DemoScenarios } from './components/DemoScenarios';
import { useTranslation } from './hooks/useTranslation';
import { Sparkles, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { AddLanguageModal } from './components/AddLanguageModal';

function App() {
  const [leftContent, setLeftContent] = useState('Welcome to the Living Document. Whatever you type here, the world can understand instantly.');
  const [rightContent, setRightContent] = useState('');
  const [leftLang, setLeftLang] = useState('en');
  const [rightLang, setRightLang] = useState('es');
  const [lastEdited, setLastEdited] = useState('left'); // 'left' or 'right'
  const [isUpdating, setIsUpdating] = useState({ left: false, right: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [languages, setLanguages] = useState([
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Arabic', value: 'ar' },
  ]);

  const [fastMode, setFastMode] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [batchContents, setBatchContents] = useState({}); // { locale: text }
  const [batchLocales] = useState(['es', 'fr', 'ja', 'ar']);

  const { isTranslating, latency, progress, translate, batchTranslate, debouncedTranslate, debouncedBatchTranslate } = useTranslation();

  const handleLeftChange = useCallback((text) => {
    setLeftContent(text);
    setLastEdited('left');

    const opts = { sourceLocale: leftLang, fast: fastMode };

    if (batchMode) {
      debouncedBatchTranslate(text, batchLocales, (results) => {
        setBatchContents(results);
        if (results[rightLang]) {
          setRightContent(results[rightLang]);
        }
      }, opts);
    } else {
      debouncedTranslate(text, rightLang, (translatedText) => {
        setRightContent(translatedText);
        setIsUpdating({ left: false, right: true });
        setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
      }, opts);
    }
  }, [leftLang, rightLang, debouncedTranslate, debouncedBatchTranslate, batchMode, batchLocales, fastMode]);

  const handleRightChange = useCallback((text) => {
    setRightContent(text);
    setLastEdited('right');

    debouncedTranslate(text, leftLang, (translatedText) => {
      setLeftContent(translatedText);
      setIsUpdating({ left: true, right: false });
      setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
    }, { sourceLocale: rightLang, fast: fastMode });
  }, [leftLang, rightLang, debouncedTranslate, fastMode]);

  const handleScenarioSelect = (content) => {
    setLeftContent(content);
    setLastEdited('left');
    const opts = { sourceLocale: leftLang, fast: fastMode };

    if (batchMode) {
      batchTranslate(content, batchLocales, (results) => {
        setBatchContents(results);
        if (results[rightLang]) {
          setRightContent(results[rightLang]);
        }
      }, opts);
    } else {
      translate(content, rightLang, (translatedText) => {
        setRightContent(translatedText);
        setIsUpdating({ left: false, right: true });
        setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
      }, opts);
    }
  };

  // Re-translate when languages change or mode changes
  useEffect(() => {
    if (lastEdited === 'left' && leftContent) {
      const opts = { sourceLocale: leftLang, fast: fastMode };
      if (batchMode) {
        debouncedBatchTranslate(leftContent, batchLocales, (results) => {
          setBatchContents(results);
          if (results[rightLang]) {
            setRightContent(results[rightLang]);
          }
        }, opts);
      } else {
        debouncedTranslate(leftContent, rightLang, (translatedText) => {
          setRightContent(translatedText);
          setIsUpdating({ left: false, right: true });
          setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
        }, opts);
      }
    } else if (lastEdited === 'right' && rightContent) {
      debouncedTranslate(rightContent, leftLang, (translatedText) => {
        setLeftContent(translatedText);
        setIsUpdating({ left: true, right: false });
        setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
      }, { sourceLocale: rightLang, fast: fastMode });
    }
  }, [leftLang, rightLang, debouncedTranslate, debouncedBatchTranslate, fastMode, batchMode, batchTranslate, batchLocales]);

  const handleAddLanguage = useCallback((name, code) => {
    if (!name || !code) return;
    const langObj = { label: name, value: code };
    setLanguages(prev => {
      if (prev.find(l => l.value === code)) return prev;
      return [...prev, langObj];
    });
  }, []);

  // Initial translation for default text
  useEffect(() => {
    if (leftContent && !rightContent) {
      translate(leftContent, rightLang, (translatedText) => {
        setRightContent(translatedText);
        setIsUpdating({ left: false, right: true });
        setTimeout(() => setIsUpdating({ left: false, right: false }), 2000);
      }, { sourceLocale: leftLang, fast: fastMode });
    }
  }, []);

  const toggleBatchMode = () => {
    setBatchMode(!batchMode);
    if (!batchMode && leftContent) {
      batchTranslate(leftContent, batchLocales, (results) => {
        setBatchContents(results);
        if (results[rightLang]) {
          setRightContent(results[rightLang]);
        }
      }, { sourceLocale: leftLang, fast: fastMode });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white/90 selection:bg-pastel-blue/30 p-4 md:p-8 flex flex-col items-center">
      {/* Header Section */}
      <header className="max-w-6xl w-full mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-pastel-pink mb-6"
        >
          <Sparkles className="w-3 h-3" />
          The Living Document
        </motion.div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          <span className="bg-gradient-to-r from-pastel-pink to-pastel-purple bg-clip-text text-transparent">Write</span> in one language.<br />
          <span className="bg-gradient-to-r from-pastel-blue to-pastel-green bg-clip-text text-transparent">Read</span> in another.
        </h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium mb-8">
          The collaborative editor that preserves the soul of your words across borders.
          Powered by <span className="text-pastel-pink font-bold">Lingo.dev</span>
        </p>

        {/* Mode Toggles */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={() => setFastMode(!fastMode)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${fastMode
              ? 'bg-pastel-blue/10 border-pastel-blue/40 text-pastel-blue'
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
              }`}
          >
            {fastMode ? '⚡ Fast Mode Active' : '✨ Quality Mode'}
          </button>
          <button
            onClick={toggleBatchMode}
            className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-widest transition-all ${batchMode
              ? 'bg-pastel-purple/10 border-pastel-purple/40 text-pastel-purple'
              : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
              }`}
          >
            {batchMode ? '🌍 Multi-Language Active' : '🔄 Single Translation'}
          </button>
        </div>
      </header>

      {/* Main Translation Interface */}
      <main className="max-w-7xl w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch transition-all duration-500">
          <div className={batchMode ? "lg:col-span-2" : "flex-1"}>
            <EditorPanel
              content={leftContent}
              onChange={handleLeftChange}
              language={leftLang}
              onLanguageChange={setLeftLang}
              languages={languages}
              onOpenModal={() => setIsModalOpen(true)}
              isLastEdited={lastEdited === 'left'}
              isUpdating={isUpdating.left}
              isTranslating={isTranslating && lastEdited === 'right'}
              progress={progress}
              placeholder="Start typing in English..."
              accentColor="pink"
            />
          </div>

          {!batchMode ? (
            <div className="flex-1">
              <EditorPanel
                content={rightContent}
                onChange={handleRightChange}
                language={rightLang}
                onLanguageChange={setRightLang}
                languages={languages}
                onOpenModal={() => setIsModalOpen(true)}
                isLastEdited={lastEdited === 'right'}
                isUpdating={isUpdating.right}
                isTranslating={isTranslating && lastEdited === 'left'}
                progress={progress}
                placeholder="Traducción automática..."
                accentColor="blue"
              />
            </div>
          ) : (
            <>
              {batchLocales.map((locale, index) => (
                <div key={locale} className="flex-1">
                  <EditorPanel
                    content={batchContents[locale] || ''}
                    onChange={() => { }} // Batch panels are read-only for now
                    language={locale}
                    onLanguageChange={() => { }}
                    languages={languages}
                    onOpenModal={() => { }}
                    isLastEdited={false}
                    isUpdating={false}
                    isTranslating={isTranslating && lastEdited === 'left'}
                    progress={progress}
                    placeholder="Translating..."
                    accentColor={['blue', 'purple', 'green', 'pink'][index % 4]}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center gap-4">
            <LatencyBadge latency={latency} isTranslating={isTranslating} fastMode={fastMode} />
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/20 font-bold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pastel-green animate-pulse" />
            Live Sync Active
          </div>
        </div>

        {/* Demo Scenarios */}
        <DemoScenarios onSelect={handleScenarioSelect} />
      </main>

      {/* Footer */}
      <footer className="mt-20 py-8 border-t border-white/5 w-full max-w-6xl text-center text-white/20 text-sm font-bold uppercase tracking-widest">
        Built with <a href="https://lingo.dev" target="_blank" rel="noopener noreferrer" className="text-pastel-pink hover:underline">Lingo.dev</a> • Real-time Context-Aware Translation
      </footer>

      <AddLanguageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLanguage}
      />
    </div>
  );
}

export default App;
