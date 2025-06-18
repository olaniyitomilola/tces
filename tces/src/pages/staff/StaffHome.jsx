import React from 'react';

const StaffHome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-gray-800 p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to TCES Home</h1>
      <p className="text-lg mb-8">This is the main page for related activities.</p>

      {/* Coming Soon Animation */}
      <div className="relative text-4xl font-semibold text-orange-600">
        <span className="animate-pulse">🚧 Coming Soon...</span>
      </div>
    </div>
  );
};

export default StaffHome;
