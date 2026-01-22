"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle,
  Info,
} from "lucide-react";
import { Scheme } from "@/app/lib/scheme-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface SchemeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheme: Scheme | null;
}

export function SchemeDetailsModal({
  isOpen,
  onClose,
  scheme,
}: SchemeDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !scheme) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5 pr-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
              >
                <Building2 className="w-3 h-3 mr-1" />
                {scheme.department || "Govt. Scheme"}
              </Badge>
              {scheme.state && (
                <Badge
                  variant="outline"
                  className="text-slate-600 dark:text-slate-400"
                >
                  {scheme.state}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {scheme.name}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
              <Info className="w-5 h-5 text-blue-500" />
              Overview
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Benefits */}
          {scheme.benefits && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Benefits
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                {formatList(scheme.benefits)}
              </div>
            </div>
          )}

          {/* Eligibility Criteria */}
          {scheme.eligibility && Object.keys(scheme.eligibility).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-white">
                <CheckCircle className="w-5 h-5 text-purple-500" />
                Eligibility Criteria
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {Object.entries(scheme.eligibility).map(([key, value]) => {
                  const isValid =
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    (Array.isArray(value) ? value.length > 0 : true);
                  if (!isValid) return null;
                  return (
                    <Card
                      key={key}
                      className="bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 shadow-none"
                    >
                      <CardContent className="p-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                          {formatLabel(key)}
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-200">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : value.toString()}
                        </span>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {scheme.application_url && (
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
              asChild
            >
              <a
                href={scheme.application_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply Now <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

// Helper to format benefits text that might act like a list
function formatList(text: string) {
  if (!text) return null;
  // If the text contains bullet points or newlines, verify formatting
  const lines = text.split(/\n|•/).filter((line) => line.trim().length > 0);
  if (lines.length > 1) {
    return (
      <ul className="list-disc pl-5 space-y-1">
        {lines.map((line, i) => (
          <li key={i}>{line.trim()}</li>
        ))}
      </ul>
    );
  }
  return <p>{text}</p>;
}

// Helper to format keys like 'income_max' to 'Income Max'
function formatLabel(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
