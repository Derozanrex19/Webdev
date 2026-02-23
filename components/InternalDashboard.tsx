import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  BarChart3,
  Bell,
  BookOpenText,
  CalendarDays,
  Camera,
  CheckCircle2,
  Clock3,
  FileText,
  Home,
  LogOut,
  Pencil,
  PlayCircle,
  TrendingUp,
  User,
} from 'lucide-react';
import Balatro from './Balatro';

interface InternalDashboardProps {
  userEmail: string;
  onLogout: () => void;
  onGoHome: () => void;
}

type SectionKey = 'dashboard' | 'lessons' | 'reports';
type LessonModule = {
  title: string;
  objective: string;
  content: string;
  task: string;
  duration: string;
};

type LessonTrack = {
  title: string;
  description: string;
  image: string;
  modules: LessonModule[];
};

const schoolOptions = [
  { name: 'University of Cebu', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://www.uc.edu.ph' },
  { name: 'University of San Jose Recoletos', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://usjr.edu.ph' },
  { name: 'University of San Carlos', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://usc.edu.ph' },
  { name: 'Cebu Normal University', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://cnu.edu.ph' },
  { name: 'Cebu Technological University', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://www.ctu.edu.ph' },
  { name: 'Cebu Institute of Technology-University', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://www.cit.edu' },
  { name: 'Southwestern University', logo: 'https://www.google.com/s2/favicons?sz=128&domain_url=https://swu.phinma.edu.ph' },
];

const lessonTracks: LessonTrack[] = [
  {
    title: 'Web Development',
    description: 'Build and ship a production-ready React app with clean architecture and accessibility.',
    modules: [
      {
        title: 'Semantic HTML and Layout Foundations',
        objective: 'Build accessible page structure using semantic tags and clear content hierarchy.',
        content:
          'Use landmarks (`header`, `main`, `section`, `footer`), meaningful heading levels, and responsive CSS layout patterns with Flexbox and Grid.',
        task: 'Convert a marketing landing section into semantic HTML and pass basic Lighthouse accessibility checks.',
        duration: '45 min',
      },
      {
        title: 'React Component Architecture',
        objective: 'Design reusable, maintainable components using props, state, and composition patterns.',
        content:
          'Split UI into presentational and container components, use controlled inputs, and avoid prop-drilling by composing feature blocks cleanly.',
        task: 'Build a modular card system with reusable header, body, and CTA components.',
        duration: '60 min',
      },
      {
        title: 'Routing and Page Composition',
        objective: 'Implement client-side routing and persistent layout regions.',
        content:
          'Create route groups for public and internal pages, maintain shared navigation, and handle route-level loading/error boundaries.',
        task: 'Add route navigation for Home, About, and Dashboard with active-link states.',
        duration: '50 min',
      },
      {
        title: 'Form UX and Validation',
        objective: 'Create robust forms with inline validation and error messaging.',
        content:
          'Use input constraints, real-time feedback, and submit-state handling for loading, success, and error conditions with accessible labels.',
        task: 'Implement a profile form with field validation and status feedback.',
        duration: '55 min',
      },
      {
        title: 'Performance and QA',
        objective: 'Ship pages optimized for speed, readability, and reliability.',
        content:
          'Optimize images, reduce layout shifts, lazy-load noncritical content, and evaluate quality using Lighthouse and manual accessibility checks.',
        task: 'Profile one page and improve Largest Contentful Paint and interaction responsiveness.',
        duration: '40 min',
      },
    ],
    image:
      'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
  },
  {
    title: 'LLM Prompt Engineering',
    description: 'Design prompts that are reliable, testable, and safe for real product use.',
    modules: [
      {
        title: 'Prompt Design Basics',
        objective: 'Write structured prompts with clear roles, constraints, and expected output format.',
        content:
          'Define task intent, output schema, and quality criteria to reduce ambiguity and improve first-pass reliability.',
        task: 'Create prompts for summarization, extraction, and rewriting with JSON output constraints.',
        duration: '45 min',
      },
      {
        title: 'Few-Shot Prompting Strategy',
        objective: 'Increase consistency by demonstrating high-quality examples in-context.',
        content:
          'Use representative examples, edge-case samples, and counterexamples while keeping token budget efficient.',
        task: 'Improve a weak prompt by adding two few-shot examples and compare outputs.',
        duration: '50 min',
      },
      {
        title: 'Grounding and Retrieval',
        objective: 'Reduce hallucinations by grounding responses on provided source context.',
        content:
          'Pass authoritative context snippets, enforce citation behavior, and include fallbacks when confidence is low.',
        task: 'Build a context-aware Q&A prompt template using supplied documents.',
        duration: '60 min',
      },
      {
        title: 'Prompt Evaluation Workflow',
        objective: 'Measure quality through rubric-based scoring and benchmark tests.',
        content:
          'Define precision, completeness, and safety dimensions, then compare prompt variants using repeatable test sets.',
        task: 'Run A/B tests for two prompt versions across ten benchmark inputs.',
        duration: '55 min',
      },
      {
        title: 'Safety and Guardrails',
        objective: 'Handle abuse cases and sensitive requests with predictable, compliant behavior.',
        content:
          'Apply refusal templates, escalation logic, and policy-aware response rules to block unsafe completions.',
        task: 'Implement guardrail prompts for harmful instructions and privacy-sensitive requests.',
        duration: '45 min',
      },
    ],
    image:
      'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
  },
  {
    title: 'Product Delivery',
    description: 'Plan, execute, and communicate software delivery with measurable sprint outcomes.',
    modules: [
      {
        title: 'User Stories and Acceptance Criteria',
        objective: 'Translate business goals into clear, testable development requirements.',
        content:
          'Write user stories with measurable outcomes and acceptance criteria that can be validated by QA and stakeholders.',
        task: 'Draft five user stories for an internship dashboard feature release.',
        duration: '40 min',
      },
      {
        title: 'Sprint Planning and Task Slicing',
        objective: 'Break work into scoped tasks with realistic estimates and dependencies.',
        content:
          'Split large features into vertical slices, assign owners, and map risks before committing sprint scope.',
        task: 'Create a sprint board with prioritized tasks and time estimates.',
        duration: '50 min',
      },
      {
        title: 'Quality Gates and Handoff',
        objective: 'Improve release reliability through explicit definition of done and QA checkpoints.',
        content:
          'Document testing requirements, review gates, and deployment checks for consistent handoff quality.',
        task: 'Prepare a release checklist for frontend, QA, and PM approval flow.',
        duration: '45 min',
      },
      {
        title: 'Stakeholder Reporting',
        objective: 'Communicate progress, risks, and dependencies in an executive-friendly format.',
        content:
          'Use concise weekly reports focused on outcomes, blockers, and next actions with ownership transparency.',
        task: 'Write a weekly sprint update report with metrics and risk flags.',
        duration: '35 min',
      },
      {
        title: 'Retrospective and Process Improvement',
        objective: 'Improve team velocity using evidence-based iteration decisions.',
        content:
          'Capture what worked, what failed, and what process changes should be applied to the next sprint cycle.',
        task: 'Run a retrospective template and define three actions for the next sprint.',
        duration: '40 min',
      },
    ],
    image:
      'https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1400&h=900&dpr=2',
  },
];

const InternalDashboard: React.FC<InternalDashboardProps> = ({ userEmail, onLogout, onGoHome }) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('dashboard');
  const [activeLessonTrackIndex, setActiveLessonTrackIndex] = useState(0);
  const [activeLessonModuleIndex, setActiveLessonModuleIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [fullName, setFullName] = useState('Lifewood Intern');
  const [school, setSchool] = useState('University of Cebu');
  const [phone, setPhone] = useState('+63 900 123 4567');
  const [profileImage, setProfileImage] = useState(
    '/profile-default.jpg'
  );
  const [draftProfileImage, setDraftProfileImage] = useState<string | null>(null);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropScale, setCropScale] = useState(1.15);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropPointerRef = useRef({ startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const initials = useMemo(
    () =>
      fullName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
    [fullName]
  );

  const selectedSchoolLogo = useMemo(() => {
    return schoolOptions.find((item) => item.name === school)?.logo || '';
  }, [school]);

  const activeLessonTrack = lessonTracks[activeLessonTrackIndex] ?? lessonTracks[0];
  const activeLessonModule = activeLessonTrack.modules[activeLessonModuleIndex] ?? activeLessonTrack.modules[0];

  const clampCropOffset = (value: number, scale: number) => {
    const limit = 28 + (scale - 1) * 120;
    return Math.max(-limit, Math.min(limit, value));
  };

  const startCropFromFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraftProfileImage(reader.result);
        setCropX(0);
        setCropY(0);
        setCropScale(1.15);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    startCropFromFile(event.target.files?.[0]);
  };

  const handleDropUpload = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    startCropFromFile(event.dataTransfer.files?.[0]);
  };

  const handleCropMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    cropPointerRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: cropX,
      baseY: cropY,
    };
    setIsDraggingCrop(true);
  };

  useEffect(() => {
    if (!isDraggingCrop) return;
    const handleMove = (event: MouseEvent) => {
      const dx = event.clientX - cropPointerRef.current.startX;
      const dy = event.clientY - cropPointerRef.current.startY;
      setCropX(clampCropOffset(cropPointerRef.current.baseX + dx, cropScale));
      setCropY(clampCropOffset(cropPointerRef.current.baseY + dy, cropScale));
    };
    const handleUp = () => setIsDraggingCrop(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [cropScale, isDraggingCrop]);

  useEffect(() => {
    if (activeLessonModuleIndex >= activeLessonTrack.modules.length) {
      setActiveLessonModuleIndex(0);
    }
  }, [activeLessonModuleIndex, activeLessonTrack.modules.length]);

  const generateCroppedAvatar = async () => {
    const source = draftProfileImage || profileImage;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('Image load failed'));
      image.src = source;
    });

    const editorSize = 280;
    const outputSize = 320;
    const ratio = outputSize / editorSize;
    const coverScale = Math.max(editorSize / image.naturalWidth, editorSize / image.naturalHeight);
    const drawWidth = image.naturalWidth * coverScale;
    const drawHeight = image.naturalHeight * coverScale;

    const canvas = document.createElement('canvas');
    canvas.width = outputSize;
    canvas.height = outputSize;
    const context = canvas.getContext('2d');
    if (!context) return source;

    context.save();
    context.beginPath();
    context.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.translate(outputSize / 2 + cropX * ratio, outputSize / 2 + cropY * ratio);
    context.scale(cropScale, cropScale);
    context.drawImage(
      image,
      (-drawWidth * ratio) / 2,
      (-drawHeight * ratio) / 2,
      drawWidth * ratio,
      drawHeight * ratio
    );
    context.restore();
    return canvas.toDataURL('image/png');
  };

  const handleSaveProfile = async () => {
    const cropped = await generateCroppedAvatar();
    setProfileImage(cropped);
    setShowProfile(false);
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
          contrast={2.25}
          lighting={0.32}
          spinAmount={0.18}
          spinSpeed={4.6}
          spinRotation={-1.1}
          spinEase={0.9}
        />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_12%,rgba(200,255,52,0.16),transparent_34%),radial-gradient(circle_at_80%_100%,rgba(255,179,71,0.16),transparent_36%),linear-gradient(to_bottom,rgba(4,14,10,0.30),rgba(4,14,10,0.58))]"></div>

      <div className="relative z-10 mx-auto grid max-w-[96rem] grid-cols-1 gap-5 lg:grid-cols-12">
        <aside className="rounded-3xl border border-white/12 bg-[#0d1512]/92 p-7 backdrop-blur-sm lg:col-span-4 xl:col-span-3" style={{ animation: 'panelRise 560ms ease both' }}>
          <div className="flex items-center gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border border-white/20">
              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-xl font-bold">{fullName}</p>
              <p className="text-sm text-white/70">{userEmail}</p>
            </div>
          </div>

          <div className="mt-7 space-y-2 text-base">
            <button onClick={() => setActiveSection('dashboard')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'dashboard' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>Dashboard</button>
            <button onClick={() => setActiveSection('lessons')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'lessons' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>Lessons</button>
            <button onClick={() => setActiveSection('reports')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'reports' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>Reports</button>
          </div>

          <div className="mt-6 space-y-3">
            <article className="rounded-xl border border-white/12 bg-black/20 p-3">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#C8FF34]"><BookOpenText className="h-3.5 w-3.5" /> Lessons</p>
              <p className="mt-1 text-sm text-white/80">3 active modules, next in 2h.</p>
            </article>
            <article className="rounded-xl border border-white/12 bg-black/20 p-3">
              <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-[#C8FF34]"><FileText className="h-3.5 w-3.5" /> Reports</p>
              <p className="mt-1 text-sm text-white/80">2 pending reviews this week.</p>
            </article>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
            <button onClick={onGoHome} className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10">
              <Home className="h-4 w-4" />
              Home
            </button>
          </div>
        </aside>

        <div className="space-y-5 lg:col-span-8 xl:col-span-9">
          <article className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-r from-[#131c17]/95 to-[#101612]/95 p-6 md:p-8" style={{ animation: 'panelRise 560ms ease 80ms both' }}>
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C8FF34]/12 blur-3xl"></div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C8FF34]">Internal Workspace</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              {activeSection === 'dashboard' ? `Welcome back, ${fullName}` : activeSection === 'lessons' ? 'Lessons Center' : 'Reports Center'}
            </h1>
            <p className="mt-3 text-base text-white/72 md:text-lg">
              {activeSection === 'dashboard'
                ? 'Track progress, update your profile, and continue your internship path.'
                : activeSection === 'lessons'
                  ? 'Review active modules, upcoming sessions, and learning milestones.'
                  : 'Monitor performance, quality trends, and delivery outcomes.'}
            </p>
          </article>

          {activeSection === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3" style={{ animation: 'panelRise 560ms ease 140ms both' }}>
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Completion</p>
                  <p className="mt-2 text-4xl font-black text-[#C8FF34]">98%</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-xs text-white/70"><TrendingUp className="h-3.5 w-3.5 text-[#C8FF34]" /> +6% this week</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Weekly Goals</p>
                  <p className="mt-2 text-4xl font-black">04</p>
                  <p className="mt-2 text-xs text-white/70">2 completed, 2 in progress</p>
                </article>
                <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/60">Alerts</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-[#C8FF34]"><Bell className="h-5 w-5" /> 1 New Update</p>
                  <p className="mt-2 text-xs text-white/70">Evaluation unlocks tomorrow</p>
                </article>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.05fr_1.2fr]" style={{ animation: 'panelRise 560ms ease 200ms both' }}>
                <article className="overflow-hidden rounded-2xl border border-white/12 bg-[#101612]/94">
                  <div className="relative h-[420px] overflow-hidden lg:h-[460px]">
                    <img
                      src={profileImage}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-transparent to-black/12"></div>
                    <button
                      onClick={() => { setDraftProfileImage(profileImage); setCropX(0); setCropY(0); setCropScale(1.15); setShowProfile(true); }}
                      className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-black/35 px-3 py-1.5 text-xs font-bold text-white"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit Profile
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-xl border border-white/20 bg-black/45 px-3 py-2.5 backdrop-blur">
                      <div>
                        <p className="text-sm font-semibold">{fullName}</p>
                        <p className="text-[11px] uppercase tracking-[0.12em] text-white/70">{school}</p>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white p-1">
                        {selectedSchoolLogo ? (
                          <img src={selectedSchoolLogo} alt={school} className="h-full w-full rounded-full object-cover" />
                        ) : (
                          <span className="text-[#0c140f] text-sm font-black">{initials}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-white/12 bg-white/[0.96] p-5 text-[#111] md:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-[2rem] font-bold leading-none">Activity</h2>
                      <p className="mt-1 text-sm text-black/45">Recent updates</p>
                    </div>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-black/45">...</button>
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#0d0f10] p-3 text-white shadow-[0_16px_32px_rgba(0,0,0,0.25)]">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-full bg-[#C8FF34] px-2 text-sm font-black text-[#111]">98%</span>
                      <div>
                        <p className="text-sm font-semibold">Quiz Score: React Hooks</p>
                        <p className="text-xs text-white/65">27 Feb, 2026</p>
                      </div>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/6 text-xs font-bold">x2</span>
                      <div>
                        <p className="text-sm font-semibold text-black/85">Productivity Streak</p>
                        <p className="text-xs text-black/50">Increased limits on tasks</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/6 text-xs font-bold">2%</span>
                      <div>
                        <p className="text-sm font-semibold text-black/85">Optimization Bonus</p>
                        <p className="text-xs text-black/50">Code quality improvement</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-black/6">
                        <CheckCircle2 className="h-4 w-4 text-lifewood-castleton" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-black/85">Profile Sync Complete</p>
                        <p className="text-xs text-black/50">{phone}</p>
                      </div>
                    </li>
                  </ul>
                </article>
              </div>
            </>
          )}

          {activeSection === 'lessons' && (
            <section className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6" style={{ animation: 'panelRise 560ms ease 160ms both' }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Featured Learning Tracks</h2>
                <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60"><Clock3 className="h-3.5 w-3.5" /> Next class in 02:10:25</p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {lessonTracks.map((card, index) => (
                  <article
                    key={card.title}
                    className={`group overflow-hidden rounded-xl border bg-black/20 transition duration-300 hover:-translate-y-1 hover:border-[#C8FF34]/50 ${
                      activeLessonTrackIndex === index ? 'border-[#C8FF34]/70' : 'border-white/10'
                    }`}
                    style={{ animation: `fadeUp 520ms ease ${index * 120}ms both` }}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={card.image} alt={card.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                      <button
                        onClick={() => {
                          setActiveLessonTrackIndex(index);
                          setActiveLessonModuleIndex(0);
                        }}
                        className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#C8FF34] transition hover:bg-[#C8FF34] hover:text-[#111]"
                      >
                        <PlayCircle className="h-3 w-3" /> Start
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/70">{card.description}</p>
                      <ul className="mt-3 space-y-1.5 text-xs text-white/72">
                        {card.modules.slice(0, 4).map((lesson) => (
                          <li key={lesson.title} className="inline-flex w-full items-start gap-1.5">
                            <span className="mt-[0.35rem] h-1.5 w-1.5 rounded-full bg-[#C8FF34]"></span>
                            <span>{lesson.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>

              <article className="mt-6 rounded-2xl border border-white/12 bg-black/25 p-5 md:p-6" style={{ animation: 'panelRise 560ms ease 220ms both' }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#C8FF34]">Active Course</p>
                    <h3 className="mt-1 text-2xl font-black">{activeLessonTrack.title}</h3>
                    <p className="mt-2 max-w-3xl text-sm text-white/72">{activeLessonTrack.description}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#C8FF34]/40 bg-[#C8FF34]/10 px-3 py-1 text-xs font-semibold text-[#C8FF34]">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {activeLessonTrack.modules.length} modules
                  </span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.45fr]">
                  <div className="rounded-xl border border-white/10 bg-[#0f1713]/80 p-3">
                    <p className="mb-2 px-1 text-xs uppercase tracking-[0.16em] text-white/55">Course Modules</p>
                    <div className="space-y-2">
                      {activeLessonTrack.modules.map((module, moduleIndex) => (
                        <button
                          key={module.title}
                          onClick={() => setActiveLessonModuleIndex(moduleIndex)}
                          className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                            activeLessonModuleIndex === moduleIndex
                              ? 'border-[#C8FF34]/50 bg-[#C8FF34]/10'
                              : 'border-white/10 bg-black/20 hover:border-white/25'
                          }`}
                        >
                          <p className="text-sm font-semibold">{module.title}</p>
                          <p className="mt-1 text-xs text-white/60">{module.duration}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-[#0f1713]/80 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[#C8FF34]">Current Lesson</p>
                    <h4 className="mt-2 text-xl font-bold">{activeLessonModule.title}</h4>
                    <div className="mt-4 space-y-4 text-sm leading-relaxed text-white/78">
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-white/55">Objective</p>
                        <p className="mt-1">{activeLessonModule.objective}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-white/55">Lesson Content</p>
                        <p className="mt-1">{activeLessonModule.content}</p>
                      </div>
                      <div className="rounded-lg border border-[#C8FF34]/20 bg-[#C8FF34]/10 p-3">
                        <p className="text-xs uppercase tracking-[0.14em] text-[#C8FF34]">Hands-on Task</p>
                        <p className="mt-1 text-white/86">{activeLessonModule.task}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          )}

          {activeSection === 'reports' && (
            <section className="space-y-5" style={{ animation: 'panelRise 560ms ease 160ms both' }}>
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <h2 className="text-xl font-bold">Performance Timeline</h2>
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'Code Quality', value: 92 },
                    { label: 'Prompt Reliability', value: 87 },
                    { label: 'Delivery Speed', value: 90 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-white/75">{item.label}</span>
                        <span className="font-semibold text-[#C8FF34]">{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-[#C8FF34]" style={{ width: `${item.value}%`, animation: 'growBar 850ms ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl border border-[#C8FF34]/25 bg-[#C8FF34]/10 p-3 text-sm text-white/85">
                  <p className="inline-flex items-center gap-2 font-semibold text-[#C8FF34]"><Award className="h-4 w-4" /> Bonus unlocked</p>
                  <p className="mt-1">You are in the top 8% of this internship cohort.</p>
                </div>
              </article>

              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <h3 className="inline-flex items-center gap-2 text-lg font-bold"><BarChart3 className="h-5 w-5 text-[#C8FF34]" /> Latest Reports</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"><span>Weekly Internship Health</span><span className="text-white/65">Updated 2h ago</span></li>
                  <li className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"><span>Prompt Accuracy Summary</span><span className="text-white/65">Updated Yesterday</span></li>
                  <li className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2"><span>Frontend Delivery Metrics</span><span className="text-white/65">Updated 3 days ago</span></li>
                </ul>
              </article>
            </section>
          )}
        </div>
      </div>

      {showProfile && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0e1512] p-4 shadow-2xl sm:p-6 max-h-[92vh] overflow-y-auto">
            <h3 className="text-2xl font-bold">Edit Profile</h3>
            <p className="mt-1 text-sm text-white/60">Update your details</p>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="mb-3 text-sm text-white/70">Profile picture</p>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div onDragOver={(event) => { event.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={handleDropUpload} className={`rounded-xl border border-dashed p-3 text-center transition ${isDragOver ? 'border-[#C8FF34] bg-[#C8FF34]/10' : 'border-white/20 bg-black/20'}`}>
                  <div onMouseDown={handleCropMouseDown} className="mx-auto h-[280px] w-[280px] cursor-move overflow-hidden rounded-full border border-white/20 bg-black/35">
                    <img src={draftProfileImage || profileImage} alt="Avatar crop preview" draggable={false} className="h-full w-full select-none object-cover" style={{ transform: `translate(${cropX}px, ${cropY}px) scale(${cropScale})`, transition: isDraggingCrop ? 'none' : 'transform 120ms ease-out' }} />
                  </div>
                  <p className="mt-3 text-xs text-white/60">Drag image inside the circle to reposition</p>
                </div>
                <div className="space-y-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/5">
                    <Camera className="h-4 w-4" /> Upload / Drop
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
                  <label className="block text-xs text-white/60">Zoom
                    <input type="range" min={1} max={2.6} step={0.01} value={cropScale} onChange={(event) => setCropScale(Number(event.target.value))} className="mt-1 w-full accent-[#C8FF34]" />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              <label className="text-sm"><span className="mb-1 block text-white/65">Full Name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} className="h-10 w-full rounded-lg border border-white/15 bg-black/20 px-3 outline-none" /></label>
              <label className="text-sm">
                <span className="mb-1 block text-white/65">School</span>
                <div className="relative">
                  <select
                    value={school}
                    onChange={(event) => setSchool(event.target.value)}
                    className="h-10 w-full appearance-none rounded-lg border border-white/15 bg-black/20 px-3 pr-10 outline-none"
                  >
                    {schoolOptions.map((option) => (
                      <option key={option.name} value={option.name} className="bg-[#0e1512]">
                        {option.name}
                      </option>
                    ))}
                  </select>
                  {selectedSchoolLogo && (
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white p-0.5">
                      <img src={selectedSchoolLogo} alt={school} className="h-full w-full rounded-full object-cover" />
                    </span>
                  )}
                </div>
              </label>
              <label className="text-sm md:col-span-2"><span className="mb-1 block text-white/65">Phone</span><input value={phone} onChange={(event) => setPhone(event.target.value)} className="h-10 w-full rounded-lg border border-white/15 bg-black/20 px-3 outline-none" /></label>
            </div>
            <div className="sticky bottom-0 mt-5 flex justify-end gap-2 border-t border-white/10 bg-[#0e1512]/95 pt-3 backdrop-blur">
              <button onClick={() => setShowProfile(false)} className="rounded-lg border border-white/15 px-4 py-2 text-sm">Cancel</button>
              <button onClick={handleSaveProfile} className="rounded-lg bg-[#C8FF34] px-4 py-2 text-sm font-black text-[#0e1512]">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelRise {
          from { opacity: 0; transform: translateY(16px) scale(0.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes growBar {
          from { width: 0; }
        }
      `}</style>
    </section>
  );
};

export default InternalDashboard;
