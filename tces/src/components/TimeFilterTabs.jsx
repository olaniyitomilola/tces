// src/components/TimeFilterTabs.jsx
import React from 'react';
import classNames from 'classnames'; // or use your own utility

export default function TimeFilterTabs({ value, onChange }) {
  return (
    <div className="flex space-x-2">
      {['upcoming', 'past'].map(type => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={classNames(
            'px-3 py-1 rounded-full text-sm font-medium',
            value === type
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          )}
        >
          {type === 'upcoming' ? 'Upcoming' : 'Past'}
        </button>
      ))}
    </div>
  );
}
