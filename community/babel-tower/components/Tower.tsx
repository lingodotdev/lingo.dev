"use client";

import { motion } from "framer-motion";

export function Tower() {
  const levels = 8;

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none opacity-20">
      <div className="relative flex flex-col items-center">
        {Array.from({ length: levels }).map((_, i) => {
          const width = 100 - i * 10;
          const delay = (levels - i) * 0.1;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: delay + 0.5 }}
              style={{ width: `${width}%` }}
              className="relative"
            >
              <div
                className="h-12 md:h-16 tower-gradient rounded-t-sm mb-0.5 relative overflow-hidden"
                style={{
                  clipPath: "polygon(5% 100%, 95% 100%, 90% 0%, 10% 0%)",
                }}
              >
                <div className="absolute inset-0 flex justify-around items-center px-4">
                  {Array.from({ length: Math.max(2, 5 - Math.floor(i / 2)) }).map((_, j) => (
                    <div
                      key={j}
                      className="w-2 h-6 md:h-8 bg-black/30 rounded-t"
                    />
                  ))}
                </div>
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
              </div>
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="absolute -top-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-4 h-16 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full" />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-400 rounded-full blur-md"
          />
        </motion.div>
      </div>
    </div>
  );
}
