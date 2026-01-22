"use client";

import { FileText, Globe, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-12 sm:py-16">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          AI-Powered Medical Report Analysis
        </div>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Understand Your{" "}
          <span className="text-gradient">Medical Reports</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Get clear, patient-friendly explanations of your lab results and
          medical documents — translated into{" "}
          <span className="font-semibold text-foreground">40+ languages</span>
        </p>

        {/* Quick features */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <span>PDF, Image & Text</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <Globe className="h-4 w-4 text-emerald-500" />
            </div>
            <span>40+ Languages</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
              <Sparkles className="h-4 w-4 text-violet-500" />
            </div>
            <span>Instant Analysis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
