// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-black hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;