import React from "react";

const LoadingState = () => {
  return (
    <div className="w-full my-6">
      <div className="card p-4 flex items-center gap-3">
        <span className="relative flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
        </span>     
        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground">
            Analyzing localization
          </p>
          <p className="text-xs text-muted">
            Processing input and generating AI insights with Lingo.dev
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
