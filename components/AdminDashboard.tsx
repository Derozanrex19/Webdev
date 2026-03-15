import React, { useCallback, useEffect, useState } from 'react';
import {
  Briefcase,
  FileText,
  Home,
  LogOut,
  Mail,
  MessageSquare,
  Search,
  ShieldCheck,
  Download,
  X,
  ChevronDown,
} from 'lucide-react';
import Balatro from './Balatro';
import { supabase } from '../services/supabaseClient';

const CAREER_BUCKET = 'career-documents';
const STATUS_OPTIONS = ['submitted', 'reviewed', 'contacted', 'rejected'] as const;

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

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, onLogout, onGoHome }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [careerApps, setCareerApps] = useState<CareerApplication[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactSubmission[]>([]);
  const [loadingCareers, setLoadingCareers] = useState(true);
  const [loadingContact, setLoadingContact] = useState(true);
  const [careerFilter, setCareerFilter] = useState<string>('all');
  const [careerPositionFilter, setCareerPositionFilter] = useState<string>('all');
  const [careerCountryFilter, setCareerCountryFilter] = useState<string>('all');
  const [careerSearch, setCareerSearch] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<CareerApplication | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const [resumeLoading, setResumeLoading] = useState<string | null>(null);

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

  const newCareersCount = careerApps.filter((a) => a.status === 'submitted').length;
  const unreadContactCount = contactMessages.filter((m) => !m.read).length;

  const statusBreakdown = STATUS_OPTIONS.map((status) => ({
    status,
    count: careerApps.filter((a) => a.status === status).length,
  }));

  const uniquePositions = Array.from(new Set(careerApps.map((a) => a.position_applied))).sort();
  const uniqueCountries = Array.from(new Set(careerApps.map((a) => a.country))).sort();

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    await supabase.from('career_applications').update({ status }).eq('id', id);
    await fetchCareers();
    if (selectedCareer?.id === id) setSelectedCareer((prev) => (prev ? { ...prev, status } : null));
    setUpdatingStatus(false);
  };

  const handleMarkContactRead = async (id: string) => {
    await supabase.from('contact_submissions').update({ read: true }).eq('id', id);
    await fetchContact();
    if (selectedContact?.id === id) setSelectedContact((prev) => (prev ? { ...prev, read: true } : null));
  };

  const handleBulkMarkSubmittedReviewed = async () => {
    const targetIds = careerApps.filter((a) => a.status === 'submitted').map((a) => a.id);
    if (targetIds.length === 0) return;
    setBulkUpdating(true);
    await supabase.from('career_applications').update({ status: 'reviewed' }).in('id', targetIds);
    await fetchCareers();
    setBulkUpdating(false);
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

  const formatDate = (s: string) => {
    const d = new Date(s);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' });
  };

  return (
    <section className="relative z-10 min-h-screen overflow-hidden bg-transparent px-4 py-5 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-45">
        <Balatro
          isRotate={false}
          mouseInteraction={true}
          pixelFilter={860}
          color1="#C8FF34"
          color2="#046241"
          color3="#0b1f17"
          contrast={2.2}
          lighting={0.34}
          spinAmount={0.16}
          spinSpeed={4.3}
          spinRotation={-1.05}
          spinEase={0.9}
        />
      </div>
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
          <article className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-r from-[#131c17]/95 to-[#101612]/95 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-lifewood-saffron">Lifewood Admin</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              {activeSection === 'overview' && 'Dashboard'}
              {activeSection === 'careers' && 'Career Applications'}
              {activeSection === 'contact' && 'Contact Messages'}
            </h1>
            <p className="mt-3 text-base text-white/72 md:text-lg">
              {activeSection === 'overview' && 'Summary of applications and contact form submissions.'}
              {activeSection === 'careers' && 'View, filter, and manage job applications from the Careers page.'}
              {activeSection === 'contact' && 'Messages sent via the Contact Us form.'}
            </p>
          </article>

          {activeSection === 'overview' && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Career Applications</p>
                  <p className="mt-2 text-4xl font-black text-lifewood-saffron">{careerApps.length}</p>
                  <p className="mt-1 text-xs text-white/60">{newCareersCount} new</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Contact Messages</p>
                  <p className="mt-2 text-4xl font-black">{contactMessages.length}</p>
                  <p className="mt-1 text-xs text-white/60">{unreadContactCount} unread</p>
                </article>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {statusBreakdown.map(({ status, count }) => (
                  <article key={status} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs">
                    <p className="uppercase tracking-[0.18em] text-white/45">{status}</p>
                    <p className="mt-1 text-2xl font-extrabold">{count}</p>
                  </article>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <h2 className="inline-flex items-center gap-2 text-lg font-bold text-lifewood-saffron">
                    <Briefcase className="h-5 w-5" /> Recent Applications
                  </h2>
                  {loadingCareers ? (
                    <p className="mt-4 text-white/60">Loading…</p>
                  ) : careerApps.length === 0 ? (
                    <p className="mt-4 text-white/60">No applications yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {careerApps.slice(0, 5).map((app) => (
                        <li
                          key={app.id}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 cursor-pointer hover:bg-white/5 transition"
                          onClick={() => setSelectedCareer(app)}
                        >
                          <span className="font-medium truncate">{app.first_name} {app.last_name}</span>
                          <span className="text-xs text-white/60">{app.position_applied}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button onClick={() => setActiveSection('careers')} className="mt-4 text-sm font-semibold text-lifewood-saffron hover:underline">
                    View all →
                  </button>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <h2 className="inline-flex items-center gap-2 text-lg font-bold text-lifewood-saffron">
                    <MessageSquare className="h-5 w-5" /> Recent Messages
                  </h2>
                  {loadingContact ? (
                    <p className="mt-4 text-white/60">Loading…</p>
                  ) : contactMessages.length === 0 ? (
                    <p className="mt-4 text-white/60">No messages yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {contactMessages.slice(0, 5).map((m) => (
                        <li
                          key={m.id}
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 cursor-pointer transition ${m.read ? 'border-white/10 bg-black/20 hover:bg-white/5' : 'border-lifewood-saffron/30 bg-lifewood-saffron/5 hover:bg-lifewood-saffron/10'}`}
                          onClick={() => setSelectedContact(m)}
                        >
                          <span className="font-medium truncate">{m.first_name} {m.last_name}</span>
                          <span className="text-xs text-white/60 truncate max-w-[140px]">{m.message.slice(0, 30)}…</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button onClick={() => setActiveSection('contact')} className="mt-4 text-sm font-semibold text-lifewood-saffron hover:underline">
                    View all →
                  </button>
                </article>
              </div>
            </>
          )}

          {activeSection === 'careers' && (
            <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search by name, email, position…"
                    value={careerSearch}
                    onChange={(e) => setCareerSearch(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-lifewood-saffron/50 focus:outline-none"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/60">Status:</span>
                    <select
                      value={careerFilter}
                      onChange={(e) => setCareerFilter(e.target.value)}
                      className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                    >
                      <option value="all">All</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {uniquePositions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">Position:</span>
                      <select
                        value={careerPositionFilter}
                        onChange={(e) => setCareerPositionFilter(e.target.value)}
                        className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                      >
                        <option value="all">All</option>
                        {uniquePositions.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {uniqueCountries.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white/60">Country:</span>
                      <select
                        value={careerCountryFilter}
                        onChange={(e) => setCareerCountryFilter(e.target.value)}
                        className="rounded-xl border border-white/15 bg-black/20 px-3 py-2 text-sm text-white focus:border-lifewood-saffron/50 focus:outline-none"
                      >
                        <option value="all">All</option>
                        {uniqueCountries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setCareerFilter('all');
                      setCareerPositionFilter('all');
                      setCareerCountryFilter('all');
                      setCareerSearch('');
                    }}
                    className="rounded-xl border border-white/15 bg-black/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCareersCsv}
                    className="inline-flex items-center gap-1 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={handleBulkMarkSubmittedReviewed}
                    disabled={bulkUpdating || newCareersCount === 0}
                    className="inline-flex items-center gap-1 rounded-xl border border-lifewood-saffron/40 bg-lifewood-saffron/10 px-3 py-1.5 text-xs font-semibold text-lifewood-saffron hover:bg-lifewood-saffron/20 disabled:opacity-50"
                  >
                    Mark submitted → reviewed
                  </button>
                </div>
              </div>
              {loadingCareers ? (
                <p className="py-8 text-center text-white/60">Loading applications…</p>
              ) : filteredCareers.length === 0 ? (
                <p className="py-8 text-center text-white/60">No applications match.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredCareers.map((app) => (
                    <article
                      key={app.id}
                      className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-black/25 p-4 shadow-[0_18px_35px_rgba(0,0,0,0.55)] backdrop-blur-sm cursor-pointer transition hover:border-lifewood-saffron/60 hover:bg-black/40"
                      onClick={() => setSelectedCareer(app)}
                    >
                      <header className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold">
                            {app.first_name} {app.last_name}
                          </h3>
                          <p className="mt-0.5 truncate text-xs text-lifewood-saffron/90">
                            {app.position_applied}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide ${
                            app.status === 'submitted'
                              ? 'bg-lifewood-saffron/18 text-lifewood-saffron'
                              : app.status === 'contacted'
                              ? 'bg-lifewood-castleton/26 text-emerald-200'
                              : app.status === 'rejected'
                              ? 'bg-red-500/22 text-red-200'
                              : 'bg-white/10 text-white/80'
                          }`}
                        >
                          {app.status}
                        </span>
                      </header>

                      <dl className="mt-3 space-y-1 text-[0.72rem] text-white/70">
                        <div className="flex justify-between gap-3">
                          <dt className="text-white/40">Country</dt>
                          <dd className="truncate text-right">{app.country}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-white/40">Submitted</dt>
                          <dd className="truncate text-right">{formatDate(app.created_at)}</dd>
                        </div>
                        <div className="flex justify-between gap-3">
                          <dt className="text-white/40">Email</dt>
                          <dd className="truncate text-right max-w-[10rem] md:max-w-[12rem]">
                            {app.email}
                          </dd>
                        </div>
                      </dl>

                      <footer className="mt-3 flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadResume(app);
                          }}
                          disabled={resumeLoading === app.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/18 bg-white/5 px-3 py-1.5 text-[0.72rem] font-semibold text-white hover:bg-white/12 disabled:opacity-50"
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
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[0.7rem] font-semibold text-white/75 hover:text-white"
                        >
                          Details
                          <ChevronDown className="h-3 w-3 rotate-[-90deg] transition group-hover:translate-x-0.5" />
                        </button>
                      </footer>
                    </article>
                  ))}
                </div>
              )}
            </article>
          )}

          {activeSection === 'contact' && (
            <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
              {loadingContact ? (
                <p className="py-8 text-center text-white/60">Loading messages…</p>
              ) : contactMessages.length === 0 ? (
                <p className="py-8 text-center text-white/60">No contact messages yet.</p>
              ) : (
                <ul className="space-y-2">
                  {contactMessages.map((m) => (
                    <li
                      key={m.id}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 cursor-pointer transition ${m.read ? 'border-white/10 bg-black/20 hover:bg-white/5' : 'border-lifewood-saffron/30 bg-lifewood-saffron/5 hover:bg-lifewood-saffron/10'}`}
                      onClick={() => setSelectedContact(m)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {!m.read && <span className="h-2 w-2 rounded-full bg-lifewood-saffron flex-shrink-0" />}
                        <span className="font-medium truncate">{m.first_name} {m.last_name}</span>
                        <span className="text-white/60 truncate hidden sm:inline">{m.email}</span>
                      </div>
                      <span className="text-xs text-white/50 flex-shrink-0 ml-2">{formatDate(m.created_at)}</span>
                    </li>
                  ))}
                </ul>
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
            <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-white/50">Email</dt><dd className="font-medium">{selectedCareer.email}</dd></div>
              <div><dt className="text-white/50">Phone</dt><dd>{selectedCareer.phone_code} {selectedCareer.phone_number}</dd></div>
              <div><dt className="text-white/50">Country</dt><dd>{selectedCareer.country}</dd></div>
              <div><dt className="text-white/50">Gender / Age</dt><dd>{selectedCareer.gender}, {selectedCareer.age}</dd></div>
              <div className="sm:col-span-2"><dt className="text-white/50">Address</dt><dd>{selectedCareer.current_address}</dd></div>
              <div className="sm:col-span-2"><dt className="text-white/50">Resume</dt><dd>{selectedCareer.resume_file_name}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleDownloadResume(selectedCareer)}
                disabled={resumeLoading === selectedCareer.id}
                className="inline-flex items-center gap-2 rounded-xl bg-lifewood-saffron px-4 py-2.5 text-sm font-semibold text-lifewood-darkSerpent hover:bg-lifewood-earth disabled:opacity-50"
              >
                {resumeLoading === selectedCareer.id ? '…' : <><Download className="h-4 w-4" /> Download resume</>}
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
            </div>
          </div>
        </div>
      )}

      {/* Contact detail modal */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedContact(null)}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/12 bg-[#0e1512] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedContact(null)} className="absolute right-4 top-4 rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            {!selectedContact.read && (
              <button
                onClick={() => handleMarkContactRead(selectedContact.id)}
                className="mb-4 text-sm font-medium text-lifewood-saffron hover:underline"
              >
                Mark as read
              </button>
            )}
            <h3 className="text-xl font-bold text-lifewood-saffron">Contact message</h3>
            <p className="mt-1 text-white/70">{selectedContact.first_name} {selectedContact.last_name} · {formatDate(selectedContact.created_at)}</p>
            <p className="mt-2 text-white/60 text-sm">{selectedContact.email}</p>
            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 text-white/90 whitespace-pre-wrap">
              {selectedContact.message}
            </div>
            <a
              href={`mailto:${selectedContact.email}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              <Mail className="h-4 w-4" /> Reply
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
