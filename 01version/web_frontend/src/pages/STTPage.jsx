import React from 'react';

function STTPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Speech to Text (STT)</h1>
      <p className="text-gray-600 text-center max-w-md">
        This page will transcribe your voice into written text using speech recognition.
      </p>
    </div>
  );
}

export default STTPage;
