import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';

// 1. Import your translation files
import en from '../locales/en.json';
import hi from '../locales/hi.json';
import bn from '../locales/bn.json';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // 2. Language State (Default to English)
  const [lang, setLang] = useState('en');

  // 3. Logic to pick the correct dictionary
  const t = lang === 'en' ? en : lang === 'hi' ? hi : bn;

  const getDashboardLink = () => {
    if (!user) return '/';
    return '/';
  };

  const closeMenu = () => setMenuOpen(false);

  const isActiveLink = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const getTextClasses = (path, exact = false) => {
    const baseClasses = "font-medium transition-all duration-200 relative";
    const activeClasses = "text-gray-900 font-semibold";
    const inactiveClasses = "text-gray-600 hover:text-gray-900";
    const isActive = isActiveLink(path, exact);
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setMenuOpen(prev => !prev)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link to={getDashboardLink()} className="text-xl font-bold text-blue-600" onClick={closeMenu}>
            {t.exam_portal}
          </Link>

          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className={getTextClasses('/', true)}>
                {t.dashboard}
              </Link>
              {/* Add other translated links here using t.key_name */}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* 4. Language Switcher Dropdown */}
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg p-1.5 bg-gray-50 focus:ring-blue-500 outline-none"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>

          {user ? (
            <ProfileDropdown user={user} />
          ) : (
            <Link to="/login" className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
              {t.login}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;