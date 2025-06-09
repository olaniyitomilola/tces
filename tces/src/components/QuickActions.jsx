import React from 'react';

export default function QuickActions({ actions }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-3 text-orange-600">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map(a => (
          <button
            key={a.label}
            onClick={a.onClick}
            className="flex items-center gap-2 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-md"
          >
            <a.icon className="w-5 h-5" />
            <span className="text-sm">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
