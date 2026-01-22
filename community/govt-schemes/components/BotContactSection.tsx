"use client";

import { Badge } from "@/components/ui/badge";
import { ChatInterface } from "@/components/ChatInterface";
import { Bot, Sparkles, Shield, Globe } from "lucide-react";

export function BotContactSection() {
  return (
    <section
      id="bot-contact"
      className="py-24 md:py-32 relative overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white transition-colors duration-300"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-indigo-900/50 dark:via-[#0f172a] dark:to-blue-900/50 pointer-events-none"></div>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-500/50 to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-200 dark:via-indigo-500/50 to-transparent"></div>

      {/* Decorative Orbs */}
      <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
      <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-indigo-400/20 dark:bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse animation-delay-2000"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Badge className="mb-8 bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20 dark:hover:bg-blue-500/20 px-4 py-1.5 text-sm font-medium rounded-full backdrop-blur-sm shadow-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-colors">
            <Bot className="mr-2 h-4 w-4" />
            AI-Powered Assistant
          </Badge>

          <h3 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-100 dark:to-indigo-200 drop-shadow-sm">
            Ask SchemeSaathi
          </h3>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Your personal guide to government benefits.
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              {" "}
              Instant answers
            </span>
            , available 24/7 in your preferred language.
          </p>
        </div>

        {/* Chat Interface Container with Glass Effect */}
        <div className="max-w-4xl mx-auto relative group">
          <ChatInterface />
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
          {[
            {
              icon: Sparkles,
              text: "Instant Answers",
              color: "text-amber-500 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-transparent",
            },
            {
              icon: Bot,
              text: "AI Powered",
              color: "text-blue-600 dark:text-blue-400",
              bg: "bg-blue-50 dark:bg-transparent",
            },
            {
              icon: Shield,
              text: "Verified Data",
              color: "text-green-600 dark:text-green-400",
              bg: "bg-green-50 dark:bg-transparent",
            },
            {
              icon: Globe,
              text: "Multilingual",
              color: "text-purple-600 dark:text-purple-400",
              bg: "bg-purple-50 dark:bg-transparent",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-colors ${item.bg} border-slate-200 dark:border-white/5 dark:bg-white/5 hover:border-blue-200 dark:hover:bg-white/10 dark:hover:border-white/10`}
            >
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
