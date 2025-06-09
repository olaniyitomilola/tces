// src/components/AlertsPanel.jsx
import React from 'react';

export default function AlertsPanel({ alerts }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col">
      {/* Header with counter */}
      <h3 className="text-lg font-semibold mb-4 text-orange-600">
       Vehicle Alerts ({alerts.length})
      </h3>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto max-h-32 space-y-3 pr-2">
        {alerts.length === 0 ? (
          <p className="text-sm text-gray-500">No vehicle alerts.</p>
        ) : (
          alerts.map(a => {
            const { id, registration, label, daysLeft, dueDateString } = a;

            const isExpired = daysLeft < 0;
            const isUrgent  = daysLeft >= 0 && daysLeft <= 7;

            // Border and text colors
            const borderColor = isExpired
              ? 'border-red-500'
              : isUrgent
                ? 'border-yellow-500'
                : 'border-green-500';

            const textColor = isExpired
              ? 'text-red-600'
              : isUrgent
                ? 'text-yellow-600'
                : 'text-green-600';

            const verb = isExpired
              ? `expired ${Math.abs(daysLeft)} days ago`
              : `will expire in ${daysLeft} days`;

            return (
              <div
                key={id}
                className={`
                  flex justify-between items-center p-3 
                  border-l-4 ${borderColor} 
                  bg-gray-50 rounded
                `}
              >
                <div>
                  <p className={`font-semibold ${textColor}`}>
                    {registration} 
                  </p>
                  <p className="italic text-sm text-gray-700">{label}  {verb}</p>
                </div>
                <span className="text-xs text-gray-500">{dueDateString}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
