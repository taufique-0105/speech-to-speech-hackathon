import React from 'react';

function TTSPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">Text to Speech (TTS)</h1>
      <p className="text-gray-600 text-center max-w-md">
        This page will convert typed text into spoken audio using a speech synthesis engine.
      </p>
    </div>
  );
}

export default TTSPage;
