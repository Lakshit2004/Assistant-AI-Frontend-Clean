import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const errors = {};
    if (name.length > 20) {
      errors.name = 'Name cannot exceed 20 characters.';
    }
    if (password.length > 0 && password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    } else if (password.length > 0 && (!/\d/.test(password) || !/[a-zA-Z]/.test(password))) {
      errors.password = 'Password must contain letters and numbers.';
    }
    setValidationErrors(errors);
  }, [name, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (Object.keys(validationErrors).length > 0) {
      setError('Please fix the errors before submitting.');
      return;
    }
    try {
      const response = await fetch('https://assistant-ai-backend-clean.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row-reverse">
      {/* Right Branding Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-tl from-purple-900 via-gray-900 to-blue-900 flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-white/10 rounded-2xl animate-pulse mb-6">
            <Bot className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Us</h1>
        <p className="text-lg text-gray-300">Create an account to unlock your personalized AI experience.</p>
      </div>

      {/* Left Register Form Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Create an Account</h2>
          <p className="text-center text-gray-400 mb-8">Get started in seconds</p>
          
          {error && <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                className={`mt-1 block w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${validationErrors.name ? 'border-red-500' : 'border-gray-600'}`}
              />
              {validationErrors.name && <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
              <input
                type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className={`mt-1 block w-full px-4 py-3 bg-gray-700 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${validationErrors.password ? 'border-red-500' : 'border-gray-600'}`}
              />
              {validationErrors.password && <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>}
            </div>
            <button
              type="submit"
              disabled={Object.keys(validationErrors).length > 0}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-400 mt-8">Already have an account?{' '}<Link to="/" className="font-medium text-blue-400 hover:text-blue-500">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
