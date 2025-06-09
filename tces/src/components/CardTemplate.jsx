import React from 'react';

const CardTemplate = ({ vendor, number, alias, expiry, company }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl p-6 w-80 shadow-lg space-y-4">
      <div className="text-right text-xs">{vendor}</div>
      <div className="text-l font-bold tracking-widest">{number}</div>
      <div className="flex justify-between text-sm">
        <span>{alias}</span>
        <span>{expiry}</span>
      </div>
      <div className="text-sm font-semibold pt-2">{company}</div>
    </div>
  );
};

export default CardTemplate;