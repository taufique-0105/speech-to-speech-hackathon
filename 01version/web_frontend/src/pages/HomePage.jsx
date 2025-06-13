import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMic, FiType, FiRepeat } from 'react-icons/fi';

function HomePage() {
  const navigate = useNavigate();

  const featureCards = [
    {
      title: "Speech to Speech",
      description: "Transform your voice into different speech patterns",
      icon: <FiRepeat className="w-8 h-8 text-green-500" />,
      color: "bg-green-100 hover:bg-green-200",
      route: "/sts",
      btnColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Text to Speech",
      description: "Convert written text into natural sounding speech",
      icon: <FiType className="w-8 h-8 text-indigo-500" />,
      color: "bg-indigo-100 hover:bg-indigo-200",
      route: "/tts",
      btnColor: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "Speech to Text",
      description: "Transcribe spoken words into written text accurately",
      icon: <FiMic className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-100 hover:bg-blue-200",
      route: "/stt",
      btnColor: "bg-blue-600 hover:bg-blue-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="text-indigo-600">Odisha</span>Vox
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your multilingual voice technology platform for Odia language
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featureCards.map((card, index) => (
            <div 
              key={index}
              className={`${card.color} rounded-2xl p-6 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col`}
            >
              <div className="mb-4 self-center">
                {card.icon}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                {card.title}
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                {card.description}
              </p>
              <button
                onClick={() => navigate(card.route)}
                className={`${card.btnColor} text-white font-semibold py-3 px-6 rounded-xl transition duration-300 mt-auto w-full`}
              >
                Try Now
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-indigo-600 text-2xl font-bold mb-2">1</div>
              <h3 className="text-xl font-semibold mb-2">Select Feature</h3>
              <p className="text-gray-600">Choose from our voice technology tools</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-indigo-600 text-2xl font-bold mb-2">2</div>
              <h3 className="text-xl font-semibold mb-2">Input Content</h3>
              <p className="text-gray-600">Provide your text or speech input</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-indigo-600 text-2xl font-bold mb-2">3</div>
              <h3 className="text-xl font-semibold mb-2">Get Results</h3>
              <p className="text-gray-600">Receive your converted output instantly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;