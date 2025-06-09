import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder }) => {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
};

export default Input;
