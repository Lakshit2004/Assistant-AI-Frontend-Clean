// src/components/DeveloperModal.jsx
import React from 'react';

const DeveloperModal = ({ darkMode, setShowDeveloper }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setShowDeveloper(false)}
    >
      <div 
        className={`max-w-md w-full rounded-2xl p-6 shadow-2xl transform transition-all duration-300 ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        
        {/* Developer Avatar */}
        <div className="text-center mb-4">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold ${
            darkMode ? 'bg-gradient-to-tr from-blue-600 to-purple-600' : 'bg-gradient-to-tr from-blue-500 to-purple-500'
          } text-white shadow-lg`}>
            LS
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Developed by
          </h3>
          <p className={`text-2xl font-bold bg-gradient-to-r ${
            darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent`}>
            Lakshit Singh
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Full Stack Developer & AI Enthusiast
          </p>
        </div>
        
        <button
          onClick={() => setShowDeveloper(false)}
          className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 ${
            darkMode 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DeveloperModal;

