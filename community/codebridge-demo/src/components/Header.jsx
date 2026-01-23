import { useTranslation } from "../contexts/LanguageContext";
import { isLingoConfigured } from "../services/translator";
import { useState, useEffect } from "react";
import { Globe, CheckCircle2, AlertCircle } from "lucide-react";

function Header() {
  const { language, setLanguage, t } = useTranslation();
  const [lingoStatus, setLingoStatus] = useState(false);

  useEffect(() => {
    // Check Lingo.dev configuration status
    const checkStatus = async () => {
      const status = await isLingoConfigured();
      setLingoStatus(status);
    };
    checkStatus();
  }, []);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/50">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                {t("app.header.title")}
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                {t("app.header.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Status & Language Selector */}
        <div className="flex items-center gap-3">
          {/* MCP Status Badge */}
          <div
            className={`flex items-center gap-1.5 h-9 rounded-md px-3 text-xs font-medium transition-all ${
              lingoStatus
                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
            }`}
            title={
              lingoStatus
                ? "Lingo.dev MCP translation active"
                : "Lingo.dev API not configured"
            }
          >
            {lingoStatus ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Lingo.dev MCP</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">MCP Inactive</span>
              </>
            )}
          </div>

          {/* Language Selector */}
          <select
            className="text-foreground flex h-9 items-center justify-between rounded-md border border-input bg-card px-3 text-sm ring-offset-background transition-all hover:bg-accent/10 hover:border-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
                className="bg-card text-foreground"
              >
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}

export default Header;
