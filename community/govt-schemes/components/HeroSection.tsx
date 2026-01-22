"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircleDashed, Shield } from "lucide-react";

interface HeroSectionProps {
  onOpenChat: () => void;
}

export function HeroSection({ onOpenChat }: HeroSectionProps) {
  return (
    <section className="relative -mt-16 pt-16 py-16 md:py-24 overflow-hidden">
      {/* Background Image - extends to cover navbar */}
      <div className="absolute inset-0 -top-16 bg-[url('/bg-img.jpg')] bg-cover bg-center bg-no-repeat"></div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 -top-16 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge className="mb-6 bg-white/20 text-white border border-white/30 hover:bg-white/20 backdrop-blur-sm">
            <Shield className="mr-1 h-3 w-3" />
            SchemeSaathi AI
          </Badge>
          <h2 className="mb-6 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
            Find Government Schemes You Are Eligible For
          </h2>
          <p className="mb-8 max-w-2xl text-lg md:text-xl text-white/95 leading-relaxed drop-shadow-md">
            Instantly discover and apply for government schemes tailored to you.
            Powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="relative bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden group animate-pulse hover:animate-none border-0"
              onClick={onOpenChat}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

              <MessageCircleDashed />
              <span className="relative z-10 text-lg tracking-wide drop-shadow-lg">
                Ask AI
              </span>

              <div className="absolute inset-0 rounded-lg bg-blue-400/30 animate-ping group-hover:animate-none"></div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
