import React from 'react';

const StatsCard = ({ title, value }) => (
  <div className="bg-orange-50 border border-orange-200 p-5 rounded-lg shadow-sm flex flex-col items-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="mt-2 text-3xl font-bold text-orange-600">{value}</p>
  </div>
);

export default StatsCard;
