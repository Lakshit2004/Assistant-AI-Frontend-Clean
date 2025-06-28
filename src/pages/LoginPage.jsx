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
      const response = await fetch('https://assistant-ai-backend-clean.onrender.com/api/users/login', {
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
    window.location.href = 'https://assistant-ai-backend-clean.onrender.com/api/users/google';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Left Branding Panel */}
      <div className="w-full md:w-1/2 bg-gradient-to-tr from-blue-900 via-gray-900 to-purple-900 flex flex-col items-center justify-center p-12 text-center">
        <div className="p-4 bg-white/10 rounded-2xl animate-pulse mb-6">
            <Bot className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Assistant</h1>
        <p className="text-lg text-gray-300">Your personal, intelligent companion. Ready to assist you anytime, anywhere.</p>
      </div>

      {/* Right Login Form Panel */}
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
                <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.64C34.311 4.764 29.496 2.5 24 2.5C11.413 2.5 1.5 12.413 1.5 25s9.913 22.5 22.5 22.5c11.396 0 20.7-7.983 22.285-18.788A24.017 24.017 0 0 0 43.611 20.083z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.321 2.35-2.073 5.09-2.073 8.019s.752 5.669 2.073 8.019l-5.318 4.14C.959 31.911 0 28.59 0 25s.959-6.911 2.682-9.851l5.624 3.54z"></path><path fill="#4CAF50" d="M24 47.5c5.496 0 10.31-1.764 14.195-4.786l-5.32-4.143c-2.35 1.566-5.22 2.429-8.875 2.429c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.655 0 6.525 .863 8.875 2.429l5.32-4.143C34.311 4.764 29.496 2.5 24 2.5C11.413 2.5 1.5 12.413 1.5 25s9.913 22.5 22.5 22.5z"></path><path fill="#1976D2" d="M43.611 20.083H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.64C34.311 4.764 29.496 2.5 24 2.5C11.413 2.5 1.5 12.413 1.5 25s9.913 22.5 22.5 22.5c11.396 0 20.7-7.983 22.285-18.788A24.017 24.017 0 0 0 43.611 20.083z"></path></svg>
                Sign in with Google
              </button>
              
              <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-600"></div></div><div className="relative flex justify-center text-sm"><span className="bg-gray-900 px-2 text-gray-400">OR</span></div></div>
              
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div><label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label><input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"/></div>
                <div><label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label><input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"/></div>
                <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">Login with Email</button>
              </form>
            </div>

            <p className="text-center text-gray-400 mt-8">Don't have an account?{' '}<Link to="/register" className="font-medium text-blue-400 hover:text-blue-500">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
