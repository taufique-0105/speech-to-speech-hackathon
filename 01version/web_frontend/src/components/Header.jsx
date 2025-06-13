import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiHome, FiUser, FiSettings } from 'react-icons/fi';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo with hover effect */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-700 transition">
            <FiHome className="text-white text-xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 group-hover:text-indigo-600 transition">
            Odisha<span className="text-indigo-600">Vox</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => navigate('/about')}
            className="text-gray-600 hover:text-indigo-600 font-medium transition"
          >
            About
          </button>
          <button 
            onClick={() => navigate('/contact')}
            className="text-gray-600 hover:text-indigo-600 font-medium transition"
          >
            Contact Us
          </button>
        </nav>

        {/* Right-side buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/feedback')}
            className="flex items-center space-x-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg transition"
          >
            <FiMessageSquare className="text-lg" />
            <span className="hidden sm:inline">Feedback</span>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
          >
            <FiUser className="text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;