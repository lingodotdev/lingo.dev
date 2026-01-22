import React from "react";

interface InputPanelProps {
  codeInput: string;
  sourceJson: string;
  targetJson: string;
  onCodeChange: (value: string) => void;
  onSourceJsonChange: (value: string) => void;
  onTargetJsonChange: (value: string) => void;
  onAnalyze: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  codeInput,
  sourceJson,
  targetJson,
  onCodeChange,
  onSourceJsonChange,
  onTargetJsonChange,
  onAnalyze,
}) => {
  return (
    <section className="card p-4 md:p-5 flex flex-col gap-4 h-full">
      
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Input
        </h2>
        <p className="text-sm text-muted">
          Paste your source code and translation files to analyze localization issues.
        </p>
      </div>

     
      <div className="flex flex-col gap-2">
        <label className="text-lg font-medium text-foreground">
          Source Code
        </label>
        <textarea
          value={codeInput}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`Example:\n\n<button>Sign In</button>`}
          className="min-h-40 resize-y p-3 text-sm font-mono"
        />
      </div>

  
      <div className="flex flex-col gap-2">
        <label className="text-lg font-medium text-foreground">
          Source Language (EN)
        </label>
        <textarea
          value={sourceJson}
          onChange={(e) => onSourceJsonChange(e.target.value)}
          placeholder={`{\n  "login.title": "Login",\n  "login.button": "Sign In"\n}`}
          className="min-h-30 resize-y p-3 text-sm font-mono"
        />
      </div>


      <div className="flex flex-col gap-2">
        <label className="text-lg font-medium text-foreground">
          Target Language
        </label>
        <textarea
          value={targetJson}
          onChange={(e) => onTargetJsonChange(e.target.value)}
          placeholder={`{\n  "login.title": "Connexion"\n}`}
          className="min-h-30 resize-y p-3 text-sm font-mono"
        />
      </div>


      <div className="pt-2">
        <button
          onClick={onAnalyze}
          className="w-full py-2.5 text-sm font-medium transition-colors cursor-pointer"
        >
          Analyze with AI
        </button>
      </div>
    </section>
  );
};

export default InputPanel;
