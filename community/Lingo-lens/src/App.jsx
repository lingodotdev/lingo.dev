import { useState, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Camera, RefreshCw, Languages, ArrowRight, Globe, FileText, Sparkles, ScanLine, CheckCircle2 } from 'lucide-react';
import { translateText } from './services/lingo';

function App() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("Ready");
  
  // LOGIC: Default to 'auto'
  const [sourceLang, setSourceLang] = useState("auto"); 
  const [targetLang, setTargetLang] = useState("en");

  // Cleanup object URL to prevent memory leaks when component unmounts
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Revoke previous URL before creating a new one to prevent memory leaks
      if (image) URL.revokeObjectURL(image);
      
      setImage(URL.createObjectURL(e.target.files[0]));
      setExtractedText(""); 
      setTranslatedText("");
      setProgress("Ready");
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setExtractedText(""); 
    setTranslatedText("");

    let currentText = "";
    let ocrLang = sourceLang;

    try {
      // PHASE 1: Auto-Detect Script (if 'auto' is selected)
      if (sourceLang === 'auto') {
        setProgress("Detecting Script...");
        const detector = await Tesseract.createWorker('osd', 1, {
            legacyCore: true,
            legacyLang: true
        });
        
        try {
            const detectResult = await detector.detect(image);
            const script = detectResult.data.script;
            console.log("Detected Script:", script);

            if (script === 'Japanese') ocrLang = 'jpn';
            else if (script === 'Han') ocrLang = 'chi_sim'; 
            else if (script === 'Devanagari') ocrLang = 'hin';
            else ocrLang = 'eng'; 
        } finally {
            // Ensure detector is always terminated to prevent resource leaks
            await detector.terminate();
        }
      }

      // PHASE 2: OCR
      setProgress(`Reading Text (${ocrLang === 'chi_sim' ? 'Chinese' : ocrLang})...`);
      const worker = await Tesseract.createWorker(ocrLang); 
      
      try {
        const result = await worker.recognize(image);
        currentText = result.data.text;
      } finally {
        // Ensure worker is always terminated to prevent resource leaks
        await worker.terminate();
      }

      if (!currentText.trim()) throw new Error("No text found. Try a clearer image.");
      setExtractedText(currentText);

    } catch (ocrError) {
      console.error(ocrError);
      setExtractedText("Error reading image: " + ocrError.message);
      setIsProcessing(false);
      setProgress("Failed");
      return; 
    }

    // PHASE 3: TRANSLATE
    try {
  setProgress(`Translating to ${targetLang.toUpperCase()}...`);
  
  // FIX: Pass ocrLang instead of sourceLang to ensure the detected language is used
  const translation = await translateText(currentText, ocrLang, targetLang);
  
  setTranslatedText(translation);
  setProgress("Done!");
} catch (transError) {
  console.error(transError);
  setTranslatedText("Translation Failed: " + transError.message);
  setProgress("Failed"); // Add this line
} finally {
  setIsProcessing(false);
  // Remove setProgress("Done!") from here
}
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
      
      {/* BACKGROUND: Animated Gradient Mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/20 blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* HEADER */}
        <header className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-slate-800/50 backdrop-blur-md border border-slate-700/50 shadow-xl">
             <ScanLine className="w-8 h-8 text-cyan-400 mr-3" />
             <h1 className="text-5xl font-extrabold tracking-tight leading-relaxed pb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 text-transparent bg-clip-text">
              LingoLens
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-lg mx-auto leading-relaxed">
            AI-Powered visual translation engine. <br/>
            <span className="text-cyan-400/80">Drag, Drop, Detect, Translate.</span>
          </p>
        </header>

        {/* GLASS CARD CONTAINER */}
        <div className="w-full max-w-5xl bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
          
          {/* CONTROL BAR */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 mb-10 items-center">
              
              {/* SOURCE SELECT */}
              <div className="group relative">
                  <label className="text-xs font-bold text-cyan-400/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileText className="w-3 h-3" /> Source Language
                  </label>
                  <div className="relative bg-slate-800/50 rounded-xl border border-white/5 transition-all group-hover:border-cyan-500/50 group-hover:bg-slate-800/80">
                    <select 
                      value={sourceLang} 
                      onChange={(e) => setSourceLang(e.target.value)} 
                      className="w-full bg-transparent text-white p-4 pr-10 rounded-xl outline-none appearance-none cursor-pointer"
                    >
                        <option value="auto" className="bg-slate-900">✨ Auto Detect</option>
                        <option disabled className="bg-slate-900">──────────</option>
                        <option value="eng" className="bg-slate-900">English Document</option>
                        <option value="jpn" className="bg-slate-900">Japanese (日本語)</option>
                        <option value="chi_sim" className="bg-slate-900">Chinese (Simplified)</option>
                        <option value="fra" className="bg-slate-900">French</option>
                        <option value="spa" className="bg-slate-900">Spanish</option>
                        <option value="hin" className="bg-slate-900">Hindi</option>
                    </select>
                    <Sparkles className="w-5 h-5 text-cyan-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
              </div>

              {/* ARROW ICON */}
              <div className="hidden md:flex justify-center pt-6">
                <div className="p-3 rounded-full bg-slate-800/50 border border-white/10">
                  <ArrowRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* TARGET SELECT */}
              <div className="group relative">
                  <label className="text-xs font-bold text-purple-400/80 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Translate To
                  </label>
                  <div className="relative bg-slate-800/50 rounded-xl border border-white/5 transition-all group-hover:border-purple-500/50 group-hover:bg-slate-800/80">
                    <select 
                      value={targetLang} 
                      onChange={(e) => setTargetLang(e.target.value)} 
                      className="w-full bg-transparent text-white p-4 rounded-xl outline-none cursor-pointer appearance-none"
                    >
                        <option value="en" className="bg-slate-900">English</option>
                        <option value="es" className="bg-slate-900">Spanish</option>
                        <option value="fr" className="bg-slate-900">French</option>
                        <option value="ja" className="bg-slate-900">Japanese</option>
                        <option value="hi" className="bg-slate-900">Hindi</option>
                    </select>
                    <ArrowRight className="w-4 h-4 text-purple-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 md:rotate-0 pointer-events-none" />
                  </div>
              </div>
          </div>

          {/* DROP ZONE */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-slate-600/50 rounded-3xl bg-slate-900/50 backdrop-blur-sm transition-all group-hover:border-cyan-400/50 group-hover:bg-slate-800/50 cursor-pointer overflow-hidden">
              
              <input type="file" accept="image/*" disabled={isProcessing} onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              
              {!image ? (
                <div className="text-center space-y-6 p-10 transition-transform group-hover:scale-105 duration-300">
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center shadow-lg border border-slate-700 group-hover:border-cyan-500/50">
                    <Camera className="w-10 h-10 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white mb-2">Drop your image here</p>
                    <p className="text-slate-400 text-sm">Supports JPG, PNG, Screenshots</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center bg-black/40">
                    <img src={image} alt="Preview" className="max-h-[400px] w-auto object-contain rounded-lg shadow-2xl z-10" />
                    {/* Scanning Overlay Effect */}
                    {isProcessing && (
                       <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent w-full h-full animate-[scan_2s_ease-in-out_infinite] border-b-2 border-cyan-400/50"></div>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="mt-10 flex justify-center">
            <button 
              onClick={processImage} 
              disabled={!image || isProcessing} 
              className={`
                group relative px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0
                ${!image 
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                  : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 hover:shadow-cyan-500/25"}
              `}
            >
              <div className="flex items-center gap-3">
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>{progress}</span>
                  </>
                ) : (
                  <>
                    <Languages className="w-5 h-5" />
                    <span>Extract & Translate</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* RESULTS GRID */}
          {(extractedText || translatedText) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 animate-[fadeIn_0.5s_ease-out]">
              
              {/* ORIGINAL TEXT CARD */}
              <div className="bg-black/30 p-8 rounded-3xl border border-white/5 backdrop-blur-sm shadow-inner relative group hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <FileText className="w-4 h-4" /> Detected Text
                   </h3>
                   {sourceLang === 'auto' && <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-cyan-400 border border-cyan-900">Auto-Detected</span>}
                </div>
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                   <p className="whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">{extractedText}</p>
                </div>
              </div>

              {/* TRANSLATION CARD */}
              <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 p-8 rounded-3xl border border-cyan-500/20 backdrop-blur-sm shadow-lg relative hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                     <Sparkles className="w-4 h-4" /> Translation
                   </h3>
                   {translatedText && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                </div>
                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                   <p className="whitespace-pre-wrap text-white font-medium text-lg leading-relaxed">
                     {translatedText || <span className="text-cyan-400/30 italic">Translation will appear here...</span>}
                   </p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* FOOTER */}
        <footer className="mt-12 text-slate-500 text-sm">
          <p>Powered by Tesseract.js & Lingo.dev</p>
        </footer>
      </div>
    </div>
  );
}

export default App;