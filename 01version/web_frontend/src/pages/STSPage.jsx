import React from 'react';

function STSPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Speech to Speech (STS)</h1>
      <p className="text-gray-600 text-center max-w-md">
        This page will allow real-time or recorded speech to be transformed into another voice or language.
      </p>
    </div>
  );
}

export default STSPage;
