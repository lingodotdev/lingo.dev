"use client";

import { useState, useEffect } from "react";
import LanguageDistribution from "../../../components/charts/language-distribution";
import TranslationFrequency from "../../../components/charts/translation-frequency";
import { BarChart3, Users, Globe, TrendingUp, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LanguageDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [languageDistribution, setLanguageDistribution] = useState([]);
  const [translationFrequency, setTranslationFrequency] = useState([]);
  const [mostUsedLanguages, setMostUsedLanguages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();

    // Refresh every 10 seconds
    const interval = setInterval(loadAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      // Load all analytics data
      const [summaryRes, distributionRes, frequencyRes, mostUsedRes] =
        await Promise.all([
          fetch(`${API_URL}/api/analytics/summary`),
          fetch(`${API_URL}/api/analytics/language-distribution`),
          fetch(`${API_URL}/api/analytics/translation-frequency`),
          fetch(`${API_URL}/api/analytics/most-used-languages?limit=5`),
        ]);

      const [summaryData, distributionData, frequencyData, mostUsedData] =
        await Promise.all([
          summaryRes.json(),
          distributionRes.json(),
          frequencyRes.json(),
          mostUsedRes.json(),
        ]);

      if (summaryData.success) setSummary(summaryData.summary);
      if (distributionData.success)
        setLanguageDistribution(distributionData.data);
      if (frequencyData.success) setTranslationFrequency(frequencyData.data);
      if (mostUsedData.success) setMostUsedLanguages(mostUsedData.data);

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 gradient-bg rounded-xl">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Language Analytics
            </h1>
            <p className="text-muted-foreground">
              Real-time insights into multilingual collaboration
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-effect rounded-xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{summary?.activeUsers || 0}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Languages Used</p>
              <p className="text-2xl font-bold">
                {summary?.languagesUsed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Total Translations
              </p>
              <p className="text-2xl font-bold">
                {summary?.totalTranslations || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-xl p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cache Hit Rate</p>
              <p className="text-2xl font-bold">
                {summary?.cacheStats?.hitRate || "0%"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Language Distribution */}
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Language Distribution</h2>
          <LanguageDistribution data={languageDistribution} />
        </div>

        {/* Translation Frequency */}
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Translation Frequency</h2>
          <TranslationFrequency data={translationFrequency} />
        </div>
      </div>

      {/* Most Used Languages */}
      <div className="glass-effect rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Most Used Languages</h2>
        <div className="space-y-3">
          {mostUsedLanguages.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No data available
            </p>
          ) : (
            mostUsedLanguages.map((lang, index) => (
              <div
                key={lang.language}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 smooth-transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary">
                    #{index + 1}
                  </span>
                  <span className="font-medium">{lang.language}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {lang.usage} uses
                  </span>
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full gradient-bg smooth-transition"
                      style={{
                        width: `${(lang.usage / mostUsedLanguages[0].usage) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cache Stats */}
      {summary?.cacheStats && (
        <div className="glass-effect rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            Translation Cache Performance
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Cache Hits</p>
              <p className="text-2xl font-bold text-green-500">
                {summary.cacheStats.hits}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Cache Misses</p>
              <p className="text-2xl font-bold text-yellow-500">
                {summary.cacheStats.misses}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Total Requests
              </p>
              <p className="text-2xl font-bold">{summary.cacheStats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Cached Keys</p>
              <p className="text-2xl font-bold text-primary">
                {summary.cacheStats.keys}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
