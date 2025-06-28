import React from 'react';
import { Mic, MicOff, Send } from 'lucide-react';

const InputArea = ({
  chatMode,
  inputMessage,
  setInputMessage,
  sendMessage,
  startListening,
  isListening,
  isLoading,
  darkMode,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isSendDisabled = (chatMode === 'text' && !inputMessage.trim()) || isLoading;

  return (
    <div className={`mt-4 rounded-2xl backdrop-blur-lg border p-3 sm:p-4 transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-900/30 border-gray-700' 
        : 'bg-white/30 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            chatMode === 'text' 
              ? (darkMode ? 'bg-blue-400' : 'bg-blue-500')
              : (darkMode ? 'bg-purple-400' : 'bg-purple-500')
          } animate-pulse`}></div>
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {chatMode === 'text' ? 'Text Chat Mode' : 'Voice Chat Mode'}
          </span>
        </div>
        
        {isListening && (
          <div className="flex items-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-400">Listening...</span>
          </div>
        )}
      </div>

      <div className="flex items-end space-x-2 sm:space-x-3">
        {chatMode === 'text' ? (
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className={`w-full px-4 py-3 rounded-xl border-2 resize-none transition-all duration-200 focus:ring-2 focus:ring-offset-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:ring-offset-gray-900' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:ring-offset-white'
              } focus:border-transparent`}
              rows="1"
              style={{ minHeight: '52px', maxHeight: '150px' }}
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="flex-1">
            <div className={`px-4 py-3 rounded-xl border-2 min-h-[52px] flex items-center justify-center text-center ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <span className={inputMessage ? (darkMode ? 'text-white' : 'text-gray-900') : (darkMode ? 'text-gray-400' : 'text-gray-500')}>
                {isListening ? '...' : (inputMessage || 'Click the microphone to speak')}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          {chatMode === 'voice' && (
            <button
              onClick={startListening}
              disabled={isListening || isLoading}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
              className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-lg'
                  : (darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600') + ' text-white'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => sendMessage()}
            disabled={isSendDisabled}
            aria-label="Send message"
            className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 ${
              darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
            } text-white`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputArea;
