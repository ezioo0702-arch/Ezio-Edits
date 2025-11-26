
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Terminal } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AnimusChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Animus Terminal Active. Synchronization complete. Awaiting query regarding Subject: Ezio.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userText);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Connection lost.', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 bg-ac-dark border border-ac-red rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:bg-ac-red hover:text-white transition-all duration-300 eagle:bg-eagle-dark eagle:border-eagle-gold eagle:shadow-[0_0_15px_rgba(251,191,36,0.5)] eagle:hover:bg-eagle-gold eagle:hover:text-black"
        >
          <div className="absolute inset-0 rounded-full border border-ac-red eagle:border-eagle-gold animate-ping opacity-20"></div>
          <MessageSquare className="w-6 h-6 text-ac-red group-hover:text-white transition-colors eagle:text-eagle-gold eagle:group-hover:text-black" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] bg-ac-dark/95 backdrop-blur-md border border-ac-red/50 flex flex-col shadow-2xl relative overflow-hidden eagle:bg-eagle-dark/95 eagle:border-eagle-gold/50 transition-colors duration-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(220,38,38,0.1)_25%,rgba(220,38,38,0.1)_50%,transparent_50%,transparent_75%,rgba(220,38,38,0.1)_75%,rgba(220,38,38,0.1)_100%)] bg-[length:20px_20px] eagle:bg-[linear-gradient(45deg,transparent_25%,rgba(251,191,36,0.1)_25%,rgba(251,191,36,0.1)_50%,transparent_50%,transparent_75%,rgba(251,191,36,0.1)_75%,rgba(251,191,36,0.1)_100%)]"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-ac-red/30 bg-black/50 eagle:border-eagle-gold/30">
            <div className="flex items-center gap-2 text-ac-red eagle:text-eagle-gold">
              <Terminal className="w-5 h-5" />
              <span className="font-mono text-sm tracking-widest uppercase">Animus Terminal v3.0</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-ac-red transition-colors eagle:hover:text-eagle-gold"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 text-sm border-l-2 shadow-lg ${
                    msg.role === 'user' 
                      ? 'bg-gray-800 border-gray-500 text-gray-100' 
                      : 'bg-ac-red/10 border-ac-red text-gray-200 eagle:bg-eagle-gold/10 eagle:border-eagle-gold eagle:text-gray-100'
                  }`}
                >
                  <p className="leading-relaxed font-mono">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-ac-red/10 border-l-2 border-ac-red p-3 text-sm text-ac-red animate-pulse eagle:bg-eagle-gold/10 eagle:border-eagle-gold eagle:text-eagle-gold">
                  Computing response...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-ac-red/30 bg-black/50 eagle:border-eagle-gold/30">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Query database..."
                className="flex-1 bg-transparent border-b border-gray-600 focus:border-ac-red outline-none text-sm text-white py-2 placeholder-gray-600 transition-colors eagle:focus:border-eagle-gold"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="text-ac-red hover:text-white disabled:opacity-50 transition-colors eagle:text-eagle-gold eagle:hover:text-white"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
