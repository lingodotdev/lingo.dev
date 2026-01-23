import {
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Badge } from "./ui/badge";
import type { SEOAnalysis } from "../services/api";
import { useEffect, useState } from "react";

// CSS for score ring animation
const animationStyles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

interface MetadataQualityScoreProps {
  title: string;
  description: string;
  keywords: string[];
  seoScore?: SEOAnalysis | null;
}

export function MetadataQualityScore({
  title,
  description,
  keywords,
  seoScore,
}: MetadataQualityScoreProps) {
  // State for animating the ring from 0 to actual score
  const [animatedScore, setAnimatedScore] = useState(0);

  // State for collapsible sections
  const [issuesOpen, setIssuesOpen] = useState(true);
  const [recommendationsOpen, setRecommendationsOpen] = useState(true);

  // Use AI-generated scores if available, otherwise calculate locally
  const useAIScores = seoScore && seoScore.scores;

  // Calculate quality metrics
  const titleLength = title.length;
  const descriptionLength = description.length;
  const keywordCount = keywords.length;

  // Get scores - either from AI or local calculation
  let titleScore,
    descriptionScore,
    keywordScore,
    contentScore,
    technicalScore,
    overallScore;

  if (useAIScores) {
    // Use AI-generated scores (0-20 scale, convert to percentage)
    titleScore = Math.round((seoScore.scores.title_quality / 20) * 100);
    descriptionScore = Math.round(
      (seoScore.scores.description_quality / 20) * 100
    );
    keywordScore = Math.round(
      (seoScore.scores.keyword_optimization / 20) * 100
    );
    contentScore = Math.round((seoScore.scores.content_alignment / 20) * 100);
    technicalScore = Math.round((seoScore.scores.technical_seo / 20) * 100);
    overallScore = seoScore.total_score;
  } else {
    // Fallback to local scoring logic
    titleScore =
      titleLength >= 50 && titleLength <= 60
        ? 100
        : titleLength >= 40 && titleLength <= 70
        ? 80
        : 60;

    descriptionScore =
      descriptionLength >= 150 && descriptionLength <= 160
        ? 100
        : descriptionLength >= 120 && descriptionLength <= 170
        ? 80
        : 60;

    keywordScore =
      keywordCount >= 5 && keywordCount <= 8
        ? 100
        : keywordCount >= 3 && keywordCount <= 10
        ? 80
        : 60;

    overallScore = Math.round(
      (titleScore + descriptionScore + keywordScore) / 3
    );
  }

  // Animate the ring from 0 to the actual score
  useEffect(() => {
    // Reset to 0 first
    setAnimatedScore(0);
    // Then animate to actual score after a small delay
    const timer = setTimeout(() => {
      setAnimatedScore(overallScore);
    }, 100);
    return () => clearTimeout(timer);
  }, [overallScore]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#a3ff12]";
    if (score >= 70) return "text-yellow-400";
    return "text-orange-400";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4" />;
    if (score >= 70) return <Info className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Work";
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="space-y-4">
        {/* Original Metadata Display */}
        <div className="space-y-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/40 uppercase tracking-wider">
              Original Metadata
            </span>
          </div>

          <div className="space-y-2">
            <div className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
              <label className="text-sm text-white/50 mb-1 block">Title</label>
              <p className="text-sm text-white/80 leading-relaxed">
                {title || "N/A"}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-white/40">
                  {titleLength} chars
                </span>
                {titleLength >= 50 && titleLength <= 60 ? (
                  <span className="text-sm text-[#a3ff12]">
                    ✓ Optimal length
                  </span>
                ) : titleLength < 50 ? (
                  <span className="text-sm text-orange-400">Too short</span>
                ) : (
                  <span className="text-sm text-orange-400">Too long</span>
                )}
              </div>
            </div>

            <div className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
              <label className="text-sm text-white/50 mb-1 block">
                Description
              </label>
              <p className="text-sm text-white/70 leading-relaxed">
                {description || "N/A"}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-white/40">
                  {descriptionLength} chars
                </span>
                {descriptionLength >= 120 && descriptionLength <= 160 ? (
                  <span className="text-sm text-[#a3ff12]">
                    ✓ Optimal length
                  </span>
                ) : descriptionLength < 120 ? (
                  <span className="text-sm text-orange-400">Too short</span>
                ) : (
                  <span className="text-sm text-orange-400">Too long</span>
                )}
              </div>
            </div>

            {keywords.length > 0 && (
              <div className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
                <label className="text-sm text-white/50 mb-1 block">
                  Keywords
                </label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="text-sm px-2 py-1 bg-white/5 text-white/70 rounded border border-white/10"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quality Score Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/40 uppercase tracking-wider">
                Quality Score
              </span>
            </div>
            <Badge
              className={`${getScoreColor(
                overallScore
              )} bg-white/5 border-0 text-sm`}
            >
              {getScoreBadge(overallScore)}
            </Badge>
          </div>

          {/* Two-column layout: Ring on left, Score boxes on right */}
          <div className="flex gap-4 bg-[#0a0a0a] rounded-lg p-4 border border-white/5">
            {/* Left: Overall Score Ring */}
            <div
              className="flex items-center justify-center w-[10px]"
              style={{ width: "10rem", scale: "1.2" }}
            >
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#ffffff20"
                    strokeWidth="4"
                    fill="none"
                    className="text-white/10"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#a3ff12"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 28 * (1 - animatedScore / 100)
                    }`}
                    strokeLinecap="round"
                    style={{
                      transition:
                        "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-lg font-semibold ${getScoreColor(
                      overallScore
                    )} transition-all duration-1000 ease-out`}
                    style={{
                      animation: "fadeInScale 0.8s ease-out 0.5s both",
                    }}
                  >
                    {overallScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Score Boxes */}
            <div className="flex-1 space-y-2">
              {/* Title Score */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getScoreIcon(titleScore)}
                  <span className="text-white/60">Title Quality</span>
                </div>
                <span className={`font-medium ${getScoreColor(titleScore)}`}>
                  {useAIScores
                    ? `${seoScore.scores.title_quality}/20`
                    : `${titleLength} chars`}
                </span>
              </div>

              {/* Description Score */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getScoreIcon(descriptionScore)}
                  <span className="text-white/60">Description</span>
                </div>
                <span
                  className={`font-medium ${getScoreColor(descriptionScore)}`}
                >
                  {useAIScores
                    ? `${seoScore.scores.description_quality}/20`
                    : `${descriptionLength} chars`}
                </span>
              </div>

              {/* Keyword Score */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {getScoreIcon(keywordScore)}
                  <span className="text-white/60">Keywords</span>
                </div>
                <span className={`font-medium ${getScoreColor(keywordScore)}`}>
                  {useAIScores
                    ? `${seoScore.scores.keyword_optimization}/20`
                    : `${keywordCount} terms`}
                </span>
              </div>

              {/* Content Alignment (AI only) */}
              {useAIScores && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getScoreIcon(contentScore!)}
                    <span className="text-white/60">Content Align</span>
                  </div>
                  <span
                    className={`font-medium ${getScoreColor(contentScore!)}`}
                  >
                    {seoScore.scores.content_alignment}/20
                  </span>
                </div>
              )}

              {/* Technical SEO (AI only) */}
              {useAIScores && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {getScoreIcon(technicalScore!)}
                    <span className="text-white/60">Technical SEO</span>
                  </div>
                  <span
                    className={`font-medium ${getScoreColor(technicalScore!)}`}
                  >
                    {seoScore.scores.technical_seo}/20
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI-Generated Issues and Recommendations */}
        {useAIScores && seoScore && (
          <div className="space-y-3">
            {/* Issues Dropdown */}
            {seoScore.issues && seoScore.issues.length > 0 && (
              <div className="border border-white/20 rounded-lg overflow-hidden bg-white/5">
                <button
                  onClick={() => setIssuesOpen(!issuesOpen)}
                  className="w-full flex items-center justify-between p-3 hover:bg-orange-400/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-400">
                      Issues ({seoScore.issues.length})
                    </span>
                  </div>
                  {issuesOpen ? (
                    <ChevronUp className="w-4 h-4 text-orange-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-orange-400" />
                  )}
                </button>
                {issuesOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    {seoScore.issues.map((issue, idx) => (
                      <div
                        key={`issue-${idx}`}
                        className="flex items-start gap-2 text-sm text-orange-400/80 rounded p-2.5"
                      >
                        <span className="text-orange-400 mt-0.5">•</span>
                        <span>{issue}</span>
                      </div>
                    ))}
                    <div className="space-y-3"></div>
                  </div>
                )}
              </div>
            )}

            <br />
            {/* Recommendations Dropdown */}
            {seoScore.recommendations &&
              seoScore.recommendations.length > 0 && (
                <div className="border border-[#a3ff12]/20 rounded-lg overflow-hidden bg-[#a3ff12]/5">
                  <button
                    onClick={() => setRecommendationsOpen(!recommendationsOpen)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#a3ff12]/10 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#a3ff12]" />
                      <span className="text-sm font-medium text-[#a3ff12]">
                        Recommendations ({seoScore.recommendations.length})
                      </span>
                    </div>
                    {recommendationsOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#a3ff12]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#a3ff12]" />
                    )}
                  </button>
                  {recommendationsOpen && (
                    <div className="px-3 pb-3 space-y-2">
                      {seoScore.recommendations.map((rec, idx) => (
                        <div
                          key={`rec-${idx}`}
                          className="flex items-start gap-2 text-sm rounded p-2.5"
                        >
                          <span className="text-[#a3ff12] mt-0.5">•</span>
                          <span className="text-[#a3ff12]/90">{rec}</span>
                        </div>
                      ))}
                      <div className="space-y-3"></div>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}

        {/* Local Recommendations (fallback) */}
        {!useAIScores && (
          <div className="space-y-3">
            {/* Local Issues */}
            {(titleLength < 50 ||
              titleLength > 70 ||
              descriptionLength < 120) && (
              <div className="border border-orange-400/20 rounded-lg overflow-hidden bg-orange-400/5">
                <button
                  onClick={() => setIssuesOpen(!issuesOpen)}
                  className="w-full flex items-center justify-between p-3 hover:bg-orange-400/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-400">
                      Issues
                    </span>
                  </div>
                  {issuesOpen ? (
                    <ChevronUp className="w-4 h-4 text-orange-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-orange-400" />
                  )}
                </button>
                {issuesOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    {titleLength < 50 && (
                      <div className="flex items-start gap-2 text-sm text-orange-400/80 rounded p-2.5">
                        <span className="text-orange-400 mt-0.5">•</span>
                        <span>
                          Title is too short. Aim for 50-60 characters for
                          better SEO.
                        </span>
                      </div>
                    )}
                    {titleLength > 70 && (
                      <div className="flex items-start gap-2 text-sm text-orange-400/80 rounded p-2.5">
                        <span className="text-orange-400 mt-0.5">•</span>
                        <span>
                          Title is too long. Keep it under 60 characters to
                          avoid truncation.
                        </span>
                      </div>
                    )}
                    {descriptionLength < 120 && (
                      <div className="flex items-start gap-2 text-sm text-orange-400/80 rounded p-2.5">
                        <span className="text-orange-400 mt-0.5">•</span>
                        <span>
                          Description is too short. Aim for 150-160 characters
                          for optimal display.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Local Recommendations */}
            {keywordCount < 5 && (
              <div className="border border-yellow-400/20 rounded-lg overflow-hidden bg-yellow-400/5">
                <button
                  onClick={() => setRecommendationsOpen(!recommendationsOpen)}
                  className="w-full flex items-center justify-between p-3 hover:bg-yellow-400/10 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">
                      Recommendations
                    </span>
                  </div>
                  {recommendationsOpen ? (
                    <ChevronUp className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-yellow-400" />
                  )}
                </button>
                {recommendationsOpen && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="flex items-start gap-2 text-sm text-yellow-400/80 rounded p-2.5">
                      <span className="text-yellow-400 mt-0.5">•</span>
                      <span>
                        Consider adding more keywords for better targeting (5-8
                        recommended).
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
