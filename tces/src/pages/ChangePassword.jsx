
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import AuthLayout from '../layouts/AuthLayout';

const ChangePassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid or missing token.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validatePassword = (pwd) => {
    const lengthCheck = pwd.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(pwd);
    const numberCheck = /[0-9]/.test(pwd);
    return lengthCheck && uppercaseCheck && numberCheck;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password) {
      setError('Password is required.');
      setMessage('');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters, include an uppercase letter and a number.');
      setMessage('');
      return;
    }

    if (!token) {
      setError('Token is missing.');
      return;
    }

    // Simulate password update with token
    setMessage('Your password has been changed successfully.');
    setError('');
    console.log('Password changed with token:', token);

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Change Password</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4">{message}</p>}
        <Input
          label="New Password"
          type="password"
          name="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your new password"
        />
        <Button type="submit" className="w-full">Change Password</Button>
      </form>
    </AuthLayout>
  );
};

export default ChangePassword;