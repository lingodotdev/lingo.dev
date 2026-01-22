"use i18n";
import { Link, useLocation } from "@tanstack/react-router";
import { LocaleSwitcher } from "@lingo.dev/compiler/react";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Menu, X, Map, Calendar, LayoutDashboard, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useTripStore } from "@/store/tripStore";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { trips } = useTripStore();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: <>Home</>, icon: <Sparkles className="w-4 h-4" />, exact: true },
    { to: "/destinations", label: <>Destinations</>, icon: <Map className="w-4 h-4" /> },
    { to: "/planner", label: <>Trip Planner</>, icon: <Calendar className="w-4 h-4" /> },
    { to: "/dashboard", label: <>Dashboard</>, icon: <LayoutDashboard className="w-4 h-4" />, badge: trips.length },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-strong shadow-lg" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center"
              whileHover={{ rotate: 12, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Plane className="w-5 h-5 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-bold text-white text-lg">TravelAI</span>
              <span className="text-gray-400 text-xs block -mt-1">
                <>Powered by Lingo.dev</>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                    isActive
                      ? "text-white bg-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="relative z-10">{item.icon}</span>
                  <span className="relative z-10 font-medium">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="relative z-10 w-5 h-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher
              locales={[
                { code: "en", label: "EN" },
                { code: "es", label: "ES" },
                { code: "fr", label: "FR" },
                { code: "de", label: "DE" },
                { code: "ja", label: "JA" },
                { code: "zh", label: "ZH" },
              ]}
              className="locale-switcher text-sm"
            />
            
            <button
              className="md:hidden w-10 h-10 rounded-lg glass flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="md:hidden glass-strong border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
