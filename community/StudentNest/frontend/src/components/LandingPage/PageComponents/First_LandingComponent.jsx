import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'

const codeLines = [
  '<html>',
  '  <head>',
  '    <title>Student Nest</title>',
  '  </head>',
  '  <body>',
  '    <h1>Hello, Engineers!</h1>',
  '    <h2>Welcome to Student Nest</h2>',
  '    <p>Find PGs, hostels, flats & roommates near campus.</p>',
  '  </body>',
  '</html>',
]

export default function TypingLaptopPanel() {
  const [typedLines, setTypedLines] = useState([''])
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (lineIndex >= codeLines.length) {
      // Wait before resetting
      const resetTimeout = setTimeout(() => {
        setTypedLines([''])
        setLineIndex(0)
        setCharIndex(0)
      }, 2000) // 2 second pause before restart
      return () => clearTimeout(resetTimeout)
    }

    const currentLine = codeLines[lineIndex]
    const currentChar = currentLine[charIndex]

    const timeout = setTimeout(() => {
      setTypedLines((prev) => {
        const updated = [...prev]
        updated[lineIndex] = (updated[lineIndex] || '') + currentChar
        return updated
      })

      if (charIndex < currentLine.length - 1) {
        setCharIndex((prev) => prev + 1)
      } else {
        setCharIndex(0)
        setLineIndex((prev) => prev + 1)
        setTypedLines((prev) => [...prev, ''])
      }
    }, 35)

    return () => clearTimeout(timeout)
  }, [charIndex, lineIndex])

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-[#111827] text-green-400 rounded-2xl p-6 shadow-2xl w-[500px] h-[450px] font-mono border border-gray-700 overflow-hidden absolute top-[20vh] left-[60vw]"
    >
      <div className="text-sm bg-gray-800 text-gray-300 p-3 rounded-t-md font-semibold mb-3">
        ⌨️ Coding Dashboard — StudentNest.js
      </div>
      <div className="p-3 text-base leading-relaxed space-y-1 overflow-y-auto h-full">
        {typedLines.map((line, idx) => (
          <p key={idx}>
            {line}
            {idx === lineIndex && (
              <span className="animate-pulse bg-green-400 inline-block w-1 h-5 ml-1" />
            )}
          </p>
        ))}
      </div>
    </motion.div>
  )
}
