"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslationStore } from "@/store/useTranslationStore";
import { useThemeStore } from "@/store/useThemeStore";
import { FlagImage } from "./FlagImage";

interface GlobeModalProps {
  children: React.ReactNode;
}

// Confetti particle component
function ConfettiParticle({ delay, isDark }: { delay: number; isDark: boolean }) {
  const colors = isDark 
    ? ["#00d4aa", "#fdcb6e", "#00ff88", "#74b9ff", "#fd79a8"]
    : ["#0d9488", "#f59e0b", "#10b981", "#3b82f6", "#ec4899"];
  
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const randomX = Math.random() * 100 - 50;
  const randomRotation = Math.random() * 720 - 360;

  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ 
        backgroundColor: randomColor,
        left: "50%",
        top: "50%",
      }}
      initial={{ 
        x: 0, 
        y: 0, 
        scale: 0, 
        rotate: 0,
        opacity: 1 
      }}
      animate={{ 
        x: randomX + "vw", 
        y: [0, -100, 200],
        scale: [0, 1, 0.5],
        rotate: randomRotation,
        opacity: [1, 1, 0]
      }}
      transition={{ 
        duration: 2.5,
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
}

// Confetti burst effect
function ConfettiBurst({ isDark }: { isDark: boolean }) {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {particles.map((i) => (
        <ConfettiParticle key={i} delay={i * 0.02} isDark={isDark} />
      ))}
    </div>
  );
}

// Circular progress ring
function ProgressRing({ 
  progress, 
  isDark, 
}: { 
  progress: number; 
  isDark: boolean;
}) {
  const strokeWidth = 6;
  // Use a fixed large circumference for percentage calculations
  const circumference = 1000;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg
      className="absolute -rotate-90 pointer-events-none"
      viewBox="0 0 110 110"
      style={{ 
        width: "calc(100% + 20px)", 
        height: "calc(100% + 20px)",
        top: "-10px",
        left: "-10px",
      }}
    >
      {/* Background ring */}
      <circle
        cx="55"
        cy="55"
        r="52"
        fill="none"
        stroke={isDark ? "rgba(100, 116, 139, 0.2)" : "rgba(148, 163, 184, 0.2)"}
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <motion.circle
        cx="55"
        cy="55"
        r="52"
        fill="none"
        stroke={isDark ? "#00d4aa" : "#0d9488"}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={circumference}
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          filter: `drop-shadow(0 0 15px ${isDark ? "rgba(0, 212, 170, 0.6)" : "rgba(13, 148, 136, 0.6)"})`,
        }}
      />
    </svg>
  );
}

// Typing animation for text
function TypewriterText({ text, isComplete }: { text: string; isComplete: boolean }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    if (!isComplete || !text) {
      setDisplayText("");
      return;
    }
    
    let index = 0;
    const interval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, isComplete]);
  
  return <span>{displayText}</span>;
}

