// src/components/MainLayout.jsx
import React from 'react';
import { LogOut } from 'lucide-react';

const MainLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    // make this fill its parent and hide overflow above the main
    <div className="flex flex-col flex-1 overflow-hidden">
      <header className="flex items-center justify-between bg-orange-100 px-6 py-4 shadow-md">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-sm text-gray-600 font-medium">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      {/* only this scrolls */}
      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
