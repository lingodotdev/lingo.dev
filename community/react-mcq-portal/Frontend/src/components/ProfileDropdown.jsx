import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-gray-700 font-medium">Hi, {user.name}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm text-gray-600 truncate">{user.email}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
          
          <Link 
            to="/account" 
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            My Account
          </Link>
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;