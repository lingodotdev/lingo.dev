import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
      className="w-full mt-16 bg-white/80 backdrop-blur-md border-t border-white/40 shadow-inner px-6 py-8 flex flex-col items-center space-y-6 text-gray-700 z-50"
    >
      {/* Brand */}
      <div className="text-3xl font-bold tracking-tight">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-purple-600">Student</span>
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
            Nest
          </span>
        </Link>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-6 text-sm sm:text-base font-medium">
        <Link to="/room" className="hover:text-purple-600 transition">
          Get Room
        </Link>
        <Link to="/about" className="hover:text-purple-600 transition">
          About
        </Link>
        <Link to="/connectus" className="hover:text-purple-600 transition">
          Connect Us
        </Link>
        {/* <Link to="/terms" className="hover:text-purple-600 transition">
          Terms
        </Link> */}
        {/* <Link to="/privacy" className="hover:text-purple-600 transition">
          Privacy
        </Link> */}
      </div>

      {/* Bottom Line */}
      <div className="text-xs text-gray-500 text-center">
        © {new Date().getFullYear()} Student Nest. All rights reserved.
      </div>
    </motion.footer>
  );
}
