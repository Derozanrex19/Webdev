import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Send, Bot, Sparkles, Loader2, X, Trash2 } from 'lucide-react';
import { getIvaResponse, getResumeReviewFromUrl, type IvaAdminContext } from '../services/geminiService';
import { ChatMessage } from '../types';
import { supabase } from '../services/supabaseClient';

const CAREER_BUCKET = 'career-documents';
const IVA_ADMIN_DIRECTORY_KEY = 'lifewood-iva-admin-directory';

type AdminCareerDirectoryItem = {
  id: string;
  first_name?: string;
  last_name?: string;
  position_applied?: string;
  country?: string;
  email?: string;
  phone_code?: string;
  phone_number?: string;
  gender?: string;
  age?: number | string;
  current_address?: string;
  status?: string;
  resume_path?: string;
  resume_file_name?: string;
  resumeReview?: {
    score?: number;
    summary?: string;
    strengths?: string[];
    improvements?: string[];
    recommendation?: string;
  } | null;
};

type AdminDirectory = {
  careers?: AdminCareerDirectoryItem[];
  contacts?: Array<{
    first_name?: string;
    last_name?: string;
    email?: string;
    message?: string;
  }>;
};

interface IvaChatProps {
  isOpen: boolean;
  onClose: () => void;
  adminOnly?: boolean;
}

const getInitialMessage = (adminOnly: boolean): ChatMessage => ({
  id: 'welcome',
  role: 'model',
  text: adminOnly
    ? "Hello, I am Iva. I can help you review applicants, assess CVs, draft replies, and support administrative decisions inside the Lifewood dashboard."
    : "Hello, I am Iva. Lifewood's Intelligent Virtual Assistant. I can explain our data processing capabilities, ESG initiatives, or global reach. How may I assist your business today?",
  timestamp: new Date(),
});

