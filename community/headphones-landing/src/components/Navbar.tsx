"use client";

import Image from "next/image";
import LanguageSwitcher from "./LanguageSwitcher";
import { useState, useEffect } from "react";
import type { Content } from "../content";

export default function Navbar({ content }: { content: Content['navbar'] }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navIds = ["features", "reviews", "features", "specs"];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold font-serif">
            L
          </div>
          <span className="font-serif text-xl font-bold text-stone-900 tracking-tight">
            LingoBuds
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 bg-white/50 backdrop-blur-sm px-8 py-2 rounded-full border border-stone-200/50">
          {content.links.map((link, i) => (
            <button
              key={link}
              onClick={() => scrollToSection(navIds[i] || "")}
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:block bg-stone-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-stone-800 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-stone-900/20">
            {content.cta}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
