"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Loader2 } from "lucide-react";

import { Scheme } from "@/app/lib/scheme-service";
import { SchemeDetailsModal } from "./SchemeDetailsModal";

import { MOCK_SCHEMES } from "@/app/lib/scheme-service";

export function SchemesSection() {
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  // Hardcoded UI for Translation Extraction
  return (
    <section
      id="schemes"
      className="py-20 md:py-32 bg-slate-50 dark:bg-[#0B1120] relative overflow-hidden"
    >
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-blue-400/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-blue-900/20 animate-blob"></div>
        <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-purple-400/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen dark:bg-purple-900/20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-6 px-4 py-1.5 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800 rounded-full transition-colors">
            ✨ Latest Opportunities
          </Badge>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            New Schemes For You
          </h3>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
            Discover the latest government initiatives designed to uplift
            citizens across every sector. Find what fits you best.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <Card className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <CardHeader className="relative z-10 space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors duration-300"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="truncate max-w-[200px] text-xs font-medium">
                    Ministry of Agriculture
                  </span>
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                PM-Kisan Samman Nidhi
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">
                Financial support to farmer families across the country.
              </p>
              <Button
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                onClick={() => setSelectedScheme(MOCK_SCHEMES[0])}
              >
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <CardHeader className="relative z-10 space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors duration-300"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="truncate max-w-[200px] text-xs font-medium">
                    Ministry of Housing
                  </span>
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                Pradhan Mantri Awas Yojana (Urban)
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">
                Housing for all in urban areas by 2024.
              </p>
              <Button
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                onClick={() => setSelectedScheme(MOCK_SCHEMES[1])}
              >
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <CardHeader className="relative z-10 space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors duration-300"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="truncate max-w-[200px] text-xs font-medium">
                    Ministry of Women & Child Development
                  </span>
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                Sukanya Samriddhi Yojana
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">
                Small deposit scheme for the girl child.
              </p>
              <Button
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                onClick={() => setSelectedScheme(MOCK_SCHEMES[2])}
              >
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <CardHeader className="relative z-10 space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors duration-300"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="truncate max-w-[200px] text-xs font-medium">
                    Ministry of Finance
                  </span>
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                Pradhan Mantri Mudra Yojana
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">
                Loans up to 10 Lakhs for non-corporate, non-farm small/micro
                enterprises.
              </p>
              <Button
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                onClick={() => setSelectedScheme(MOCK_SCHEMES[3])}
              >
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 5 */}
          <Card className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <CardHeader className="relative z-10 space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors duration-300"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="truncate max-w-[200px] text-xs font-medium">
                    Ministry of Health
                  </span>
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                Ayushman Bharat Yojana
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">
                Health insurance coverage of up to ₹5 lakh per family per year.
              </p>
              <Button
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                onClick={() => setSelectedScheme(MOCK_SCHEMES[4])}
              >
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Card 6 */}
          <Card className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-sm border-slate-200 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-400/50 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <CardHeader className="relative z-10 space-y-4 pb-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 group-hover:bg-blue-100 group-hover:text-blue-700 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors duration-300"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1.5" />
                  <span className="truncate max-w-[200px] text-xs font-medium">
                    Ministry of Education
                  </span>
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                National Merit Scholarship Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col justify-between">
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed line-clamp-3">
                Scholarships for students from minority communities.
              </p>
              <Button
                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all duration-300 shadow-sm"
                onClick={() => setSelectedScheme(MOCK_SCHEMES[5])}
              >
                View Full Details
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <SchemeDetailsModal
          isOpen={!!selectedScheme}
          onClose={() => setSelectedScheme(null)}
          scheme={selectedScheme}
        />
      </div>
    </section>
  );
}
