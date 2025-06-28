import React from 'react';
import { MessageCircle, Mic, Moon, Sun, Plus, Bot, Info, Volume2, VolumeX } from 'lucide-react';

const Header = ({ darkMode, setDarkMode, newChat, setShowDeveloper, chatMode, setChatMode, voiceEnabled, toggleSpeech }) => {
  return (
    <header className={`backdrop-blur-lg border-b sticky top-0 z-10 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/50 border-gray-700' 
        : 'bg-white/50 border-gray-200'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} shadow-lg`}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <h1 className={`hidden sm:block text-2xl font-bold bg-gradient-to-r ${
            darkMode 
              ? 'from-blue-400 to-purple-400' 
              : 'from-blue-600 to-purple-600'
          } bg-clip-text text-transparent`}>
            AI Assistant
          </h1>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mode Toggle */}
          <div className={`flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => setChatMode('text')}
              aria-label="Text mode"
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                chatMode === 'text'
                  ? (darkMode ? 'bg-blue-600' : 'bg-blue-500') + ' text-white shadow-lg'
                  : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Text</span>
            </button>
            <button
              onClick={() => setChatMode('voice')}
              aria-label="Voice mode"
              className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 ${
                chatMode === 'voice'
                  ? (darkMode ? 'bg-purple-600' : 'bg-purple-500') + ' text-white shadow-lg'
                  : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900')
              }`}
            >
              <Mic className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Voice</span>
            </button>
          </div>
          
          {/* Voice Output Toggle */}
          <button
            onClick={toggleSpeech}
            aria-label={voiceEnabled ? 'Disable voice output' : 'Enable voice output'}
            className={`p-2 rounded-lg transition-all duration-200 ${
              voiceEnabled
                ? (darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600') + ' text-white'
                : (darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-400 hover:bg-gray-500') + (darkMode ? ' text-gray-300' : ' text-gray-600')
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              darkMode 
                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowDeveloper(true)}
            aria-label="Show developer info"
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              darkMode 
                ? 'bg-purple-600 text-purple-100 hover:bg-purple-700' 
                : 'bg-purple-500 text-purple-100 hover:bg-purple-600'
            }`}
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
