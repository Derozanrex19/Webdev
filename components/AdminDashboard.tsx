import React, { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  Home,
  LogOut,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  Download,
  Eye,
  X,
  ChevronDown,
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../services/supabaseClient';
import { getIvaResponse } from '../services/geminiService';
import GhostLoader from './GhostLoader';

const CAREER_BUCKET = 'career-documents';
const STATUS_OPTIONS = ['submitted', 'reviewed', 'contacted', 'rejected'] as const;
const CAREER_FILTERS_KEY = 'lifewood-career-filters';
const CAREER_NOTES_KEY = 'lifewood-career-notes';
const ACTIVITY_LOG_KEY = 'lifewood-admin-activities';
const CONTACT_HISTORY_KEY = 'lifewood-contact-history';
const CAREER_VIEW_MODE_KEY = 'lifewood-career-view-mode';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_CONTACT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CONTACT_REPLY_TEMPLATE_ID || '';

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
  onGoHome: () => void;
}

type AdminSection = 'overview' | 'careers' | 'contact';

type CareerApplication = {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  age: number;
  phone_code: string;
  phone_number: string;
  email: string;
  position_applied: string;
  country: string;
  current_address: string;
  resume_path: string;
  resume_file_name: string;
  status: string;
  created_at: string;
};

type ContactSubmission = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

type ActivityItem = {
  id: string;
  type: 'status' | 'reply' | 'note' | 'contact';
  title: string;
  detail: string;
  createdAt: string;
};

type ContactHistoryItem = {
  id: string;
  applicantId: string;
  applicantName: string;
  status: string;
  subject: string;
  createdAt: string;
};

type CareerViewMode = 'cards' | 'table';

