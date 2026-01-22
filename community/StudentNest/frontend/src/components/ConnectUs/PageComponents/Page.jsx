import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6 pt-32 text-gray-800"
    >
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-10 text-center">
        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 mb-6">
          We'd love to hear from you! Reach out through any of the platforms below.
        </p>

        {/* Social Icons */}
        <div className="flex justify-center gap-8 text-4xl mb-6">
          <a
            href="https://www.linkedin.com/in/yash-ghavghave-3b0782262/?trk=PROFILE_DROP_DOWN"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/yashghavghave"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-700 hover:text-black transition-colors"
          >
            <FaGithub />
          </a>
        </div>

        {/* Email or Alt Contact */}
        <div className="text-sm text-gray-500">
          Want to collaborate or have questions? Feel free to connect on GitHub or LinkedIn.  
          <br />
          
        </div>
      </div>
    </motion.div>
  );
}
