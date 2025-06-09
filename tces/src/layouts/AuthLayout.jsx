import React from 'react';
import logo from '../assets/logo/logo.png';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Track Civil Logo" className="h-16 object-contain" />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
