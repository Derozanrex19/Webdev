import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Bot, Sparkles, Loader2, X, Trash2 } from 'lucide-react';
import { getIvaResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface IvaChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialMessage: ChatMessage = {
  id: 'welcome',
  role: 'model',
  text:
    "Hello, I am Iva. Lifewood's Intelligent Virtual Assistant. I can explain our data processing capabilities, ESG initiatives, or global reach. How may I assist your business today?",
  timestamp: new Date(),
};

const IvaChat: React.FC<IvaChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const submitPrompt = useCallback(async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const historyForModel = [...messages, userMsg].map((m) => ({ role: m.role, text: m.text }));
      const responseText = await getIvaResponse(trimmed, historyForModel);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      console.error('Chat error', error);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    const raw = window.localStorage.getItem('ivaAdminContext');
    if (!raw) return;
    window.localStorage.removeItem('ivaAdminContext');

    let parsed: { type: 'career' | 'contact'; data: any } | null = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    if (!parsed) return;

    const { type, data } = parsed;
    const question =
      type === 'career'
        ? `You are Lifewood's virtual assistant helping an admin review a job application.\n\nCandidate name: ${data.first_name} ${data.last_name}\nPosition: ${data.position_applied}\nCountry: ${data.country}\nEmail: ${data.email}\nPhone: ${data.phone_code} ${data.phone_number}\nGender: ${data.gender}\nAge: ${data.age}\nAddress: ${data.current_address}\nStatus: ${data.status}\n\nSummarize this candidate in 3–4 sentences and suggest concise next steps for the recruiter. Be specific but brief.`
        : `You are Lifewood's virtual assistant helping an admin respond to a contact message.\n\nSender: ${data.first_name} ${data.last_name}\nEmail: ${data.email}\nMessage:\n${data.message}\n\nFirst, summarize what this person is asking for in 1–2 sentences. Then suggest a short, warm, professional reply the admin could send (3–4 sentences).`;

    void submitPrompt(question);
  }, [isOpen, submitPrompt]);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void submitPrompt(inputText);
    }
  };

  const suggestedPrompts = [
    'How does Lifewood ensure data accuracy?',
    'Tell me about the Pottya initiative.',
    'Where are your offices located?',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[95]">
      <div className="absolute inset-0 bg-[#08110d]/40 backdrop-blur-[2px]" onClick={onClose} />

      <div className="absolute bottom-4 right-4 flex h-[min(78vh,720px)] w-[min(96vw,440px)] flex-col overflow-hidden rounded-[28px] border border-white/12 bg-[#0d1512]/96 shadow-[0_28px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:bottom-6 sm:right-6">
        <div className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(180deg,rgba(19,48,32,0.98),rgba(13,21,18,0.98))] px-5 py-4">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-lifewood-castleton/45 blur-2xl" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-lifewood-saffron p-2 text-lifewood-darkSerpent">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Meet Iva</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-lifewood-saffron">Always On</p>
                </div>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-lifewood-earth">
                Ask about Lifewood services, ESG initiatives, global reach, or let Iva help with admin workflows.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMessages([initialMessage])}
                className="rounded-full p-2 text-white/55 hover:bg-white/10 hover:text-white"
                aria-label="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-white/55 hover:bg-white/10 hover:text-white"
                aria-label="Close Iva"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-white/8 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInputText(prompt)}
                className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <Sparkles className="h-3 w-3 text-lifewood-saffron" />
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden bg-[#f8f6f0]">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(#133020 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <div ref={messagesContainerRef} className="relative z-10 flex h-full flex-col gap-4 overflow-y-auto px-4 py-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                    msg.role === 'user'
                      ? 'rounded-br-none bg-lifewood-castleton text-white'
                      : 'rounded-bl-none border border-gray-100 bg-white text-lifewood-darkSerpent'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <p className="mt-2 text-right text-[10px] uppercase tracking-widest opacity-45">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-3 rounded-2xl rounded-bl-none border border-gray-100 bg-white p-4 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-lifewood-saffron" />
                  <span className="text-sm font-medium text-gray-500">Processing ecosystem data...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white px-4 py-4">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message to Iva..."
              className="w-full rounded-2xl border border-transparent bg-lifewood-seasalt py-3.5 pl-4 pr-14 text-lifewood-darkSerpent placeholder:text-gray-400 focus:border-lifewood-castleton/15 focus:outline-none focus:ring-2 focus:ring-lifewood-castleton/20"
            />
            <button
              onClick={() => void submitPrompt(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="absolute right-2 rounded-xl bg-lifewood-darkSerpent p-2.5 text-lifewood-saffron transition-colors hover:bg-lifewood-castleton disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IvaChat;
