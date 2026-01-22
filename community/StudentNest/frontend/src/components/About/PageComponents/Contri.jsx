import React from 'react';
import { motion } from 'framer-motion';

export default function Contri() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-orange-50 p-6 pt-40 text-gray-800"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-10 md:p-12">
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-center mb-6 text-purple-700">
          About <span className="text-orange-500">Student Nest</span>
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-700 mb-5 leading-relaxed">
          <strong className="text-orange-500">Student Nest</strong> is a platform built by students, for students. 
          Our mission is to empower learners by providing a unified space for collaboration, communication, and innovation.
          Whether it’s finding a roommate, managing projects, or staying organized — Student Nest is your academic home base.
        </p>

        <p className="text-lg text-gray-700 mb-5 leading-relaxed">
          We believe in the strength of community learning. By creating a platform where students can connect freely and
          share ideas openly, we aim to build a culture of curiosity, support, and growth.
        </p>

        <hr className="my-8 border-gray-300" />

        {/* Team Section */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">👥 Our Team</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Yash Ghavghave</strong> – Founder & Full-Stack Developer
          </li>
          <li>
            <strong>Contributors</strong> – Amazing people who supported, debugged, and uplifted this vision.
          </li>
        </ul>

        {/* Tech stack / Footer note */}
        <div className="mt-10 text-center text-sm text-gray-500">
          🚀 Built with <span className="text-red-500">❤️</span> using <strong>React</strong>, <strong>Express</strong>, <strong>MongoDB</strong>, and <strong>Framer Motion</strong>.
        </div>
      </div>
    </motion.div>
  );
}