export function GlobeModal({ children }: GlobeModalProps) {
  const {
    isGlobeExpanded,
    setGlobeExpanded,
    globeExpandedAutoClose,
    isTranslating,
    translations,
  } = useTranslationStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const totalTargets = translations.length;

  // Calculate progress percentage
  const progress = totalTargets > 0 ? (completedCount / totalTargets) * 100 : 0;

  // Find currently translating language
  const currentlyTranslating = useMemo(() => {
    return translations.find((t) => t.isLoading);
  }, [translations]);

  // Track completed translations
  useEffect(() => {
    const completed = translations.filter((t) => !t.isLoading && t.text).length;
    setCompletedCount(completed);
  }, [translations]);

  // Auto-close modal when translation completes (with delay)
  useEffect(() => {
    if (
      isGlobeExpanded &&
      globeExpandedAutoClose &&
      !isTranslating &&
      translations.length > 0
    ) {
      const allComplete = translations.every((t) => !t.isLoading);
      if (allComplete) {
        // Show celebration!
        setShowCompletionMessage(true);
        setShowConfetti(true);
        
        // Close after delay
        const timer = setTimeout(() => {
          setGlobeExpanded(false);
          setShowCompletionMessage(false);
          setShowConfetti(false);
        }, 3500);
        
        return () => clearTimeout(timer);
      }
    }
  }, [
    isGlobeExpanded,
    globeExpandedAutoClose,
    isTranslating,
    translations,
    setGlobeExpanded,
  ]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isGlobeExpanded) {
      setShowCompletionMessage(false);
      setShowConfetti(false);
    }
  }, [isGlobeExpanded]);

  return (
    <>
      {/* Small Globe in original position */}
      <motion.div
        className="w-full h-full cursor-pointer group"
        onClick={() => !isGlobeExpanded && setGlobeExpanded(true)}
        animate={{
          opacity: isGlobeExpanded ? 0 : 1,
          scale: isGlobeExpanded ? 0.8 : 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {!isGlobeExpanded && children}
      </motion.div>

      {/* Expanded Modal */}
      <AnimatePresence>
        {isGlobeExpanded && (
          <>
            {/* Confetti effect */}
            {showConfetti && <ConfettiBurst isDark={isDark} />}

            {/* Backdrop with blur */}
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => !isTranslating && setGlobeExpanded(false)}
            >
              {/* Blur overlay */}
              <div
                className="absolute inset-0 backdrop-blur-xl"
                style={{
                  backgroundColor: isDark
                    ? "rgba(10, 15, 20, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
                }}
              />

              {/* Animated gradient background */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  background: [
                    isDark
                      ? "radial-gradient(circle at 30% 30%, rgba(0, 212, 170, 0.15) 0%, transparent 50%)"
                      : "radial-gradient(circle at 30% 30%, rgba(13, 148, 136, 0.15) 0%, transparent 50%)",
                    isDark
                      ? "radial-gradient(circle at 70% 70%, rgba(253, 203, 110, 0.15) 0%, transparent 50%)"
                      : "radial-gradient(circle at 70% 70%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)",
                    isDark
                      ? "radial-gradient(circle at 30% 30%, rgba(0, 212, 170, 0.15) 0%, transparent 50%)"
                      : "radial-gradient(circle at 30% 30%, rgba(13, 148, 136, 0.15) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Modal Content */}
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative pointer-events-auto"
                initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.3, opacity: 0, rotate: 10 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  duration: 0.6,
                }}
                style={{
                  width: "600px",
                  height: "600px",
                  maxWidth: "85vw",
                  maxHeight: "85vw",
                }}
              >
                {/* Progress ring */}
                {isTranslating && (
                  <ProgressRing progress={progress} isDark={isDark} />
                )}

                {/* Outer glow ring */}
                <motion.div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    inset: "-40px",
                    background: isDark
                      ? "radial-gradient(circle, transparent 60%, rgba(0, 212, 170, 0.35) 75%, transparent 88%)"
                      : "radial-gradient(circle, transparent 60%, rgba(13, 148, 136, 0.35) 75%, transparent 88%)",
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "easeInOut",
                  }}
                />

                {/* Inner pulsing glow */}
                <motion.div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    boxShadow: isDark
                      ? "0 0 80px rgba(0, 212, 170, 0.3), inset 0 0 60px rgba(0, 212, 170, 0.1)"
                      : "0 0 80px rgba(13, 148, 136, 0.3), inset 0 0 60px rgba(13, 148, 136, 0.1)",
                  }}
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                />

                {/* Globe */}
                <div className="w-full h-full">{children}</div>

                {/* Status overlay */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 w-max z-10">
                  {isTranslating && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      {/* Main status */}
                      <motion.div
                        className="flex items-center gap-3 px-6 py-3 rounded-full"
                        style={{
                          backgroundColor: isDark
                            ? "rgba(0, 212, 170, 0.15)"
                            : "rgba(13, 148, 136, 0.15)",
                          border: `1px solid ${isDark ? "rgba(0, 212, 170, 0.3)" : "rgba(13, 148, 136, 0.3)"}`,
                          boxShadow: isDark
                            ? "0 0 30px rgba(0, 212, 170, 0.2)"
                            : "0 0 30px rgba(13, 148, 136, 0.2)",
                        }}
                      >
                        {/* Animated spinner */}
                        <motion.div
                          className="relative w-5 h-5"
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full border-2 border-transparent"
                            style={{
                              borderTopColor: isDark ? "#00d4aa" : "#0d9488",
                              borderRightColor: isDark ? "#00d4aa" : "#0d9488",
                            }}
                          />
                        </motion.div>
                        
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">
                            Translating {completedCount + 1} of {totalTargets}
                          </span>
                          {currentlyTranslating && (
                            <motion.span 
                              className="text-xs text-[var(--text-muted)]"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              key={currentlyTranslating.language.code}
                            >
                              <FlagImage languageCode={currentlyTranslating.language.code} size={18} className="mr-1" /> {currentlyTranslating.language.name}
                            </motion.span>
                          )}
                        </div>
                        
                        {/* Progress percentage */}
                        <div 
                          className="text-lg font-bold"
                          style={{ color: isDark ? "#00d4aa" : "#0d9488" }}
                        >
                          {Math.round(progress)}%
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {showCompletionMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div
                        className="flex items-center gap-3 px-8 py-4 rounded-full"
                        style={{
                          backgroundColor: isDark
                            ? "rgba(16, 185, 129, 0.2)"
                            : "rgba(16, 185, 129, 0.15)",
                          border: "2px solid rgba(16, 185, 129, 0.5)",
                          boxShadow: "0 0 40px rgba(16, 185, 129, 0.3)",
                        }}
                        animate={{
                          boxShadow: [
                            "0 0 40px rgba(16, 185, 129, 0.3)",
                            "0 0 60px rgba(16, 185, 129, 0.5)",
                            "0 0 40px rgba(16, 185, 129, 0.3)",
                          ],
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          }}
                        >
                          <svg
                            className="w-7 h-7 text-emerald-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                        <span className="text-lg font-bold text-emerald-400">
                          All translations complete!
                        </span>
                        <span className="text-2xl">🎉</span>
                      </motion.div>
                      
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm text-[var(--text-muted)]"
                      >
                        Returning to results...
                      </motion.span>
                    </motion.div>
                  )}
                </div>

                {/* Close button (only when not translating) */}
                {!isTranslating && !showCompletionMessage && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute -top-14 right-0 p-3 rounded-full transition-all"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(30, 40, 50, 0.8)"
                        : "rgba(255, 255, 255, 0.8)",
                      border: `1px solid ${isDark ? "rgba(100, 116, 139, 0.3)" : "rgba(148, 163, 184, 0.3)"}`,
                    }}
                    onClick={() => setGlobeExpanded(false)}
                    whileHover={{ 
                      scale: 1.1,
                      backgroundColor: isDark ? "rgba(239, 68, 68, 0.2)" : "rgba(239, 68, 68, 0.1)",
                      borderColor: "rgba(239, 68, 68, 0.5)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                )}
              </motion.div>

              {/* Floating translation cards around the globe */}
              {translations.length > 0 && (
                <TranslationPreviews
                  translations={translations}
                  isDark={isDark}
                  isTranslating={isTranslating}
                  showCompletion={showCompletionMessage}
                />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Enhanced mini translation cards floating around the globe
function TranslationPreviews({
  translations,
  isDark,
  isTranslating,
  showCompletion,
}: {
  translations: any[];
  isDark: boolean;
  isTranslating: boolean;
  showCompletion: boolean;
}) {
  // Dynamic positions based on number of translations
  const getPositions = (count: number) => {
    const positions = [
      { top: "8%", left: "20px" },
      { top: "8%", right: "20px" },
      { top: "38%", left: "10px" },
      { top: "38%", right: "10px" },
      { bottom: "22%", left: "20px" },
      { bottom: "22%", right: "20px" },
      { bottom: "8%", left: "15%" },
      { bottom: "8%", right: "15%" },
    ];
    return positions.slice(0, Math.min(count, 8));
  };

  const positions = getPositions(translations.length);

  return (
    <>
      {translations.slice(0, 8).map((t, i) => {
        const pos = positions[i] || positions[0];
        const isComplete = !t.isLoading && t.text;

        return (
          <motion.div
            key={t.language.code}
            className="absolute pointer-events-none"
            style={pos}
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ 
              delay: i * 0.08, 
              duration: 0.4,
              type: "spring",
              stiffness: 200,
            }}
          >
            <motion.div
              className="px-4 py-3 rounded-2xl backdrop-blur-sm"
              style={{
                backgroundColor: isDark
                  ? "rgba(20, 30, 40, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
                border: `2px solid ${
                  isComplete
                    ? "rgba(16, 185, 129, 0.6)"
                    : isDark
                    ? "rgba(100, 116, 139, 0.3)"
                    : "rgba(148, 163, 184, 0.3)"
                }`,
                boxShadow: isComplete
                  ? "0 0 25px rgba(16, 185, 129, 0.3), 0 10px 40px rgba(0, 0, 0, 0.2)"
                  : "0 10px 40px rgba(0, 0, 0, 0.15)",
                minWidth: "180px",
                maxWidth: "220px",
              }}
              animate={
                isComplete && showCompletion
                  ? {
                      scale: [1, 1.05, 1],
                      borderColor: [
                        "rgba(16, 185, 129, 0.6)",
                        "rgba(16, 185, 129, 1)",
                        "rgba(16, 185, 129, 0.6)",
                      ],
                    }
                  : !isComplete && isTranslating
                  ? {
                      borderColor: [
                        isDark ? "rgba(0, 212, 170, 0.3)" : "rgba(13, 148, 136, 0.3)",
                        isDark ? "rgba(0, 212, 170, 0.6)" : "rgba(13, 148, 136, 0.6)",
                        isDark ? "rgba(0, 212, 170, 0.3)" : "rgba(13, 148, 136, 0.3)",
                      ],
                    }
                  : {}
              }
              transition={
                (isComplete && showCompletion) || (!isComplete && isTranslating)
                  ? {
                      repeat: Infinity,
                      duration: 1.5,
                    }
                  : {}
              }
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <motion.div
                  animate={isComplete ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <FlagImage languageCode={t.language.code} size={22} />
                </motion.div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {t.language.name}
                </span>
                {isComplete && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="ml-auto"
                  >
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                    >
                      <svg
                        className="w-3 h-3 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
                {!isComplete && isTranslating && t.isLoading && (
                  <motion.div
                    className="ml-auto w-4 h-4 rounded-full border-2 border-transparent"
                    style={{
                      borderTopColor: isDark ? "#00d4aa" : "#0d9488",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                )}
              </div>
              
              {/* Translation text */}
              <div
                className="text-sm leading-relaxed"
                style={{
                  direction: t.language.direction || "ltr",
                  color: isDark ? "#e2e8f0" : "#1e293b",
                  minHeight: "2.5em",
                }}
              >
                {t.isLoading ? (
                  <motion.div className="flex items-center gap-1">
                    <span className="text-[var(--text-muted)]">Translating</span>
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="text-[var(--text-muted)]"
                    >
                      ...
                    </motion.span>
                  </motion.div>
                ) : t.text ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="line-clamp-2"
                  >
                    {t.text}
                  </motion.span>
                ) : (
                  <span className="text-[var(--text-muted)]">—</span>
                )}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
}
