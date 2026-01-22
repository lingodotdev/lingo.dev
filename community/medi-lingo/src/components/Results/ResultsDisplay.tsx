"use client";

import {
  FileText,
  Search,
  Lightbulb,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Scale,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { MedicalReportAnalysis } from "@/lib/types";

interface ResultsDisplayProps {
  analysis: MedicalReportAnalysis;
  language: string;
}

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  iconBgColor: string;
  children: React.ReactNode;
  className?: string;
}

function ResultCard({
  title,
  icon,
  iconBgColor,
  children,
  className = "",
}: ResultCardProps) {
  return (
    <Card
      className={`border-0 shadow-lg shadow-muted/20 transition-all hover:shadow-xl ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgColor}`}
          >
            {icon}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ResultsDisplay({ analysis, language }: ResultsDisplayProps) {
  const isRTL = ["ar", "he", "fa", "ur"].includes(language);

  return (
    <div
      className={`space-y-6 animate-stagger ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Overview */}
      <ResultCard
        title="Overview"
        icon={<FileText className="h-5 w-5 text-primary" />}
        iconBgColor="bg-primary/10"
        className="bg-gradient-to-br from-primary/5 to-transparent"
      >
        <p className="leading-relaxed text-muted-foreground">
          {analysis.overview}
        </p>
      </ResultCard>

      {/* Key Findings */}
      {analysis.key_findings.length > 0 && (
        <ResultCard
          title="Key Findings"
          icon={<Search className="h-5 w-5 text-sky-600" />}
          iconBgColor="bg-sky-500/10"
        >
          <ul className="space-y-2">
            {analysis.key_findings.map((finding, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                <span className="text-muted-foreground">{finding}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}

      {/* What It Means */}
      {analysis.what_it_means.length > 0 && (
        <ResultCard
          title="What This Means"
          icon={<Lightbulb className="h-5 w-5 text-amber-500" />}
          iconBgColor="bg-amber-500/10"
        >
          <div className="space-y-4">
            {analysis.what_it_means.map((meaning, index) => (
              <p key={index} className="leading-relaxed text-muted-foreground">
                {meaning}
              </p>
            ))}
          </div>
        </ResultCard>
      )}

      {/* Two-column grid for Terms and Warnings */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Medical Terms */}
        {Object.keys(analysis.medical_terms_explained).length > 0 && (
          <ResultCard
            title="Medical Terms"
            icon={<BookOpen className="h-5 w-5 text-violet-500" />}
            iconBgColor="bg-violet-500/10"
            className="bg-gradient-to-br from-violet-500/5 to-transparent"
          >
            <dl className="space-y-4">
              {Object.entries(analysis.medical_terms_explained).map(
                ([term, definition]) => (
                  <div key={term}>
                    <dt className="mb-1">
                      <Badge
                        variant="secondary"
                        className="bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20"
                      >
                        {term}
                      </Badge>
                    </dt>
                    <dd className="text-sm text-muted-foreground">
                      {definition}
                    </dd>
                  </div>
                )
              )}
            </dl>
          </ResultCard>
        )}

        {/* When to Be Careful */}
        {analysis.when_to_be_careful.length > 0 && (
          <ResultCard
            title="When to Be Careful"
            icon={<AlertTriangle className="h-5 w-5 text-amber-600" />}
            iconBgColor="bg-amber-500/10"
            className="bg-gradient-to-br from-amber-500/5 to-transparent"
          >
            <ul className="space-y-3">
              {analysis.when_to_be_careful.map((warning, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                  <span className="text-sm text-muted-foreground">
                    {warning}
                  </span>
                </li>
              ))}
            </ul>
          </ResultCard>
        )}
      </div>

      {/* Next Steps */}
      {analysis.next_steps_general.length > 0 && (
        <ResultCard
          title="Suggested Next Steps"
          icon={<ArrowRight className="h-5 w-5 text-emerald-500" />}
          iconBgColor="bg-emerald-500/10"
          className="bg-gradient-to-br from-emerald-500/5 to-transparent"
        >
          <ol className="space-y-3">
            {analysis.next_steps_general.map((step, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-600">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </ResultCard>
      )}

      {/* Disclaimer */}
      <Card className="border-0 bg-muted/50">
        <CardContent className="flex items-start gap-3 py-4">
          <Scale className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <p className="text-sm italic text-muted-foreground">
            {analysis.disclaimer}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
