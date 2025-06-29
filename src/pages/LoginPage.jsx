import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/chat');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/users/google`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-gradient-to-tr from-blue-900 via-gray-900 to-purple-900 flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-white/10 rounded-2xl animate-pulse mb-6">
          <Bot className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Assistant</h1>
        <p className="text-lg text-gray-300">Your personal, intelligent companion. Ready to assist you anytime, anywhere.</p>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-400 mb-8">Sign in to continue</p>

          {error && <p className="bg-red-500/20 text-red-400 text-center p-3 rounded-lg mb-4">{error}</p>}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-3 px-4 bg-white hover:bg-gray-200 rounded-lg font-semibold text-gray-800 transition-colors shadow-md"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"> {/* ...svg path unchanged... */} </svg>
              Sign in with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gray-900 px-2 text-gray-400">OR</span>
              </div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">Login with Email</button>
            </form>
          </div>

          <p className="text-center text-gray-400 mt-8">Don't have an account? <Link to="/register" className="font-medium text-blue-400 hover:text-blue-500">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
