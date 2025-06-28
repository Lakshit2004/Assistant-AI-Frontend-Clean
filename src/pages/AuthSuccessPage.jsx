import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        
        // Combine token and user data into one object to store
        const userInfo = { ...user, token };

        // Save the user info to localStorage
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        // Redirect to the chat page
        navigate('/chat');
        
      } catch (error) {
        console.error("Failed to parse user data from URL", error);
        // If there's an error, redirect to login
        navigate('/');
      }
    } else {
      // If token or user is missing, redirect to login
      navigate('/');
    }
  }, [searchParams, navigate]);

  // This is just a temporary loading screen for the user
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <p className="text-white text-xl animate-pulse">Logging you in...</p>
    </div>
  );
};

export default AuthSuccessPage;
