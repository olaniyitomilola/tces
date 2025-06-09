import React, { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { toast } from 'react-toastify';

const API = `https://backend-cpgmbqdydya8d6et.westeurope-01.azurewebsites.net/api`
;


const Login = () => {
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null); // holds response from server
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log(API)
  const Spinner = () => (
    <span className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block align-middle" />
  );
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      navigate(storedUser.access === 1 ? '/manager-dashboard' : '/dashboard');
    }
  }, [navigate]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return setError('Please enter your email');

    try {
      setLoading(true);
      const res = await fetch(`${API}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!res.ok) throw new Error('Email not recognized');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setError('User not found or email is invalid');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!password) return setError('Password is required');

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) throw new Error('Incorrect password');
      let data = await res.json();
      data = data.user;

      localStorage.setItem('user', JSON.stringify(data));
      navigate(data.access ? '/manager-dashboard' : '/dashboard');
    } catch (err) {
      setError('Incorrect password');
    }
  };

 const handleActivate = async () => {
  try {
    const response = await fetch(`${API}/auth`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user.id, password }),
    });

    if (!response.ok) throw new Error('Activation failed');

    toast.success('Account activated successfully');
    console.log(response)
    //navigate('/');
  } catch (err) {
    console.error(err);
    toast.error('Failed to activate account');
  }
};

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to TCES portal</h2>

      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

      {!user ? (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            placeholder="Enter your company email"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                Checking...
                <Spinner />
              </>
            ) : 'Next'}
          </Button>

        </form>
      ) : user.is_activated ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="flex justify-end">
            <Link to="/reset-password" className="text-sm text-orange-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                Logging in...
                <Spinner />
              </>
            ) : 'Login'}
          </Button>

        </form>
      ) : (
        <form onSubmit={handleActivate} className="space-y-4">
          <p className="text-center text-sm text-orange-700 font-medium">
            Account not activated. Set a password to activate.
          </p>
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                Activating...
                <Spinner />
              </>
            ) : 'Activate Account'}
          </Button>

        </form>
      )}
    </AuthLayout>
  );
};

export default Login;
