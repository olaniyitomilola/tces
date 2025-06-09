// src/components/TopSummary.jsx
import React from 'react';
import { CarFront } from 'lucide-react';

const TopSummary = ({ registration, lastMileage }) => {
  const formattedMileage = lastMileage
    ? lastMileage.toString().padStart(6, '0')
    : '000000';

  return (
    <div className="bg-orange-50 border border-orange-100 p-4 sm:p-6 rounded-lg shadow-sm space-y-4 mb-6">
      <div className="flex justify-between ">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
          <CarFront className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
          {registration}
        </h2>

        <div className="flex flex-col items-start sm:items-end">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Last Mileage
          </span>
          <div className="bg-black text-green-400 font-mono text-base sm:text-lg md:text-xl px-4 py-2 rounded-md shadow-inner tracking-widest">
            {formattedMileage}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSummary;
