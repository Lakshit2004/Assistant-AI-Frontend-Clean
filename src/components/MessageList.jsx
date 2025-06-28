import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import { Bot, Volume2 } from 'lucide-react';

const MessageList = ({ messages, isLoading, isSpeaking, darkMode }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isSpeaking]);

  return (
    <div className={`flex-1 rounded-2xl backdrop-blur-lg border overflow-hidden relative ${ // Added 'relative'
      darkMode 
        ? 'bg-gray-900/30 border-gray-700' 
        : 'bg-white/30 border-gray-200'
    }`}>
      <div className="h-full overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index} // Use index as fallback key
            message={message}
            darkMode={darkMode}
          />
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3 animate-fadeIn">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-purple-600' : 'bg-purple-500'}`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`rounded-2xl px-4 py-3 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="flex space-x-2">
                <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`} style={{animationDelay: '0s'}}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`} style={{animationDelay: '0.1s'}}></div>
                <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-400' : 'bg-purple-500'}`} style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

       {isSpeaking && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className={`px-4 py-2 rounded-full shadow-lg ${
              darkMode ? 'bg-green-600 text-green-100' : 'bg-green-100 text-green-800 border border-green-200'
            } flex items-center space-x-2`}>
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium">Speaking...</span>
            </div>
          </div>
        )}
    </div>
  );
};

export default MessageList;
