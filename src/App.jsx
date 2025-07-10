import React, { useState, useEffect } from 'react';
import { callGeminiAPI } from './services/gemini';
import speechService from './services/speech';
import Header from './components/Header';
import MessageList from './components/MessageList';
import InputArea from './components/InputArea';
import DeveloperModal from './components/DeveloperModal';

const App = () => {

  const [darkMode, setDarkMode] = useState(true);
  const [chatMode, setChatMode] = useState('text'); // 'text' or 'voice'
  const [showDeveloper, setShowDeveloper] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  
  // Status Indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Voice Controls
  const [voiceEnabled, setVoiceEnabled] = useState(true);


  useEffect(() => {

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    // Load chat history
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{
        id: Date.now(),
        text: "Hello! I'm your AI assistant. Choose text chat or voice mode to get started. How can I help you today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [darkMode, messages]);
  
  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await callGeminiAPI(messageText);
      const botMessage = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      if (chatMode === 'voice' && voiceEnabled) {
        speechService.speak(response, () => setIsSpeaking(true), () => setIsSpeaking(false));
      }
    } catch (error) {
      // Error is already logged in the service, just update UI
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, an error occurred. Please check the console for details.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (isListening || !speechService.recognition) return;
    
    setIsListening(true);
    speechService.startListening({
      onResult: (transcript) => {
        setInputMessage(transcript);
        sendMessage(transcript); 
      },
      onEnd: () => setIsListening(false),
      onError: (error) => {
        console.error("Speech Recognition Error:", error);
        setIsListening(false);
      }
    });
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const newChat = () => {
    speechService.cancel();
    setMessages([{
      id: Date.now(),
      text: "New chat started. How can I assist you?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputMessage('');
    setIsSpeaking(false);
  };
  
  return (
    <div className={`min-h-screen font-sans transition-all duration-500 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-blue-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-purple-300'
        }`} style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-screen">
        <Header 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          chatMode={chatMode}
          setChatMode={setChatMode}
          voiceEnabled={voiceEnabled}
          toggleSpeech={toggleSpeech}
          newChat={newChat}
          setShowDeveloper={setShowDeveloper}
        />

        <main className="max-w-4xl w-full mx-auto px-4 pb-4 flex-1 flex flex-col overflow-hidden">
          <MessageList
            messages={messages}
            isLoading={isLoading}
            isSpeaking={isSpeaking}
            darkMode={darkMode}
          />

          <InputArea
            chatMode={chatMode}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            sendMessage={sendMessage}
            startListening={startListening}
            isListening={isListening}
            isLoading={isLoading}
            darkMode={darkMode}
          />
        </main>
      </div>

      {showDeveloper && (
        <DeveloperModal darkMode={darkMode} setShowDeveloper={setShowDeveloper} />
      )}
    </div>
  );
};

export default App;

