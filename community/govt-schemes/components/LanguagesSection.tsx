"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Users,
  MessageCircle,
  Languages as LanguagesIcon,
  CheckCircle,
  ArrowRight,
  Bot,
  Database,
  Shield,
  Zap,
} from "lucide-react";

interface LanguagesSectionProps {
  onOpenChat: () => void;
}

export function LanguagesSection({ onOpenChat }: LanguagesSectionProps) {
  const languages = [
    { code: "en", name: "English", native: "English", speakers: "125M+" },
    { code: "hi", name: "Hindi", native: "हिन्दी", speakers: "600M+" },

    { code: "as", name: "Assamese", native: "অসমীয়া", speakers: "15M+" },
    { code: "bn", name: "Bengali", native: "বাংলা", speakers: "97M+" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી", speakers: "56M+" },

    { code: "mr", name: "Marathi", native: "मराठी", speakers: "83M+" },
    { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", speakers: "33M+" },
    { code: "ta", name: "Tamil", native: "தமிழ்", speakers: "75M+" },
    { code: "te", name: "Telugu", native: "తెలుగు", speakers: "81M+" },
    { code: "ur", name: "Urdu", native: "اردو", speakers: "52M+" },
    { code: "ks", name: "Kashmiri", native: "کٲشُر", speakers: "7M+" },
    { code: "mai", name: "Maithili", native: "मैथिली", speakers: "13M+" },
  ];

  return (
    <section id="languages" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <Badge className="mb-6 bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 px-4 py-2 text-sm font-semibold">
            <Globe className="mr-2 h-4 w-4" />
            24+ Languages
          </Badge>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Supported Languages
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Communicate in your preferred language.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-16">
          {languages.map((lang, index) => (
            <Card
              key={lang.code}
              className="group text-center border border-gray-200 dark:border-gray-800 hover:border-[#4299eb] dark:hover:border-[#4299eb] hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 hover:scale-105 cursor-pointer relative overflow-hidden"
              onClick={onOpenChat}
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#4299eb]/0 to-[#4299eb]/0 group-hover:from-[#4299eb]/5 group-hover:to-[#4299eb]/10 transition-all duration-300"></div>

              <CardContent className="p-3 sm:p-4 md:p-6 relative z-10">
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-[#4299eb] transition-colors duration-300 leading-tight">
                  {lang.native}
                </div>

                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 font-medium">
                  {lang.name}
                </div>

                <Badge className="text-xs bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800 group-hover:bg-[#4299eb] group-hover:text-white group-hover:border-[#4299eb] transition-all duration-300">
                  <Users className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  <span className="text-xs">{lang.speakers}</span>
                </Badge>

                <div className="mt-2 sm:mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  <div className="text-xs text-[#4299eb] font-medium flex items-center justify-center">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Click to Chat
                  </div>
                </div>
              </CardContent>

              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            </Card>
          ))}
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex flex-col items-center space-y-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#4299eb] rounded-full">
                <LanguagesIcon className="w-6 h-6 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                More Languages
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md leading-relaxed">
              We are constantly adding more languages to support every citizen.
            </p>

            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {[
                "Sanskrit",
                "Bodo",
                "Dogri",
                "Konkani",
                "Manipuri",
                "Nepali",
                "Santhali",
                "Sindhi",
              ].map((lang, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-[#4299eb] hover:text-white hover:border-[#4299eb] transition-colors cursor-pointer"
                >
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-[#4299eb] text-white px-8 py-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <Badge className="mb-6 bg-white/20 text-white border-0 hover:bg-white/20 px-4 py-2">
                <CheckCircle className="mr-2 h-4 w-4" />
                Verified
              </Badge>

              <h3 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to find schemes?
              </h3>

              <p className="text-lg md:text-xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
                Join millions of citizens benefiting from government schemes
                today.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    15+
                  </div>
                  <div className="text-sm text-blue-200">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    500+
                  </div>
                  <div className="text-sm text-blue-200">Schemes</div>
                </div>
                <div className="text-center col-span-2 md:col-span-1">
                  <div className="text-2xl md:text-3xl font-bold text-white">
                    10M+
                  </div>
                  <div className="text-sm text-blue-200">Citizens Helped</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
                <Button
                  size="lg"
                  className="bg-white text-[#4299eb] hover:bg-blue-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                  onClick={onOpenChat}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Chat
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  size="lg"
                  className="bg-white text-[#4299eb] hover:bg-blue-50 font-bold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
                  onClick={onOpenChat}
                >
                  <Bot className="w-5 h-5 mr-2" />
                  Ask AI
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center items-center text-blue-200 text-sm">
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Secure
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Available 24/7
                </div>
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  Instant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