const STATUS_META: Record<string, { label: string; badge: string; panel: string; dot: string }> = {
  submitted: {
    label: 'Submitted',
    badge: 'bg-lifewood-saffron/18 text-lifewood-saffron',
    panel: 'border-lifewood-saffron/18 bg-lifewood-saffron/5',
    dot: 'bg-lifewood-saffron',
  },
  reviewed: {
    label: 'Reviewed',
    badge: 'bg-cyan-300/16 text-cyan-200',
    panel: 'border-cyan-300/14 bg-cyan-300/5',
    dot: 'bg-cyan-300',
  },
  contacted: {
    label: 'Contacted',
    badge: 'bg-lifewood-castleton/26 text-emerald-200',
    panel: 'border-emerald-300/14 bg-emerald-300/5',
    dot: 'bg-emerald-300',
  },
  rejected: {
    label: 'Rejected',
    badge: 'bg-red-500/22 text-red-200',
    panel: 'border-red-300/14 bg-red-300/5',
    dot: 'bg-red-300',
  },
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, onLogout, onGoHome }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [careerApps, setCareerApps] = useState<CareerApplication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactSubmission[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);
  const [careerFilter, setCareerFilter] = useState<string>('all');
  const [careerPositionFilter, setCareerPositionFilter] = useState<string>('all');
  const [careerCountryFilter, setCareerCountryFilter] = useState<string>('all');
  const [careerSearchInput, setCareerSearchInput] = useState('');
  const [careerSearch, setCareerSearch] = useState('');
  const [contactSearchInput, setContactSearchInput] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [careerViewMode, setCareerViewMode] = useState<CareerViewMode>(() => {
    try {
      return (window.localStorage.getItem(CAREER_VIEW_MODE_KEY) as CareerViewMode) || 'cards';
    } catch {
      return 'cards';
    }
  });
  const [selectedCareer, setSelectedCareer] = useState<CareerApplication | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [careerMailModalOpen, setCareerMailModalOpen] = useState(false);
  const [resumePreviewUrl, setResumePreviewUrl] = useState<string | null>(null);
  const [resumePreviewName, setResumePreviewName] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resumeLoading, setResumeLoading] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccessOpen, setReplySuccessOpen] = useState(false);
  const [draftingReplyWithIva, setDraftingReplyWithIva] = useState(false);
  const [careerNotes, setCareerNotes] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(CAREER_NOTES_KEY) || '{}');
    } catch {
      return {};
    }
  });
  const [toast, setToast] = useState<{ title: string; detail?: string } | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(ACTIVITY_LOG_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [contactHistory, setContactHistory] = useState<ContactHistoryItem[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem(CONTACT_HISTORY_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(CAREER_FILTERS_KEY) || '{}');
      if (saved.careerFilter) setCareerFilter(saved.careerFilter);
      if (saved.careerPositionFilter) setCareerPositionFilter(saved.careerPositionFilter);
      if (saved.careerCountryFilter) setCareerCountryFilter(saved.careerCountryFilter);
      if (saved.careerSearchInput) {
        setCareerSearchInput(saved.careerSearchInput);
        setCareerSearch(saved.careerSearchInput);
      }
      if (saved.contactSearchInput) {
        setContactSearchInput(saved.contactSearchInput);
        setContactSearch(saved.contactSearchInput);
      }
    } catch {
      // Ignore malformed local storage data.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        CAREER_FILTERS_KEY,
        JSON.stringify({
          careerFilter,
          careerPositionFilter,
          careerCountryFilter,
          careerSearchInput,
          contactSearchInput,
        })
      );
    } catch {
      // Ignore local storage write failures.
    }
  }, [careerCountryFilter, careerFilter, careerPositionFilter, careerSearchInput, contactSearchInput]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CAREER_VIEW_MODE_KEY, careerViewMode);
    } catch {
      // Ignore local storage write failures.
    }
  }, [careerViewMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CAREER_NOTES_KEY, JSON.stringify(careerNotes));
    } catch {
      // Ignore local storage write failures.
    }
  }, [careerNotes]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ACTIVITY_LOG_KEY, JSON.stringify(activities.slice(0, 18)));
    } catch {
      // Ignore local storage write failures.
    }
  }, [activities]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CONTACT_HISTORY_KEY, JSON.stringify(contactHistory.slice(0, 20)));
    } catch {
      // Ignore local storage write failures.
    }
  }, [contactHistory]);

  const fetchCareers = useCallback(async () => {
    setLoadingCareers(true);
    const { data, error } = await supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setCareerApps(data || []);
    setLoadingCareers(false);
  }, []);

  const fetchContact = useCallback(async () => {
    setLoadingContact(true);
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setContactMessages(data || []);
    setLoadingContact(false);
  }, []);

  useEffect(() => {
    if (activeSection === 'overview' || activeSection === 'careers') fetchCareers();
  }, [activeSection, fetchCareers]);

  useEffect(() => {
    if (activeSection === 'overview' || activeSection === 'contact') fetchContact();
  }, [activeSection, fetchContact]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCareerSearch(careerSearchInput);
    }, 150);
    return () => window.clearTimeout(id);
  }, [careerSearchInput]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setContactSearch(contactSearchInput);
    }, 120);
    return () => window.clearTimeout(id);
  }, [contactSearchInput]);

  useEffect(() => {
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
    let question = '';
    if (type === 'career') {
      question = `You are Lifewood's virtual assistant helping an admin review a job application.\n\nCandidate name: ${data.first_name} ${data.last_name}\nPosition: ${data.position_applied}\nCountry: ${data.country}\nEmail: ${data.email}\nPhone: ${data.phone_code} ${data.phone_number}\nGender: ${data.gender}\nAge: ${data.age}\nAddress: ${data.current_address}\nStatus: ${data.status}\n\nSummarize this candidate in 3–4 sentences and suggest concise next steps for the recruiter. Be specific but brief.`;
    } else {
      question = `You are Lifewood's virtual assistant helping an admin respond to a contact message.\n\nSender: ${data.first_name} ${data.last_name}\nEmail: ${data.email}\nMessage:\n${data.message}\n\nFirst, summarize what this person is asking for in 1–2 sentences. Then suggest a short, warm, professional reply the admin could send (3–4 sentences).`;
    }

    const userMsg = {
      id: `${Date.now()}`,
      role: 'user' as const,
      text: question,
      timestamp: new Date(),
    };

    // Fire-and-forget: we just seed IVA's conversation; IvaChat
    // will read ivaAdminContext separately via the shared API.
    // This hook exists so we have a single place to clear the key if needed.
  }, []);

  const filteredCareers = careerApps.filter((app) => {
    const matchStatus = careerFilter === 'all' || app.status === careerFilter;
    const matchPosition = careerPositionFilter === 'all' || app.position_applied === careerPositionFilter;
    const matchCountry = careerCountryFilter === 'all' || app.country === careerCountryFilter;
    const q = careerSearch.toLowerCase().trim();
    const matchSearch =
      !q ||
      `${app.first_name} ${app.last_name}`.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.position_applied.toLowerCase().includes(q);
    return matchStatus && matchPosition && matchCountry && matchSearch;
  });

  const filteredContacts = contactMessages.filter((message) => {
    const q = contactSearch.trim().toLowerCase();
    if (!q) return true;

    return (
      `${message.first_name} ${message.last_name}`.toLowerCase().includes(q) ||
      message.email.toLowerCase().includes(q) ||
      message.message.toLowerCase().includes(q)
    );
  });

  const newCareersCount = careerApps.filter((a) => a.status === 'submitted').length;
  const unreadContactCount = contactMessages.filter((m) => !m.read).length;
  const showCareersLoading = loadingCareers && careerApps.length === 0;
  const showContactLoading = loadingContact && contactMessages.length === 0;
  const selectedCareerNote = selectedCareer ? careerNotes[selectedCareer.id] || '' : '';
  const selectedCareerHistory = selectedCareer
    ? contactHistory.filter((item) => item.applicantId === selectedCareer.id).slice(0, 4)
    : [];
  const selectedCount = selectedCareerIds.length;

  const statusBreakdown = STATUS_OPTIONS.map((status) => ({
    status,
    count: careerApps.filter((a) => a.status === status).length,
  }));

  const uniquePositions = Array.from(new Set(careerApps.map((a) => a.position_applied))).sort();
  const uniqueCountries = Array.from(new Set(careerApps.map((a) => a.country))).sort();

  const pushActivity = useCallback((item: Omit<ActivityItem, 'id' | 'createdAt'>) => {
    setActivities((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        ...item,
      },
      ...prev,
    ].slice(0, 18));
  }, []);

  const openToast = useCallback((title: string, detail?: string) => {
    setToast({ title, detail });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (activeSection !== 'contact') return;

    if (!filteredContacts.length) {
      if (selectedContact) setSelectedContact(null);
      return;
    }

    if (!selectedContact) {
      setSelectedContact(filteredContacts[0]);
      return;
    }

    const nextSelected = filteredContacts.find((item) => item.id === selectedContact.id);
    if (!nextSelected) {
      setSelectedContact(filteredContacts[0]);
      return;
    }

    if (nextSelected !== selectedContact) {
      setSelectedContact(nextSelected);
    }
  }, [activeSection, filteredContacts, selectedContact]);

  useEffect(() => {
    setSelectedCareerIds((prev) => prev.filter((id) => filteredCareers.some((app) => app.id === id)));
  }, [filteredCareers]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    await supabase.from('career_applications').update({ status }).eq('id', id);
    await fetchCareers();
    const updatedCareer = careerApps.find((app) => app.id === id);
    if (selectedCareer?.id === id) setSelectedCareer((prev) => (prev ? { ...prev, status } : null));
    if (updatedCareer) {
      pushActivity({
        type: 'status',
        title: `${updatedCareer.first_name} ${updatedCareer.last_name} marked ${STATUS_META[status]?.label || status}`,
        detail: `${updatedCareer.position_applied} · ${updatedCareer.email}`,
      });
      openToast('Status updated', `${updatedCareer.first_name} ${updatedCareer.last_name} is now ${status}.`);
    }
    setUpdatingStatus(false);
  };

  const handleBulkUpdateStatus = async (status: string) => {
    if (!selectedCareerIds.length) return;
    setUpdatingStatus(true);
    await supabase.from('career_applications').update({ status }).in('id', selectedCareerIds);
    const affected = careerApps.filter((app) => selectedCareerIds.includes(app.id));
    await fetchCareers();
    setSelectedCareerIds([]);
    if (affected.length) {
      pushActivity({
        type: 'status',
        title: `${affected.length} applicant${affected.length === 1 ? '' : 's'} marked ${STATUS_META[status]?.label || status}`,
        detail: affected.map((app) => `${app.first_name} ${app.last_name}`).join(', '),
      });
      openToast('Bulk update complete', `${affected.length} applicant${affected.length === 1 ? '' : 's'} moved to ${status}.`);
    }
    setUpdatingStatus(false);
  };

  const toggleCareerSelection = (id: string) => {
    setSelectedCareerIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllVisibleCareers = () => {
    setSelectedCareerIds((prev) =>
      prev.length === filteredCareers.length ? [] : filteredCareers.map((app) => app.id)
    );
  };

  const handleMarkContactRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    await fetchContact();
    const contact = contactMessages.find((message) => message.id === id);
    if (selectedContact?.id === id) setSelectedContact((prev) => (prev ? { ...prev, read: true } : null));
    if (contact && !contact.read) {
      pushActivity({
        type: 'contact',
        title: `Marked ${contact.first_name} ${contact.last_name} as read`,
        detail: contact.email,
      });
    }
  };

  const handleSendContactReply = async () => {
    if (!selectedContact || !replyText.trim()) return;
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_CONTACT_TEMPLATE_ID) {
      setReplyError('EmailJS is not fully configured. Check your .env.local settings.');
      return;
    }
    setSendingReply(true);
    setReplyError('');
    try {
      if (EMAILJS_PUBLIC_KEY) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
      }
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TEMPLATE_ID, {
        to_email: selectedContact.email,
        email: selectedContact.email,
        first_name: selectedContact.first_name,
        last_name: selectedContact.last_name,
        reply_body: replyText.trim(),
      });
      pushActivity({
        type: 'reply',
        title: `Reply sent to ${selectedContact.first_name} ${selectedContact.last_name}`,
        detail: selectedContact.email,
      });
      openToast('Reply sent', `Your message to ${selectedContact.first_name} ${selectedContact.last_name} was delivered.`);
      setReplyText('');
      setReplySuccessOpen(true);
    } catch (err) {
      setReplyError(
        err instanceof Error
          ? err.message
          : 'Unable to send reply. Please try again or check EmailJS logs.'
      );
    } finally {
      setSendingReply(false);
    }
  };

  const handleDraftReplyWithIva = async () => {
    if (!selectedContact) return;
    setDraftingReplyWithIva(true);
    setReplyError('');
    try {
      const prompt = `You are Lifewood's virtual assistant drafting an email reply on behalf of a human admin.\n\nSender name: ${selectedContact.first_name} ${selectedContact.last_name}\nSender email: ${selectedContact.email}\nOriginal message:\n${selectedContact.message}\n\nWrite a short, warm, professional reply email of 3–5 sentences. Do not use placeholders. Speak as "we" from Lifewood.`;
      const draft = await getIvaResponse(prompt, []);
      setReplyText(draft.trim());
    } catch (err) {
      setReplyError(
        err instanceof Error
          ? err.message
          : 'Unable to draft reply with Iva. Please try again.'
      );
    } finally {
      setDraftingReplyWithIva(false);
    }
  };

  const handleExportCareersCsv = () => {
    if (!filteredCareers.length) return;
    const header = [
      'First Name',
      'Last Name',
      'Email',
      'Position',
      'Country',
      'Status',
      'Created At',
    ];
    const rows = filteredCareers.map((a) => [
      a.first_name,
      a.last_name,
      a.email,
      a.position_applied,
      a.country,
      a.status,
      formatDate(a.created_at),
    ]);
    const csv = [header, ...rows]
      .map((cols) =>
        cols
          .map((value) => {
            const safe = (value ?? '').toString().replace(/"/g, '""');
            return `"${safe}"`;
          })
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'career_applications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadResume = async (app: CareerApplication) => {
    setResumeLoading(app.id);
    try {
      const { data, error } = await supabase.storage
        .from(CAREER_BUCKET)
        .createSignedUrl(app.resume_path, 60);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch {
      // Fallback: try getPublicUrl if bucket is public (won't work if private)
      const { data } = supabase.storage.from(CAREER_BUCKET).getPublicUrl(app.resume_path);
      window.open(data.publicUrl, '_blank');
    }
    setResumeLoading(null);
  };

  const handlePreviewResume = async (app: CareerApplication) => {
    setResumeLoading(app.id);
    try {
      const { data, error } = await supabase.storage
        .from(CAREER_BUCKET)
        .createSignedUrl(app.resume_path, 60);
      if (error) throw error;
      if (data?.signedUrl) {
        setResumePreviewUrl(data.signedUrl);
        setResumePreviewName(app.resume_file_name);
      }
    } catch {
      const { data } = supabase.storage.from(CAREER_BUCKET).getPublicUrl(app.resume_path);
      setResumePreviewUrl(data.publicUrl);
      setResumePreviewName(app.resume_file_name);
    }
    setResumeLoading(null);
  };

  const saveCareerNote = (career: CareerApplication, note: string) => {
    setCareerNotes((prev) => ({ ...prev, [career.id]: note }));
    pushActivity({
      type: 'note',
      title: `Note updated for ${career.first_name} ${career.last_name}`,
      detail: note.trim() ? note.trim().slice(0, 120) : 'Note cleared',
    });
    openToast('Note saved', `Private note updated for ${career.first_name} ${career.last_name}.`);
  };

  const buildApplicantMailto = (app: CareerApplication) => {
    const status = app.status.toLowerCase();

    const contentByStatus: Record<string, { subject: string; body: string[] }> = {
      submitted: {
        subject: `Lifewood Application Received - ${app.position_applied}`,
        body: [
          `Hi ${app.first_name},`,
          '',
          `Thank you for applying for the ${app.position_applied} role at Lifewood.`,
          'We have received your application and our team has started reviewing your submission.',
          'We will contact you again once we complete the initial screening.',
          '',
          'Best regards,',
          'Lifewood Recruitment Team',
        ],
      },
      reviewed: {
        subject: `Lifewood Application Update - ${app.position_applied}`,
        body: [
          `Hi ${app.first_name},`,
          '',
          `Thank you for your patience while we reviewed your application for the ${app.position_applied} role.`,
          'Your profile is currently under active consideration and we are finalizing the next steps for this stage.',
          'We will send you another update as soon as the review process is completed.',
          '',
          'Best regards,',
          'Lifewood Recruitment Team',
        ],
      },
      contacted: {
        subject: `Next Stage with Lifewood - ${app.position_applied}`,
        body: [
          `Hi ${app.first_name},`,
          '',
          `Thank you for applying for the ${app.position_applied} role at Lifewood.`,
          'We reviewed your application and would like to move you forward to the next stage of the process.',
          'Please reply to this email so we can share the next steps with you.',
          '',
          'Best regards,',
          'Lifewood Recruitment Team',
        ],
      },
      rejected: {
        subject: `Lifewood Application Update - ${app.position_applied}`,
        body: [
          `Hi ${app.first_name},`,
          '',
          `Thank you for taking the time to apply for the ${app.position_applied} role at Lifewood.`,
          'After careful review, we have decided not to move forward with your application for this position.',
          'We appreciate your interest in Lifewood and encourage you to apply again for future opportunities that match your experience.',
          '',
          'Best regards,',
          'Lifewood Recruitment Team',
        ],
      },
    };

    const fallback = contentByStatus.contacted;
    const draft = contentByStatus[status] || fallback;
    const body = draft.body.join('\n');

    return {
      subject: draft.subject,
      body,
      url: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(app.email)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(body)}`,
    };
  };

  const logApplicantContact = (app: CareerApplication) => {
    const draft = buildApplicantMailto(app);
    setContactHistory((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        applicantId: app.id,
        applicantName: `${app.first_name} ${app.last_name}`,
        status: app.status,
        subject: draft.subject,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ].slice(0, 20));
    pushActivity({
      type: 'contact',
      title: `Contact draft opened for ${app.first_name} ${app.last_name}`,
      detail: draft.subject,
    });
    openToast('Gmail draft opened', `Prepared a ${app.status} email for ${app.first_name} ${app.last_name}.`);
  };

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' });
  };

  const getMessagePreview = (message: string) => {
    const normalized = message.replace(/\s+/g, ' ').trim();
    if (normalized.length <= 120) return normalized;
    return `${normalized.slice(0, 117)}...`;
  };

  const getCandidateReadiness = (app: CareerApplication) => {
    const communication = app.email && app.phone_number ? 'Strong' : 'Needs follow-up';
    const completeness = app.current_address && app.resume_file_name ? 'Complete' : 'Partial';
    const marketFit =
      app.status === 'contacted'
        ? 'High'
        : app.status === 'reviewed'
        ? 'Promising'
        : app.status === 'submitted'
        ? 'Pending'
        : 'Closed';

    return { communication, completeness, marketFit };
  };

  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-transparent px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_12%,rgba(200,255,52,0.16),transparent_34%),radial-gradient(circle_at_80%_100%,rgba(255,179,71,0.16),transparent_36%),linear-gradient(to_bottom,rgba(4,14,10,0.30),rgba(4,14,10,0.58))]" />

      <div className="relative z-10 mx-auto grid max-w-[96rem] grid-cols-1 gap-5 lg:grid-cols-12">
        <aside className="rounded-3xl border border-white/12 bg-[#0d1512]/92 p-7 backdrop-blur-sm lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/70">Admin</p>
            <p className="mt-2 text-lg font-bold truncate">{userEmail}</p>
            <p className="mt-1 inline-flex items-center gap-2 text-xs text-lifewood-saffron">
              <ShieldCheck className="h-4 w-4 flex-shrink-0" /> Full access
            </p>
          </div>

          <nav className="mt-7 space-y-2 text-base">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'overview' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('careers')}
              className={`w-full rounded-xl px-4 py-3 text-left transition flex items-center justify-between ${activeSection === 'careers' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}
            >
              Career Applications
              {newCareersCount > 0 && (
                <span className="rounded-full bg-lifewood-saffron px-2 py-0.5 text-xs font-bold text-lifewood-darkSerpent">
                  {newCareersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSection('contact')}
              className={`w-full rounded-xl px-4 py-3 text-left transition flex items-center justify-between ${activeSection === 'contact' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}
            >
              Contact Messages
              {unreadContactCount > 0 && (
                <span className="rounded-full bg-lifewood-saffron px-2 py-0.5 text-xs font-bold text-lifewood-darkSerpent">
                  {unreadContactCount}
                </span>
              )}
            </button>
          </nav>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">
              <LogOut className="h-4 w-4" /> Logout
            </button>
            <button onClick={onGoHome} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">
              <Home className="h-4 w-4" /> Home
            </button>
          </div>
        </aside>

        <div className="space-y-5 lg:col-span-8 xl:col-span-9">
          <article className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-r from-[#131c17]/95 to-[#101612]/95 p-5 md:p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-lifewood-saffron">Lifewood Admin</p>
            <h1 className="mt-2 text-3xl font-black md:text-[3.6rem] md:leading-[0.94]">
              {activeSection === 'overview' && 'Dashboard'}
              {activeSection === 'careers' && 'Career Applications'}
              {activeSection === 'contact' && 'Contact Messages'}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-white/72 md:text-lg">
              {activeSection === 'overview' && 'Summary of applications and contact form submissions.'}
              {activeSection === 'careers' && 'View, filter, and manage job applications from the Careers page.'}
              {activeSection === 'contact' && 'Messages sent via the Contact Us form.'}
            </p>
          </article>

          {activeSection === 'overview' && (
            <>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr]">
                <article className="relative overflow-hidden rounded-3xl border border-lifewood-saffron/20 bg-[linear-gradient(135deg,rgba(200,255,52,0.10),rgba(16,22,18,0.96))] p-6 shadow-[0_22px_42px_rgba(0,0,0,0.28)]">
                  <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-full bg-lifewood-saffron/10 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-white/55">Career Applications</p>
                      <p className="mt-3 text-5xl font-black text-lifewood-saffron">{careerApps.length}</p>
                      <p className="mt-2 text-sm text-white/62">{newCareersCount} new candidates waiting for review</p>
                    </div>
                    <div className="rounded-2xl border border-lifewood-saffron/25 bg-lifewood-saffron/10 p-3 text-lifewood-saffron">
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>
                </article>
                <article className="relative overflow-hidden rounded-3xl border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(16,22,18,0.96))] p-6 shadow-[0_22px_42px_rgba(0,0,0,0.22)]">
                  <div className="pointer-events-none absolute bottom-0 right-0 h-24 w-24 rounded-full bg-white/6 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-white/55">Contact Messages</p>
                      <p className="mt-3 text-5xl font-black text-white">{contactMessages.length}</p>
                      <p className="mt-2 text-sm text-white/62">{unreadContactCount} unread messages in the queue</p>
                    </div>
                    <div className="rounded-2xl border border-white/12 bg-white/5 p-3 text-white/85">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                  </div>
                </article>
                <article className="rounded-3xl border border-white/12 bg-[#101612]/94 p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/45">At a Glance</p>
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-3xl font-black text-white">{statusBreakdown.find(({ status }) => status === 'reviewed')?.count ?? 0}</p>
                      <p className="mt-1 text-sm text-white/62">applications already reviewed</p>
                    </div>
                    <div className="h-px bg-white/8" />
                    <div>
                      <p className="text-3xl font-black text-emerald-200">{statusBreakdown.find(({ status }) => status === 'contacted')?.count ?? 0}</p>
                      <p className="mt-1 text-sm text-white/62">candidates moved forward</p>
                    </div>
                  </div>
                </article>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {statusBreakdown.map(({ status, count }) => (
                  <article
                    key={status}
                    className={`rounded-2xl border px-4 py-4 text-xs ${
                      status === 'submitted'
                        ? 'border-lifewood-saffron/18 bg-lifewood-saffron/5'
                        : status === 'reviewed'
                        ? 'border-cyan-300/14 bg-cyan-300/5'
                        : status === 'contacted'
                        ? 'border-emerald-300/14 bg-emerald-300/5'
                        : 'border-red-300/14 bg-red-300/5'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === 'submitted'
                            ? 'bg-lifewood-saffron'
                            : status === 'reviewed'
                            ? 'bg-cyan-300'
                            : status === 'contacted'
                            ? 'bg-emerald-300'
                            : 'bg-red-300'
                        }`}
                      />
                      <p className="uppercase tracking-[0.18em] text-white/45">{status}</p>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold">{count}</p>
                  </article>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <article className="rounded-3xl border border-white/12 bg-[#101612]/94 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="inline-flex items-center gap-2 text-lg font-bold text-lifewood-saffron">
                        <Briefcase className="h-5 w-5" /> Recent Applications
                      </h2>
                      <p className="mt-1 text-sm text-white/52">Latest candidates that need attention from the hiring team.</p>
                    </div>
                  </div>
                  {showCareersLoading ? (
                    <div className="mt-4 flex justify-center py-5">
                      <GhostLoader label="Loading" scale={0.2} />
                    </div>
                  ) : careerApps.length === 0 ? (
                    <p className="mt-4 text-white/60">No applications yet.</p>
                  ) : (
                    <ul className="mt-5 space-y-2.5">
                      {careerApps.slice(0, 5).map((app) => (
                        <li
                          key={app.id}
                          className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 cursor-pointer hover:bg-white/5 transition"
                          onClick={() => setSelectedCareer(app)}
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-white">{app.first_name} {app.last_name}</p>
                            <p className="mt-0.5 truncate text-xs text-white/45">{app.email}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-white/6 px-2.5 py-1 text-[0.68rem] font-semibold text-white/70">
                            {app.position_applied}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button onClick={() => setActiveSection('careers')} className="mt-5 text-sm font-semibold text-lifewood-saffron hover:underline">
                    View all applications →
                  </button>
                </article>
                <article className="rounded-3xl border border-white/12 bg-[#101612]/94 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="inline-flex items-center gap-2 text-lg font-bold text-lifewood-saffron">
                        <MessageSquare className="h-5 w-5" /> Recent Messages
                      </h2>
                      <p className="mt-1 text-sm text-white/52">A quick scan of the latest contact requests coming through the site.</p>
                    </div>
                  </div>
                  {showContactLoading ? (
                    <div className="mt-4 flex justify-center py-5">
                      <GhostLoader label="Loading" scale={0.2} />
                    </div>
                  ) : contactMessages.length === 0 ? (
                    <p className="mt-4 text-white/60">No messages yet.</p>
                  ) : (
                    <ul className="mt-5 space-y-2.5">
                      {contactMessages.slice(0, 5).map((m) => (
                        <li
                          key={m.id}
                          className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-3 cursor-pointer transition ${m.read ? 'border-white/10 bg-black/20 hover:bg-white/5' : 'border-lifewood-saffron/30 bg-lifewood-saffron/5 hover:bg-lifewood-saffron/10'}`}
                          onClick={() => setSelectedContact(m)}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {!m.read && <span className="h-2 w-2 rounded-full bg-lifewood-saffron" />}
                              <p className="truncate font-medium text-white">{m.first_name} {m.last_name}</p>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-white/45">{m.email}</p>
                          </div>
                          <span className="max-w-[12rem] truncate text-xs text-white/58">{getMessagePreview(m.message)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button onClick={() => setActiveSection('contact')} className="mt-5 text-sm font-semibold text-lifewood-saffron hover:underline">
                    View all messages →
                  </button>
                </article>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                <article className="rounded-3xl border border-white/12 bg-[#101612]/94 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="inline-flex items-center gap-2 text-lg font-bold text-white">
                        <ClipboardList className="h-5 w-5 text-lifewood-saffron" />
                        Activity Timeline
                      </h2>
                      <p className="mt-1 text-sm text-white/52">A running log of admin decisions, replies, and follow-ups.</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                      {activities.length} recent events
                    </span>
                  </div>
                  {activities.length === 0 ? (
                    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 px-5 py-10 text-center text-sm text-white/50">
                      Timeline events will appear here once the admin starts reviewing candidates and replying to messages.
                    </div>
                  ) : (
                    <ol className="mt-5 space-y-3">
                      {activities.slice(0, 6).map((item) => (
                        <li key={item.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                          <div className="flex items-start gap-3">
                            <span
                              className={`mt-1 inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                                item.type === 'status'
                                  ? 'bg-lifewood-saffron/15 text-lifewood-saffron'
                                  : item.type === 'reply'
                                  ? 'bg-cyan-300/12 text-cyan-200'
                                  : item.type === 'note'
                                  ? 'bg-white/8 text-white/80'
                                  : 'bg-emerald-300/12 text-emerald-200'
                              }`}
                            >
                              {item.type === 'status' ? <CheckCircle2 className="h-4 w-4" /> : item.type === 'reply' ? <Mail className="h-4 w-4" /> : item.type === 'note' ? <FileText className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                            </span>
                            <div className="min-w-0">
                              <p className="font-medium text-white">{item.title}</p>
                              <p className="mt-1 text-sm text-white/58">{item.detail}</p>
                              <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/35">{formatDate(item.createdAt)}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </article>

                <article className="rounded-3xl border border-white/12 bg-[#101612]/94 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="inline-flex items-center gap-2 text-lg font-bold text-white">
                        <BarChart3 className="h-5 w-5 text-lifewood-saffron" />
                        Review Pipeline
                      </h2>
                      <p className="mt-1 text-sm text-white/52">A quick visual read on where candidates are currently sitting.</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-4">
                    {statusBreakdown.map(({ status, count }) => {
                      const percentage = careerApps.length ? Math.round((count / careerApps.length) * 100) : 0;
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_META[status].dot}`} />
                              <span className="font-medium text-white">{STATUS_META[status].label}</span>
                            </div>
                            <span className="text-white/55">{count} · {percentage}%</span>
                          </div>
                          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white/6">
                            <div
                              className={`h-full rounded-full ${STATUS_META[status].dot}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              </div>
            </>
          )}

          {activeSection === 'careers' && (
            <article className="rounded-3xl border border-white/12 bg-[#101612]/94 p-6">
              <div className="sticky top-4 z-10 mb-5 rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(0,0,0,0.16))] p-4 md:p-5 backdrop-blur-sm">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(430px,0.9fr)]">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-white/42">Candidate Search</p>
                      <p className="mt-1 text-sm text-white/55">Filter applicants by identity, role, or country before reviewing.</p>
                    </div>
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                      <input
                        type="text"
                        placeholder="Search by name, email, position..."
                        value={careerSearchInput}
                        onChange={(e) => setCareerSearchInput(e.target.value)}
                        className="w-full rounded-2xl border border-white/12 bg-black/25 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/38 focus:border-lifewood-saffron/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">Filters & Export</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">Status</span>
                        <select
                          value={careerFilter}
                          onChange={(e) => setCareerFilter(e.target.value)}
                          className="w-full rounded-2xl border border-white/12 bg-black/25 px-3 py-3 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                        >
                          <option value="all">All</option>
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      {uniquePositions.length > 0 && (
                        <label className="flex flex-col gap-1.5">
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">Position</span>
                          <select
                            value={careerPositionFilter}
                            onChange={(e) => setCareerPositionFilter(e.target.value)}
                            className="w-full rounded-2xl border border-white/12 bg-black/25 px-3 py-3 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                          >
                            <option value="all">All</option>
                            {uniquePositions.map((p) => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </label>
                      )}
                      <div className={`flex items-end gap-2 ${uniqueCountries.length > 0 ? 'sm:col-span-2' : ''}`}>
                        {uniqueCountries.length > 0 && (
                          <label className="min-w-0 flex-1 flex flex-col gap-1.5">
                            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-white/48">Country</span>
                            <select
                              value={careerCountryFilter}
                              onChange={(e) => setCareerCountryFilter(e.target.value)}
                              className="w-full rounded-2xl border border-white/12 bg-black/25 px-3 py-3 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                            >
                              <option value="all">All</option>
                              {uniqueCountries.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setCareerFilter('all');
                            setCareerPositionFilter('all');
                            setCareerCountryFilter('all');
                            setCareerSearchInput('');
                          }}
                          className="rounded-2xl border border-white/12 bg-black/10 px-3.5 py-3 text-xs font-semibold text-white/62 hover:bg-white/8"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={handleExportCareersCsv}
                          className="inline-flex items-center gap-1.5 rounded-2xl border border-white/16 bg-white/6 px-4 py-3 text-xs font-semibold text-white hover:bg-white/12"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Export CSV
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/45">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    {filteredCareers.length} application{filteredCareers.length === 1 ? '' : 's'} shown
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    Sorted by newest
                  </span>
                  <div className="ml-auto inline-flex rounded-full border border-white/10 bg-white/5 p-1">
                    <button
                      type="button"
                      onClick={() => setCareerViewMode('cards')}
                      className={`rounded-full px-3 py-1.5 font-medium ${careerViewMode === 'cards' ? 'bg-lifewood-saffron text-lifewood-darkSerpent' : 'text-white/65'}`}
                    >
                      Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setCareerViewMode('table')}
                      className={`rounded-full px-3 py-1.5 font-medium ${careerViewMode === 'table' ? 'bg-lifewood-saffron text-lifewood-darkSerpent' : 'text-white/65'}`}
                    >
                      Table
                    </button>
                  </div>
                </div>
                {selectedCount > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-lifewood-saffron/22 bg-lifewood-saffron/6 px-4 py-3 text-sm">
                    <span className="font-semibold text-lifewood-saffron">{selectedCount} selected</span>
                    <button
                      type="button"
                      onClick={() => handleBulkUpdateStatus('reviewed')}
                      className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-300/18"
                    >
                      Mark reviewed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkUpdateStatus('contacted')}
                      className="rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-300/18"
                    >
                      Move to next stage
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBulkUpdateStatus('rejected')}
                      className="rounded-xl border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-300/18"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCareerIds([])}
                      className="ml-auto rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10"
                    >
                      Clear selection
                    </button>
                  </div>
                )}
              </div>
              {showCareersLoading ? (
                <div className="flex justify-center py-8">
                  <GhostLoader label="Loading applications" scale={0.24} />
                </div>
              ) : filteredCareers.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 px-6 py-12 text-center">
                  <Briefcase className="mx-auto h-10 w-10 text-white/20" />
                  <h3 className="mt-4 text-lg font-semibold text-white">No matching applications</h3>
                  <p className="mt-2 text-sm text-white/52">
                    Try clearing the current search and filters to bring applicants back into view.
                  </p>
                </div>
              ) : careerViewMode === 'cards' ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCareers.map((app) => (
                    <article
                      key={app.id}
                      className="group flex flex-col justify-between rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.22))] p-4 shadow-[0_18px_35px_rgba(0,0,0,0.45)] backdrop-blur-sm cursor-pointer transition hover:-translate-y-0.5 hover:border-lifewood-saffron/60 hover:bg-black/40"
                      onClick={() => setSelectedCareer(app)}
                    >
                      <header className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <label
                            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/45"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={selectedCareerIds.includes(app.id)}
                              onChange={() => toggleCareerSelection(app.id)}
                              className="h-4 w-4 rounded border-white/20 bg-black/20 text-lifewood-saffron focus:ring-lifewood-saffron/30"
                            />
                            Select
                          </label>
                          <h3 className="truncate text-base font-semibold text-white">
                            {app.first_name} {app.last_name}
                          </h3>
                          <p className="mt-1 truncate text-sm font-medium text-lifewood-saffron/90">
                            {app.position_applied}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-wide ${STATUS_META[app.status]?.badge || 'bg-white/10 text-white/80'}`}
                        >
                          {app.status}
                        </span>
                      </header>

                      <dl className="mt-4 space-y-2 text-[0.76rem] text-white/70">
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-3 py-2">
                          <dt className="text-white/38">Country</dt>
                          <dd className="truncate text-right font-medium text-white/82">{app.country}</dd>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-3 py-2">
                          <dt className="text-white/38">Submitted</dt>
                          <dd className="truncate text-right font-medium text-white/72">{formatDate(app.created_at)}</dd>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] px-3 py-2">
                          <dt className="text-white/38">Email</dt>
                          <dd className="mt-1 truncate font-medium text-white/82">
                            {app.email}
                          </dd>
                        </div>
                      </dl>

                      <footer className="mt-4 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadResume(app);
                          }}
                          disabled={resumeLoading === app.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/16 bg-white/5 px-3.5 py-2 text-[0.74rem] font-semibold text-white hover:bg-white/12 disabled:opacity-50"
                        >
                          {resumeLoading === app.id ? (
                            'Downloading…'
                          ) : (
                            <>
                              <Download className="h-3.5 w-3.5" />
                              Resume
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCareer(app);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.74rem] font-semibold text-white/75 hover:text-white"
                        >
                          Details
                          <ChevronDown className="h-3 w-3 rotate-[-90deg] transition group-hover:translate-x-0.5" />
                        </button>
                      </footer>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10 text-left">
                      <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.16em] text-white/42">
                        <tr>
                          <th className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={filteredCareers.length > 0 && selectedCount === filteredCareers.length}
                              onChange={toggleAllVisibleCareers}
                              className="h-4 w-4 rounded border-white/20 bg-black/20 text-lifewood-saffron focus:ring-lifewood-saffron/30"
                            />
                          </th>
                          <th className="px-4 py-3">Candidate</th>
                          <th className="px-4 py-3">Position</th>
                          <th className="px-4 py-3">Country</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Submitted</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/8 text-sm">
                        {filteredCareers.map((app) => (
                          <tr key={app.id} className="hover:bg-white/[0.03]">
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedCareerIds.includes(app.id)}
                                onChange={() => toggleCareerSelection(app.id)}
                                className="h-4 w-4 rounded border-white/20 bg-black/20 text-lifewood-saffron focus:ring-lifewood-saffron/30"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-semibold text-white">{app.first_name} {app.last_name}</p>
                              <p className="mt-0.5 text-xs text-white/45">{app.email}</p>
                            </td>
                            <td className="px-4 py-3 text-white/78">{app.position_applied}</td>
                            <td className="px-4 py-3 text-white/62">{app.country}</td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-wide ${STATUS_META[app.status]?.badge || 'bg-white/10 text-white/80'}`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-white/55">{formatDate(app.created_at)}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePreviewResume(app)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-white/75 hover:bg-white/10"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  Preview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedCareer(app)}
                                  className="inline-flex items-center gap-1 rounded-xl border border-lifewood-saffron/20 bg-lifewood-saffron/8 px-3 py-2 text-xs font-semibold text-lifewood-saffron hover:bg-lifewood-saffron/14"
                                >
                                  Review
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </article>
          )}

          {activeSection === 'contact' && (
            <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
              {showContactLoading ? (
                <div className="flex justify-center py-8">
                  <GhostLoader label="Loading messages" scale={0.24} />
                </div>
              ) : contactMessages.length === 0 ? (
                <p className="py-8 text-center text-white/60">No contact messages yet.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.95fr)]">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/45">Inbox</p>
                        <h2 className="mt-1 text-xl font-bold text-white">Contact queue</h2>
                        <p className="mt-1 text-sm text-white/55">
                          {filteredContacts.length} message{filteredContacts.length === 1 ? '' : 's'} shown, {unreadContactCount} unread
                        </p>
                      </div>
                      <label className="relative block w-full sm:max-w-sm">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                        <input
                          type="text"
                          value={contactSearchInput}
                          onChange={(event) => setContactSearchInput(event.target.value)}
                          placeholder="Search sender, email, or message..."
                          className="w-full rounded-xl border border-white/12 bg-black/25 py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-white/35 focus:border-lifewood-saffron/50 focus:outline-none"
                        />
                      </label>
                    </div>

                    {filteredContacts.length === 0 ? (
                      <p className="py-10 text-center text-sm text-white/55">No messages match your search.</p>
                    ) : (
                      <div className="mt-4 space-y-2">
                        {filteredContacts.map((m) => {
                          const isSelected = selectedContact?.id === m.id;

                          return (
                            <button
                              key={m.id}
                              type="button"
                              className={`group w-full rounded-2xl border p-4 text-left transition ${
                                isSelected
                                  ? 'border-lifewood-saffron/55 bg-lifewood-saffron/8 shadow-[0_16px_34px_rgba(0,0,0,0.32)]'
                                  : m.read
                                  ? 'border-white/10 bg-black/15 hover:bg-white/6'
                                  : 'border-lifewood-saffron/22 bg-lifewood-saffron/5 hover:bg-lifewood-saffron/10'
                              }`}
                              onClick={() => {
                                setSelectedContact(m);
                                setReplyError('');
                                if (!m.read) {
                                  void handleMarkContactRead(m.id);
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`mt-1 inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                    m.read ? 'bg-white/8 text-white/70' : 'bg-lifewood-saffron/18 text-lifewood-saffron'
                                  }`}
                                >
                                  {`${m.first_name[0] || ''}${m.last_name[0] || ''}`.toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-semibold text-white">
                                          {m.first_name} {m.last_name}
                                        </p>
                                        {!m.read && (
                                          <span className="rounded-full bg-lifewood-saffron/14 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-lifewood-saffron">
                                            New
                                          </span>
                                        )}
                                      </div>
                                      <p className="truncate text-xs text-white/50">{m.email}</p>
                                    </div>
                                    <p className="flex-shrink-0 text-[0.68rem] uppercase tracking-[0.12em] text-white/35">
                                      {formatDate(m.created_at)}
                                    </p>
                                  </div>
                                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/62">
                                    {getMessagePreview(m.message)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    {selectedContact ? (
                      <div className="flex h-full flex-col">
                        <div className="border-b border-white/10 pb-4">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-[0.18em] text-lifewood-saffron/80">Message Detail</p>
                              <h3 className="mt-2 text-2xl font-bold text-white">
                                {selectedContact.first_name} {selectedContact.last_name}
                              </h3>
                              <p className="mt-1 text-sm text-white/55">{selectedContact.email}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[0.68rem] uppercase tracking-[0.14em] text-white/35">Received</p>
                              <p className="mt-1 text-sm text-white/65">{formatDate(selectedContact.created_at)}</p>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {!selectedContact.read && (
                              <button
                                onClick={() => handleMarkContactRead(selectedContact.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                              >
                                Mark as read
                              </button>
                            )}
                            <a
                              href={`mailto:${selectedContact.email}?subject=${encodeURIComponent('Lifewood Contact Response')}`}
                              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              Open in Mail
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                window.localStorage.setItem(
                                  'ivaAdminContext',
                                  JSON.stringify({ type: 'contact', data: selectedContact })
                                );
                                window.dispatchEvent(new Event('open-iva'));
                              }}
                              className="inline-flex items-center gap-2 rounded-xl border border-lifewood-saffron/35 bg-lifewood-saffron/10 px-3 py-2 text-xs font-semibold text-lifewood-saffron hover:bg-lifewood-saffron/18"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              Ask Iva for reply ideas
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex-1 space-y-4">
                          <div className="rounded-2xl border border-white/10 bg-[#0b110e] p-4">
                            <p className="text-xs uppercase tracking-[0.18em] text-white/38">Original Message</p>
                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/82">
                              {selectedContact.message}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-[#0b110e] p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-white/38">Reply Workspace</p>
                                <p className="mt-1 text-sm text-white/55">Draft a reply here or let Iva prepare a starting point.</p>
                              </div>
                              <button
                                type="button"
                                onClick={handleDraftReplyWithIva}
                                disabled={draftingReplyWithIva}
                                className="inline-flex items-center gap-2 rounded-xl border border-lifewood-saffron/40 bg-lifewood-saffron/10 px-3 py-2 text-xs font-semibold text-lifewood-saffron hover:bg-lifewood-saffron/18 disabled:opacity-60"
                              >
                                {draftingReplyWithIva ? 'Drafting with Iva…' : 'Generate draft with Iva'}
                              </button>
                            </div>
                            <textarea
                              rows={8}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="mt-4 w-full rounded-2xl border border-white/12 bg-black/25 p-4 text-sm text-white placeholder:text-white/35 focus:border-lifewood-saffron/60 focus:outline-none"
                              placeholder="Write a clear, warm reply to the sender..."
                            />
                            {replyError && <p className="mt-3 text-xs text-red-300">{replyError}</p>}
                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={handleSendContactReply}
                                disabled={sendingReply || !replyText.trim()}
                                className="inline-flex items-center gap-2 rounded-xl bg-lifewood-saffron px-4 py-2.5 text-sm font-semibold text-lifewood-darkSerpent hover:bg-lifewood-earth disabled:opacity-60"
                              >
                                {sendingReply ? (
                                  <>
                                    <GhostLoader inline scale={0.16} />
                                    <span>Sending...</span>
                                  </>
                                ) : (
                                  'Send reply'
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyText('');
                                  setReplyError('');
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10"
                              >
                                Clear draft
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[24rem] flex-col items-center justify-center rounded-2xl border border-dashed border-white/12 bg-[#0b110e] px-6 text-center">
                        <MessageSquare className="h-10 w-10 text-white/25" />
                        <h3 className="mt-4 text-lg font-semibold text-white">Select a message</h3>
                        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/50">
                          Pick a contact message from the inbox to review the full inquiry and draft your response.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </article>
          )}
        </div>
      </div>

      {/* Career detail modal */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedCareer(null)}>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/12 bg-[#0e1512] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedCareer(null)} className="absolute right-4 top-4 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-xl font-bold text-lifewood-saffron">Application</h3>
            <p className="mt-1 text-white/70">{selectedCareer.first_name} {selectedCareer.last_name} · {selectedCareer.position_applied}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide ${STATUS_META[selectedCareer.status]?.badge || 'bg-white/10 text-white/80'}`}>
                {STATUS_META[selectedCareer.status]?.label || selectedCareer.status}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.12em] text-white/55">
                Candidate profile
              </span>
            </div>
            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-white/50">Email</dt><dd className="font-medium">{selectedCareer.email}</dd></div>
              <div><dt className="text-white/50">Phone</dt><dd>{selectedCareer.phone_code} {selectedCareer.phone_number}</dd></div>
              <div><dt className="text-white/50">Country</dt><dd>{selectedCareer.country}</dd></div>
              <div><dt className="text-white/50">Gender / Age</dt><dd>{selectedCareer.gender}, {selectedCareer.age}</dd></div>
              <div className="sm:col-span-2"><dt className="text-white/50">Address</dt><dd>{selectedCareer.current_address}</dd></div>
              <div className="sm:col-span-2"><dt className="text-white/50">Resume</dt><dd>{selectedCareer.resume_file_name}</dd></div>
            </dl>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {Object.entries(getCandidateReadiness(selectedCareer)).map(([key, value]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.14em] text-white/42">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDownloadResume(selectedCareer)}
                disabled={resumeLoading === selectedCareer.id}
                className="inline-flex items-center gap-2 rounded-xl bg-lifewood-saffron px-4 py-2.5 text-sm font-semibold text-lifewood-darkSerpent hover:bg-lifewood-earth disabled:opacity-50"
              >
                {resumeLoading === selectedCareer.id ? 'Downloading...' : <><Download className="h-4 w-4" /> Download resume</>}
              </button>
              <button
                type="button"
                onClick={() => handlePreviewResume(selectedCareer)}
                disabled={resumeLoading === selectedCareer.id}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/84 hover:bg-white/10 disabled:opacity-60"
              >
                <Eye className="h-4 w-4" />
                Preview resume
              </button>
              <div className="flex items-center gap-2">
                <label className="text-white/60 text-sm">Status:</label>
                <select
                  value={selectedCareer.status}
                  onChange={(e) => handleUpdateStatus(selectedCareer.id, e.target.value)}
                  disabled={updatingStatus}
                  className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCareer.id, 'contacted')}
                disabled={updatingStatus}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-emerald-300/18 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCareer.id, 'rejected')}
                disabled={updatingStatus}
                className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-2.5 text-sm font-semibold text-red-200 hover:bg-red-300/18 disabled:opacity-60"
              >
                <AlertCircle className="h-4 w-4" />
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedCareer.id, 'reviewed')}
                disabled={updatingStatus}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:bg-cyan-300/18 disabled:opacity-60"
              >
                <ClipboardList className="h-4 w-4" />
                Request more info
              </button>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCareerMailModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-white/18 bg-black/30 px-4 py-2.5 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                Contact Applicant
              </a>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.setItem(
                    'ivaAdminContext',
                    JSON.stringify({ type: 'career', data: selectedCareer })
                  );
                  window.dispatchEvent(new Event('open-iva'));
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-xl border border-white/18 bg-black/30 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
              >
                Ask Iva about this candidate
              </button>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/42">Private Notes</p>
                    <p className="mt-1 text-sm text-white/55">Capture interview impressions, follow-ups, or internal reminders.</p>
                  </div>
                </div>
                <textarea
                  rows={6}
                  value={selectedCareerNote}
                  onChange={(e) =>
                    setCareerNotes((prev) => ({
                      ...prev,
                      [selectedCareer.id]: e.target.value,
                    }))
                  }
                  onBlur={(e) => saveCareerNote(selectedCareer, e.target.value)}
                  className="mt-4 w-full rounded-2xl border border-white/12 bg-black/25 p-4 text-sm text-white placeholder:text-white/35 focus:border-lifewood-saffron/60 focus:outline-none"
                  placeholder="Add notes for the hiring team..."
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => saveCareerNote(selectedCareer, selectedCareerNote)}
                    className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/75 hover:bg-white/10"
                  >
                    Save note
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-white/42">Contact History</p>
                <p className="mt-1 text-sm text-white/55">Track when Gmail drafts were opened for this applicant.</p>
                {selectedCareerHistory.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/15 px-4 py-6 text-sm text-white/50">
                    No contact activity yet for this applicant.
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {selectedCareerHistory.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-white/10 bg-[#0b110e] px-4 py-3">
                        <p className="text-sm font-medium text-white">{item.subject}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/40">{item.status}</p>
                        <p className="mt-2 text-xs text-white/48">{formatDate(item.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact reply success modal */}
      {replySuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setReplySuccessOpen(false)}>
          <div className="relative w-full max-w-sm rounded-2xl border border-white/12 bg-[#0e1512] p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setReplySuccessOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs uppercase tracking-[0.22em] text-lifewood-saffron/90">Message sent</p>
            <h3 className="mt-2 text-lg font-bold text-white">Reply delivered successfully</h3>
            <p className="mt-3 text-sm text-white/70">
              Your response has been sent to the sender’s email address.
            </p>
            <button
              type="button"
              onClick={() => setReplySuccessOpen(false)}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-lifewood-saffron px-4 py-2.5 text-sm font-semibold text-lifewood-darkSerpent hover:bg-lifewood-earth"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {careerMailModalOpen && selectedCareer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setCareerMailModalOpen(false)}
        >
          <div
            className="relative my-6 flex w-full max-w-2xl max-h-[calc(100vh-3rem)] flex-col overflow-hidden rounded-3xl border border-white/12 bg-[#0e1512] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCareerMailModalOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs uppercase tracking-[0.2em] text-lifewood-saffron">Contact Applicant</p>
            <h3 className="mt-2 text-2xl font-bold text-white">Open Gmail with a status-based draft</h3>
            <p className="mt-2 text-sm text-white/62">
              The draft below is generated from the applicant&apos;s current status in the review panel.
            </p>

            <div className="mt-5 grid flex-1 gap-4 overflow-y-auto pr-1 md:grid-cols-[1fr_1.2fr]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/42">Applicant</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {selectedCareer.first_name} {selectedCareer.last_name}
                </p>
                <p className="mt-1 text-sm text-white/58">{selectedCareer.email}</p>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-white/38">Position</p>
                    <p className="mt-1 font-medium text-white/84">{selectedCareer.position_applied}</p>
                  </div>
                  <div>
                    <p className="text-white/38">Current status</p>
                    <p className="mt-1 font-medium capitalize text-white/84">{selectedCareer.status}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-white/42">Draft Preview</p>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-white/38">Subject</p>
                    <p className="mt-1 text-sm font-medium text-white/86">
                      {buildApplicantMailto(selectedCareer).subject}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/38">Body</p>
                    <div className="mt-2 max-h-[50vh] overflow-y-auto rounded-2xl border border-white/8 bg-[#0b110e] p-4 text-sm leading-7 text-white/74 whitespace-pre-wrap">
                      {buildApplicantMailto(selectedCareer).body}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setCareerMailModalOpen(false)}
                className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white/78 hover:bg-white/10"
              >
                Cancel
              </button>
              <a
                href={buildApplicantMailto(selectedCareer).url}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  logApplicantContact(selectedCareer);
                  setCareerMailModalOpen(false);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-lifewood-saffron px-4 py-2.5 text-sm font-semibold text-lifewood-darkSerpent hover:bg-lifewood-earth"
              >
                <Mail className="h-4 w-4" />
                Open Gmail
              </a>
            </div>
          </div>
        </div>
      )}

      {resumePreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setResumePreviewUrl(null)}>
          <div className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/12 bg-[#0e1512]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-lifewood-saffron">Resume Preview</p>
                <p className="mt-1 text-sm text-white/68">{resumePreviewName}</p>
              </div>
              <button onClick={() => setResumePreviewUrl(null)} className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe src={resumePreviewUrl} title={resumePreviewName} className="h-full w-full bg-white" />
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed bottom-6 right-6 z-[60] max-w-sm rounded-2xl border border-white/12 bg-[#0d1512]/95 px-4 py-3 shadow-2xl backdrop-blur-sm">
          <p className="text-sm font-semibold text-white">{toast.title}</p>
          {toast.detail && <p className="mt-1 text-xs leading-6 text-white/62">{toast.detail}</p>}
        </div>
      )}

    </section>
  );
};

export default AdminDashboard;
