import React from "react";

const Header = () => {
  return (
    <header className="w-full border-b border-border pb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
            AI Localization Debugger
          </h1>
          <p className="text-md md:text-base text-muted max-w-xl">
            Analyze source code and translation files to detect missing keys,
            hardcoded strings, and semantic inconsistencies — powered by AI.
          </p>
        </div>

        <div className="flex items-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Powered by <span className="text-foreground font-medium">Lingo.dev</span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
