import React from 'react';
import { User, Bot } from 'lucide-react';

const ChatMessage = ({ message, darkMode }) => {
  const { text, sender, timestamp } = message;
  const isUser = sender === 'user';

  // --- NEW: A more robust function to format the timestamp to IST with Date ---
  const formatIST = (timestampInput) => {
    // If no timestamp is provided, return an empty string.
    if (!timestampInput) return '';

    // The new Date() constructor can handle both date objects (from new messages)
    // and date strings (from the database).
    const date = new Date(timestampInput);

    // After attempting to create a date, check if it's valid.
    // If not, return a placeholder.
    if (isNaN(date.getTime())) {
      return 'Sending...';
    }
    
    // Formatting options to include Date and Time in IST.
    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    
    // Use toLocaleString to get both date and time formatted correctly.
    return date.toLocaleString('en-IN', options);
  };

  return (
    <div
      className={`flex items-start space-x-3 max-w-full animate-fadeIn ${
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
        isUser
          ? (darkMode ? 'bg-blue-600' : 'bg-blue-500')
          : (darkMode ? 'bg-purple-600' : 'bg-purple-500')
      }`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-lg ${
        isUser
          ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white')
          : (darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200')
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        <p className={`text-xs mt-2 text-right ${
          isUser
            ? 'text-blue-100/80'
            : (darkMode ? 'text-gray-400' : 'text-gray-500')
        }`}>
          {/* Use the new, more robust formatting function */}
          {formatIST(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
