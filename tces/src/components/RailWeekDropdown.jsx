// src/components/RailWeekDropdown.jsx
import React from 'react';

export default function RailWeekDropdown({ weeks, selectedWeek, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">Rail Week:</label>
      <select
        value={selectedWeek?.number || ''}
        onChange={e => onChange(+e.target.value)}
        className="px-3 py-1 border rounded"
      >
        {weeks.map(w => (
          <option key={w.number} value={w.number}>
            {w.number}: {w.start.toLocaleDateString()}–{w.end.toLocaleDateString()}
          </option>
        ))}
      </select>
    </div>
  );
}