const IvaChat: React.FC<IvaChatProps> = ({ isOpen, onClose, adminOnly = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage(adminOnly)]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [adminContext, setAdminContext] = useState<IvaAdminContext | null>(null);
  const [adminDirectory, setAdminDirectory] = useState<AdminDirectory>({});
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const loadAdminDirectory = useCallback(() => {
    try {
      const raw = window.localStorage.getItem(IVA_ADMIN_DIRECTORY_KEY);
      if (!raw) return {};
      return JSON.parse(raw) as AdminDirectory;
    } catch {
      return {};
    }
  }, []);

  const buildCareerContext = useCallback((career: AdminCareerDirectoryItem): IvaAdminContext => ({
    type: 'career',
    data: {
      first_name: career.first_name,
      last_name: career.last_name,
      position_applied: career.position_applied,
      country: career.country,
      email: career.email,
      phone_code: career.phone_code,
      phone_number: career.phone_number,
      gender: career.gender,
      age: career.age,
      current_address: career.current_address,
      status: career.status,
      resumeReview: career.resumeReview || undefined,
    },
  }), []);

  const candidateMentionFromPrompt = useCallback((prompt: string, directory: AdminDirectory) => {
    const normalizedPrompt = prompt.toLowerCase();
    const careers = directory.careers || [];
    return careers.find((career) => {
      const fullName = `${career.first_name || ''} ${career.last_name || ''}`.trim().toLowerCase();
      return Boolean(
        fullName && normalizedPrompt.includes(fullName) ||
        (career.email && normalizedPrompt.includes(career.email.toLowerCase()))
      );
    }) || null;
  }, []);

  const buildAdminDirectorySummary = useCallback((directory: AdminDirectory) => {
    const careers = (directory.careers || []).slice(0, 40).map((career) => {
      const fullName = `${career.first_name || ''} ${career.last_name || ''}`.trim() || 'Unknown candidate';
      const reviewScore = career.resumeReview?.score;
      return [
        `Candidate: ${fullName}`,
        `Role: ${career.position_applied || 'Unknown role'}`,
        `Status: ${career.status || 'Unknown'}`,
        `Country: ${career.country || 'Unknown'}`,
        `Email: ${career.email || 'Unknown'}`,
        reviewScore !== undefined ? `CV Score: ${reviewScore}/100` : 'CV Score: not generated yet',
      ].join(' | ');
    });

    const contacts = (directory.contacts || []).slice(0, 20).map((contact) => {
      const fullName = `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown sender';
      return `Contact: ${fullName} | Email: ${contact.email || 'Unknown'} | Message: ${(contact.message || '').slice(0, 140)}`;
    });

    return [...careers, ...contacts].join('\n');
  }, []);

  const ensureCareerContextForPrompt = useCallback(async (prompt: string) => {
    const directory = loadAdminDirectory();
    setAdminDirectory(directory);

    const matchedCareer = candidateMentionFromPrompt(prompt, directory);
    if (!matchedCareer) {
      return adminContext;
    }

    if (matchedCareer.resumeReview) {
      const nextContext = buildCareerContext(matchedCareer);
      setAdminContext(nextContext);
      return nextContext;
    }

    if (!matchedCareer.resume_path) {
      const nextContext = buildCareerContext(matchedCareer);
      setAdminContext(nextContext);
      return nextContext;
    }

    try {
      const { data, error } = await supabase.storage.from(CAREER_BUCKET).createSignedUrl(matchedCareer.resume_path, 60);
      if (error || !data?.signedUrl) {
        const nextContext = buildCareerContext(matchedCareer);
        setAdminContext(nextContext);
        return nextContext;
      }

      const review = await getResumeReviewFromUrl(data.signedUrl, {
        firstName: matchedCareer.first_name || '',
        lastName: matchedCareer.last_name || '',
        position: matchedCareer.position_applied || 'Unknown role',
        country: matchedCareer.country || 'Unknown country',
        status: matchedCareer.status || 'submitted',
      });

      const nextDirectory: AdminDirectory = {
        ...directory,
        careers: (directory.careers || []).map((career) =>
          career.id === matchedCareer.id ? { ...career, resumeReview: review } : career
        ),
      };
      try {
        window.localStorage.setItem(IVA_ADMIN_DIRECTORY_KEY, JSON.stringify(nextDirectory));
      } catch {
        // Ignore local storage write failures.
      }
      setAdminDirectory(nextDirectory);

      const nextContext = buildCareerContext({ ...matchedCareer, resumeReview: review });
      setAdminContext(nextContext);
      return nextContext;
    } catch {
      const nextContext = buildCareerContext(matchedCareer);
      setAdminContext(nextContext);
      return nextContext;
    }
  }, [adminContext, buildCareerContext, candidateMentionFromPrompt, loadAdminDirectory]);

  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const submitPrompt = useCallback(
    async (
      prompt: string,
      displayText?: string,
      historySeed?: ChatMessage[],
      contextOverride?: IvaAdminContext | null
    ) => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const visibleText = displayText?.trim() || trimmed;
    const resolvedContext = contextOverride ?? (adminOnly ? await ensureCareerContextForPrompt(trimmed) : adminContext);
    const activeContext = resolvedContext ?? adminContext;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: visibleText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const baseMessages = historySeed ?? messages;
      const historyForModel = [...baseMessages.map((m) => ({ role: m.role, text: m.text })), { role: 'user', text: trimmed }];
      const responseText = await getIvaResponse(trimmed, historyForModel, {
        mode: adminOnly || activeContext ? 'admin' : 'public',
        adminContext: activeContext,
        adminDirectorySummary: adminOnly ? buildAdminDirectorySummary(loadAdminDirectory()) : '',
      });

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
    },
    [adminContext, adminOnly, buildAdminDirectorySummary, ensureCareerContextForPrompt, loadAdminDirectory, messages]
  );

  useEffect(() => {
    setMessages([getInitialMessage(adminOnly)]);
  }, [adminOnly]);

  useEffect(() => {
    if (!isOpen) return;
    setAdminDirectory(loadAdminDirectory());

    const raw = window.localStorage.getItem('ivaAdminContext');
    if (!raw) {
      if (!adminOnly) {
        setAdminContext(null);
      }
      return;
    }
    window.localStorage.removeItem('ivaAdminContext');

    let parsed: IvaAdminContext | null = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    if (!parsed) return;

    setAdminContext(parsed);

    const question =
      parsed.type === 'career'
        ? `You are helping me review a candidate for Lifewood.\n\nGive me:
1. A concise recruiter assessment
2. Whether this candidate looks strong, moderate, or weak for the role
3. The main strengths
4. The main risks or gaps
5. The most sensible next step`
        : `You are helping me handle a Lifewood contact message.\n\nGive me:
1. A short summary of what this person wants
2. The tone I should use in replying
3. A ready-to-send professional reply`;

    const displayText =
      parsed.type === 'career'
        ? `Review ${parsed.data.first_name || 'this'} ${parsed.data.last_name || 'candidate'} and tell me your assessment`
        : `Help me handle this contact message`;

    const seededMessages = [getInitialMessage(adminOnly)];
    setMessages(seededMessages);
    void submitPrompt(question, displayText, seededMessages, parsed);
  }, [adminOnly, isOpen, loadAdminDirectory, submitPrompt]);

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

  const suggestedPrompts = adminContext?.type === 'career'
    ? [
        'Is this candidate a strong fit for the role?',
        'What are the biggest risks in this application?',
        'Draft a next-step message for this candidate.',
      ]
    : adminContext?.type === 'contact'
      ? [
          'Summarize this message for me.',
          'Draft a professional reply.',
          'What is the best next action here?',
        ]
      : adminOnly
        ? [
            'Which candidate should I prioritize next?',
            'Who looks strongest among the current applicants?',
            'Draft a professional update for an applicant.',
          ]
        : [
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
              {adminContext?.type === 'career' ? (
                <div className="mt-3 inline-flex max-w-full items-center rounded-full border border-lifewood-saffron/25 bg-lifewood-saffron/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-lifewood-saffron">
                  Recruiter Review Mode: {(adminContext.data.first_name || '').trim()} {(adminContext.data.last_name || '').trim()}
                </div>
              ) : adminContext?.type === 'contact' ? (
                <div className="mt-3 inline-flex max-w-full items-center rounded-full border border-lifewood-saffron/25 bg-lifewood-saffron/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-lifewood-saffron">
                  Admin Reply Mode
                </div>
              ) : null}
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-lifewood-earth">
                {adminContext
                  ? 'Iva can now assess the active record, suggest next steps, draft replies, and help with admin decision-making.'
                  : adminOnly
                    ? `Iva can search the current admin records${(adminDirectory.careers || []).length ? ` across ${(adminDirectory.careers || []).length} applicants` : ''}, review CVs, and help with recruiter decisions.`
                    : 'Ask about Lifewood services, ESG initiatives, global reach, or let Iva help with admin workflows.'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setMessages([getInitialMessage(adminOnly)]);
                  if (!adminOnly) {
                    setAdminContext(null);
                  }
                }}
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
                  <span className="text-sm font-medium text-gray-500">
                    {adminContext ? 'Reviewing admin context...' : 'Processing ecosystem data...'}
                  </span>
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
