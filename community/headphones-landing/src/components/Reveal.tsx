"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  animation?: "fade-in-up" | "slide-in-right" | "scale-in";
  delay?: number;
  className?: string;
}

export default function Reveal({ 
  children, 
  animation = "fade-in-up", 
  delay = 0,
  className = "" 
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getBaseClass = () => {
    switch (animation) {
      case "fade-in-up": return "reveal-fade-up";
      case "slide-in-right": return "reveal-slide-right";
      case "scale-in": return "reveal-scale";
      default: return "";
    }
  };

  return (
    <div 
      ref={ref} 
      className={`reveal-base ${getBaseClass()} ${isVisible ? "reveal-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
