import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <img src="" alt="" />
        <h1 className="text-4xl font-bold text-indigo-600 mb-8">OdishaVox</h1>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/tts')}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
          >
            Text to Speech
          </button>
          <button
            onClick={() => navigate('/sts')}
            className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
          >
            Speech to Speech
          </button>
          <button
            onClick={() => navigate('/stt')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl transition duration-300"
          >
            Speech to Text
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
