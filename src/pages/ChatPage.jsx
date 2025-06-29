import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { callGeminiAPI } from '../services/gemini';
import speechService from '../services/speech';

import Header from '../components/Header';
import MessageList from '../components/MessageList';
import InputArea from '../components/InputArea';
import DeveloperModal from '../components/DeveloperModal';
import Sidebar from '../components/Sidebar';

const ChatPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showDeveloper, setShowDeveloper] = useState(false);
  const [chatMode, setChatMode] = useState('text');
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchConversations = useCallback(async () => {
    if (!userInfo) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      } else {
        console.error("Failed to fetch conversations, status:", res.status);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      fetchConversations();
    }
  }, [userInfo, fetchConversations]);

  const handleSelectConversation = async (convoId) => {
    if (!userInfo || convoId === currentConversationId) return;
    setIsLoading(true);
    speechService.cancel();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations/${convoId}`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentConversationId(data._id);
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch conversation details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    speechService.cancel();
    setCurrentConversationId(null);
    setMessages([]);
    setIsSpeaking(false);
    fetchConversations();
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      speechService.cancel();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const startListening = () => {
    if (isListening || isLoading || !speechService.recognition) return;
    setIsListening(true);
    speechService.startListening({
      onResult: (transcript) => {
        sendMessage(transcript);
      },
      onEnd: () => setIsListening(false),
      onError: (error) => {
        console.error("Speech Recognition Error:", error);
        setIsListening(false);
      }
    });
  };

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading || !userInfo) return;

    const userMsgForUI = { sender: 'user', text: messageText, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsgForUI]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponseText = await callGeminiAPI(messageText);
      const botMsgForUI = { sender: 'bot', text: botResponseText, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsgForUI]);

      if (voiceEnabled) {
        speechService.speak(botResponseText, () => setIsSpeaking(true), () => setIsSpeaking(false));
      }

      let activeConversationId = currentConversationId;

      const userMessageRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          conversationId: activeConversationId,
          message: { sender: 'user', text: messageText }
        })
      });

      if (userMessageRes.ok) {
        const conversationData = await userMessageRes.json();
        activeConversationId = conversationData._id;
        if (!currentConversationId) {
          setCurrentConversationId(activeConversationId);
        }

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userInfo.token}`
          },
          body: JSON.stringify({
            conversationId: activeConversationId,
            message: { sender: 'bot', text: botResponseText }
          })
        });

        fetchConversations();
      } else {
        console.error("Failed to save user message.");
      }

    } catch (error) {
      console.error("Error in sendMessage flow:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`h-screen font-sans flex transition-all duration-500 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="w-72 flex-shrink-0 hidden md:block">
        <Sidebar
          conversations={conversations}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onLogout={handleLogout}
          darkMode={darkMode}
          selectedConversationId={currentConversationId}
          isLoading={isLoading}
        />
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header
          darkMode={darkMode} setDarkMode={setDarkMode}
          newChat={handleNewChat} setShowDeveloper={setShowDeveloper}
          chatMode={chatMode} setChatMode={setChatMode}
          voiceEnabled={voiceEnabled} toggleSpeech={toggleSpeech}
        />
        <main className="max-w-4xl w-full mx-auto px-4 pb-4 flex-1 flex flex-col overflow-hidden">
          {(messages && messages.length > 0) || isLoading ? (
            <MessageList messages={messages} isLoading={isLoading} isSpeaking={isSpeaking} darkMode={darkMode} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Assistant</h1>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Select a past conversation or start a new one.</p>
              </div>
            </div>
          )}
          <InputArea
            chatMode={chatMode} inputMessage={inputMessage} setInputMessage={setInputMessage}
            sendMessage={sendMessage} startListening={startListening}
            isListening={isListening} isLoading={isLoading} darkMode={darkMode}
          />
        </main>
      </div>
      {showDeveloper && <DeveloperModal darkMode={darkMode} setShowDeveloper={setShowDeveloper} />}
    </div>
  );
};

export default ChatPage;
