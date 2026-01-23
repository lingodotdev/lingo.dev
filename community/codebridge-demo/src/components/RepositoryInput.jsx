import { useState } from "react";
import { Search, Sparkles, Github, AlertCircle } from "lucide-react";
import { useTranslation } from "../contexts/LanguageContext";

function RepositoryInput({ onSubmit, isLoading }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError(t("app.input.error.empty"));
      return;
    }

    onSubmit(url.trim());
  };

  const exampleRepos = [
    { name: "facebook/react", icon: "⚛️" },
    { name: "microsoft/vscode", icon: "📝" },
    { name: "torvalds/linux", icon: "🐧" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50 mb-4">
            <Github className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white">
            {t("app.input.title")}
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {t("app.input.description")}
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={t("app.input.placeholder")}
                className="flex h-14 w-full rounded-lg border border-input bg-card px-12 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all text-white"
                disabled={isLoading}
              />
              <Sparkles className="absolute right-4 h-5 w-5 text-orange-500 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/50 hover:shadow-orange-500/70 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                {t("app.input.loading")}
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                {t("app.input.button")}
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Example Repositories */}
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground text-center">
            {t("app.input.examples")}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleRepos.map((repo, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setUrl(repo.name)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground hover:border-accent disabled:opacity-50 cursor-pointer"
              >
                <span>{repo.icon}</span>
                <span className="font-mono text-white">{repo.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 pt-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
            <span>AI-Powered Translation</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
            <span>10+ Languages</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
            <span>Real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositoryInput;
