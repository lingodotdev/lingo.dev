"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { StatsSection } from "@/components/StatsSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { LanguagesSection } from "@/components/LanguagesSection";
import { Footer } from "@/components/Footer";
import { SchemesSection } from "@/components/SchemesSection";
import { FloatingChatbot } from "@/components/FloatingChatbot";

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Handle scroll event
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header
        isScrolled={isScrolled}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <HeroSection onOpenChat={() => setIsChatOpen(true)} />
      <StatsSection />
      <FeaturesSection />
      <SchemesSection />
      <LanguagesSection onOpenChat={() => setIsChatOpen(true)} />
      <Footer />

      {/* Floating Chatbot */}
      <FloatingChatbot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
      />
    </div>
  );
}
