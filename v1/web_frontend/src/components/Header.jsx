import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-around">
      {/* Logo - replace with <img src="..." /> if using an image */}
      <div className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => navigate('/')}>
        OdishaVox
      </div>

      {/* Feedback Button */}
      <button
        onClick={() => navigate('/feedback')}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition"
      >
        Feedback
      </button>
    </header>
  );
}

export default Header;
