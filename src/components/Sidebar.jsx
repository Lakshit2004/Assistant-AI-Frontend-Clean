    import React from 'react';
    import { MessageSquare, Plus, LogOut } from 'lucide-react';

    const Sidebar = ({ conversations, onSelectConversation, onNewChat, onLogout, darkMode, selectedConversationId }) => {
      return (
        <div className={`h-full flex flex-col p-3 transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-gray-100 border-r border-gray-700' : 'bg-gray-100 text-gray-800 border-r border-gray-200'}`}>
          <button
            onClick={onNewChat}
            className={`flex items-center justify-center w-full p-3 mb-4 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Chat
          </button>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <h2 className="text-xs font-bold uppercase text-gray-400 mb-2 px-2">Chat History</h2>
            <ul className="space-y-2">
              {conversations.map((convo) => (
                <li key={convo._id}>
                  <button
                    onClick={() => onSelectConversation(convo._id)}
                    className={`w-full text-left flex items-center p-2 rounded-lg text-sm transition-colors ${
                        selectedConversationId === convo._id 
                        ? (darkMode ? 'bg-gray-600' : 'bg-gray-300') 
                        : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200')
                    }`}
                  >
                    <MessageSquare className={`mr-3 h-4 w-4 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className="truncate">{convo.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2 mt-2 border-t border-gray-700">
            <button
              onClick={onLogout}
              className={`flex items-center w-full p-3 rounded-lg font-semibold transition-colors ${darkMode ? 'hover:bg-red-800/50 text-red-400' : 'hover:bg-red-200 text-red-600'}`}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      );
    };

    export default Sidebar;
    