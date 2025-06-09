
// src/pages/ResetPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isValidTrackEmail = (email) => {
    const regex = /^[^@\s]+@trackcivileng\.uk$/i;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required.');
      setMessage('');
      return;
    }

    if (!isValidTrackEmail(email)) {
      setError('Please use your company email (user@trackcivileng.uk).');
      setMessage('');
      return;
    }

    // Simulate sending reset link
    setMessage(`A reset link has been sent to ${email}. Check your email`);
    setError('');
    console.log('Reset link sent to:', email);

    // Redirect to login page after delay
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your company email"
        />
        <Button type="submit" className="w-full">Send Reset Link</Button>
      </form>
      <div className="mt-4 text-center">
        <Link to="/" className="text-sm text-orange-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;