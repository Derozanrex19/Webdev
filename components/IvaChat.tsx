import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Loader2, X } from 'lucide-react';
import { getIvaResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const IvaChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello, I am Iva. Lifewood's Intelligent Virtual Assistant. I can explain our data processing capabilities, ESG initiatives, or global reach. How may I assist your business today?",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await getIvaResponse(
        userMsg.text, 
        messages.map(m => ({ role: m.role, text: m.text }))
      );

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-lifewood-paper min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl border border-lifewood-darkSerpent/10 overflow-hidden flex flex-col md:flex-row h-[700px]">
        
        {/* Sidebar */}
        <div className="md:w-1/3 bg-lifewood-darkSerpent text-lifewood-paper p-8 flex flex-col relative overflow-hidden">
          {/* Abstract Circle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-lifewood-castleton rounded-bl-full opacity-50"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-lifewood-saffron p-2 rounded-lg text-lifewood-darkSerpent">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="font-sans text-2xl font-bold text-white">Meet Iva</h2>
                 <p className="text-xs text-lifewood-saffron uppercase tracking-widest">Always On</p>
              </div>
            </div>
            
            <p className="text-lifewood-paper/80 mb-8 font-light leading-relaxed">
              Iva represents the pinnacle of our AI integration. Trained on Lifewood's proprietary datasets, I can guide you through our B2B ecosystem.
            </p>
            
            <div className="mt-auto">
              <h4 className="uppercase tracking-widest text-xs font-bold text-lifewood-earth mb-4">Suggested Queries</h4>
              <ul className="space-y-3 text-sm text-lifewood-paper/70">
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2" onClick={() => setInputText("How does Lifewood ensure data accuracy?")}>
                  <Sparkles className="w-3 h-3 text-lifewood-saffron" /> Data Accuracy
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2" onClick={() => setInputText("Tell me about the Pottya initiative.")}>
                  <Sparkles className="w-3 h-3 text-lifewood-saffron" /> ESG Initiatives
                </li>
                <li className="hover:text-white hover:translate-x-1 transition-all cursor-pointer flex items-center gap-2" onClick={() => setInputText("Where are your offices located?")}>
                  <Sparkles className="w-3 h-3 text-lifewood-saffron" /> Global Locations
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-lifewood-seasalt relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#133020 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
                {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                    className={`max-w-[80%] rounded-2xl p-5 shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-lifewood-castleton text-white rounded-br-none' 
                        : 'bg-white text-lifewood-darkSerpent border border-gray-100 rounded-bl-none'
                    }`}
                    >
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <p className="text-[10px] mt-2 opacity-50 text-right uppercase tracking-widest">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    </div>
                </div>
                ))}
                {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center space-x-3">
                    <Loader2 className="w-4 h-4 animate-spin text-lifewood-saffron" />
                    <span className="text-sm text-gray-500 font-medium">Processing ecosystem data...</span>
                    </div>
                </div>
                )}
            </div>

            <div className="p-6 bg-white border-t border-gray-200 relative z-20">
                <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your message to Iva..."
                    className="w-full bg-lifewood-seasalt text-lifewood-darkSerpent placeholder-gray-400 rounded-xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-lifewood-castleton/20 border border-transparent transition-all"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !inputText.trim()}
                    className="absolute right-2 p-2.5 bg-lifewood-darkSerpent text-lifewood-saffron rounded-lg hover:bg-lifewood-castleton disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default IvaChat;
