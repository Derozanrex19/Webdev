import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, FileText, Upload, CheckCircle2, X } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../services/supabaseClient';
import { Page } from '../types';
import Orb from './Orb';
import GhostLoader from './GhostLoader';

const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_WEBSITE_LINK = import.meta.env.VITE_EMAILJS_WEBSITE_LINK || '';

interface CareersApplicationProps {
  onNavigate: (page: Page) => void;
}

const positionOptions = [
  'AI Data Associate',
  'Data Annotator',
  'Web Development Intern',
  'LLM Prompt Engineering Intern',
  'Product Delivery Intern',
  'QA Analyst Intern',
];

const countryOptions = [
  'Philippines',
  'Malaysia',
  'Singapore',
  'Bangladesh',
  'Nigeria',
  'South Africa',
  'Kenya',
];

const genderOptions = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
const APPLICATION_BUCKET = 'career-documents';
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

type FormDropdownId = 'gender' | 'position' | 'country';

const CareersApplication: React.FC<CareersApplicationProps> = ({ onNavigate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [phoneCode, setPhoneCode] = useState('+63');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [positionApplied, setPositionApplied] = useState('');
  const [country, setCountry] = useState('Philippines');
  const [currentAddress, setCurrentAddress] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeLabel, setResumeLabel] = useState('Upload CV (PDF)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState<'sent' | 'failed' | 'skipped' | null>(null);
  const [applicantEmailForModal, setApplicantEmailForModal] = useState('');
  const [openFormDropdown, setOpenFormDropdown] = useState<FormDropdownId | null>(null);

  useEffect(() => {
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }, []);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setOpenFormDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      gender &&
      age.trim() &&
      phoneNumber.trim() &&
      email.trim() &&
      positionApplied &&
      country &&
      currentAddress.trim() &&
      resumeFile
    );
  }, [
    age,
    country,
    currentAddress,
    email,
    firstName,
    gender,
    lastName,
    phoneNumber,
    positionApplied,
    resumeFile,
  ]);

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setResumeFile(null);
      setResumeLabel('Upload CV (PDF)');
      setError('Only PDF resumes are accepted.');
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      setResumeFile(null);
      setResumeLabel('Upload CV (PDF)');
      setError('Resume must be 5 MB or smaller.');
      return;
    }
    setError('');
    setResumeFile(file);
    setResumeLabel(file.name);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !resumeFile) return;

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const applicationId = crypto.randomUUID();
      const sanitizedName = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const fileExt = resumeFile.name.split('.').pop() || 'pdf';
      const filePath = `${applicationId}/${Date.now()}-${sanitizedName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from(APPLICATION_BUCKET)
        .upload(filePath, resumeFile, {
          upsert: false,
          contentType: resumeFile.type || 'application/pdf',
        });

      if (uploadError) {
        throw new Error(uploadError.message || 'Resume upload failed.');
      }

      const { error: insertError } = await supabase.from('career_applications').insert({
        id: applicationId,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        gender,
        age: Number(age),
        phone_code: phoneCode.trim(),
        phone_number: phoneNumber.trim(),
        email: email.trim().toLowerCase(),
        position_applied: positionApplied,
        country,
        current_address: currentAddress.trim(),
        resume_path: filePath,
        resume_file_name: resumeFile.name,
        status: 'submitted',
      });

      if (insertError) {
        throw new Error(insertError.message || 'Application save failed.');
      }

      const applicantEmail = email.trim().toLowerCase();
      setApplicantEmailForModal(applicantEmail);

      // Template variables must match EmailJS template: {{email}} for To, {{first_name}}, {{position_applied}}, optional {{website_link}}
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            email: applicantEmail,
            to_email: applicantEmail,
            first_name: firstName.trim(),
            position_applied: positionApplied,
            ...(EMAILJS_WEBSITE_LINK && { website_link: EMAILJS_WEBSITE_LINK }),
          });
          setEmailSendStatus('sent');
        } catch (emailErr) {
          setEmailSendStatus('failed');
          console.error('EmailJS thank-you email failed:', emailErr);
        }
      } else {
        setEmailSendStatus('skipped');
        if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
          console.warn('EmailJS not configured: set VITE_EMAILJS_PUBLIC_KEY, VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID in .env.local');
        }
      }

      setSuccess('Application submitted successfully.');
      setShowThankYouModal(true);
      setFirstName('');
      setLastName('');
      setGender('');
      setAge('');
      setPhoneCode('+63');
      setPhoneNumber('');
      setEmail('');
      setPositionApplied('');
      setCountry('Philippines');
      setCurrentAddress('');
      setResumeFile(null);
      setResumeLabel('Upload CV (PDF)');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit application.');
      setEmailSendStatus(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeThankYouModal = () => {
    setShowThankYouModal(false);
    setEmailSendStatus(null);
    setApplicantEmailForModal('');
  };

  return (
    <section className="careers-apply-page relative min-h-[calc(100vh-120px)] overflow-hidden bg-[#0a0d0c] px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 z-0">
        <Orb
          hue={120}
          hoverIntensity={2}
          rotateOnHover
          forceHoverState={false}
          backgroundColor="#0a0d0c"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <button
          type="button"
          onClick={() => onNavigate(Page.CAREERS)}
          className="careers-apply-back-btn inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/6 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-lifewood-saffron/50 hover:bg-white/12 hover:text-white hover:shadow-[0_0_24px_rgba(255,179,71,0.15)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to Careers
        </button>

        <div className="mt-6 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="careers-apply-card-left rounded-[34px] border border-white/10 bg-white/[0.05] p-6 text-white shadow-[0_24px_48px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-8">
            <p className="careers-apply-stagger-1 text-xs font-bold uppercase tracking-[0.22em] text-lifewood-saffron">Join Lifewood</p>
            <h1 className="careers-apply-stagger-2 mt-3 text-4xl font-black leading-[0.95] sm:text-5xl">
              Apply to the team building AI-powered data operations.
            </h1>
            <p className="careers-apply-stagger-3 mt-5 max-w-xl text-base leading-relaxed text-white/72">
              Complete the application below. We review each submission for role fit, communication quality, and operational readiness.
            </p>
            <div className="careers-apply-image-wrap mt-8 overflow-hidden rounded-[26px] border border-white/10">
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1200&fit=crop&dpr=2"
                alt="Lifewood team collaboration"
                className="careers-apply-image h-[300px] w-full object-cover"
              />
            </div>
          </article>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="careers-apply-card-right rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.09),rgba(255,255,255,0.05))] p-5 text-white shadow-[0_26px_48px_rgba(0,0,0,0.26)] backdrop-blur-xl sm:p-7"
          >
            <h2 className="careers-apply-form-title text-3xl font-black">Join Our Team</h2>
            <p className="careers-apply-form-subtitle mt-2 text-sm text-white/68">Please fill out the form below to apply.</p>

            <div className="careers-apply-fields mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm">
                <span className="mb-1.5 block text-white/72">First Name</span>
                <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="career-form-field" placeholder="e.g. Michael" />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block text-white/72">Last Name</span>
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="career-form-field" placeholder="e.g. Chen" />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block text-white/72">Gender</span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFormDropdown((v) => (v === 'gender' ? null : 'gender'))}
                    className={`career-form-field career-form-dropdown-trigger w-full cursor-pointer pr-10 text-left ${openFormDropdown === 'gender' ? 'career-form-dropdown-trigger-open' : ''}`}
                  >
                    {gender || 'Select gender'}
                  </button>
                  <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55 transition-transform duration-200 ${openFormDropdown === 'gender' ? 'rotate-180' : ''}`} />
                  {openFormDropdown === 'gender' && (
                    <div className="career-form-dropdown-panel" role="listbox">
                      {genderOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          role="option"
                          aria-selected={gender === option}
                          onClick={() => {
                            setGender(option);
                            setOpenFormDropdown(null);
                          }}
                          className={`career-form-dropdown-option ${gender === option ? 'career-form-dropdown-option-selected' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block text-white/72">Age</span>
                <input value={age} onChange={(event) => setAge(event.target.value)} className="career-form-field" placeholder="e.g. 23" inputMode="numeric" />
              </label>
              <label className="text-sm">
                <span className="mb-1.5 block text-white/72">Phone Number</span>
                <div className="grid grid-cols-[106px_1fr] gap-2">
                  <input value={phoneCode} onChange={(event) => setPhoneCode(event.target.value)} className="career-form-field" placeholder="+63" />
                  <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} className="career-form-field" placeholder="9123456789" />
                </div>
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-1.5 block text-white/72">Email Address</span>
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="career-form-field" placeholder="yourname@example.com" type="email" />
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-1.5 block text-white/72">Position Applied</span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFormDropdown((v) => (v === 'position' ? null : 'position'))}
                    className={`career-form-field career-form-dropdown-trigger w-full cursor-pointer pr-10 text-left ${openFormDropdown === 'position' ? 'career-form-dropdown-trigger-open' : ''}`}
                  >
                    {positionApplied || 'Select position'}
                  </button>
                  <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55 transition-transform duration-200 ${openFormDropdown === 'position' ? 'rotate-180' : ''}`} />
                  {openFormDropdown === 'position' && (
                    <div className="career-form-dropdown-panel" role="listbox">
                      {positionOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          role="option"
                          aria-selected={positionApplied === option}
                          onClick={() => {
                            setPositionApplied(option);
                            setOpenFormDropdown(null);
                          }}
                          className={`career-form-dropdown-option ${positionApplied === option ? 'career-form-dropdown-option-selected' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-1.5 block text-white/72">Country</span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenFormDropdown((v) => (v === 'country' ? null : 'country'))}
                    className={`career-form-field career-form-dropdown-trigger w-full cursor-pointer pr-10 text-left ${openFormDropdown === 'country' ? 'career-form-dropdown-trigger-open' : ''}`}
                  >
                    {country}
                  </button>
                  <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/55 transition-transform duration-200 ${openFormDropdown === 'country' ? 'rotate-180' : ''}`} />
                  {openFormDropdown === 'country' && (
                    <div className="career-form-dropdown-panel" role="listbox">
                      {countryOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          role="option"
                          aria-selected={country === option}
                          onClick={() => {
                            setCountry(option);
                            setOpenFormDropdown(null);
                          }}
                          className={`career-form-dropdown-option ${country === option ? 'career-form-dropdown-option-selected' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </label>
              <label className="text-sm md:col-span-2">
                <span className="mb-1.5 block text-white/72">Current Address</span>
                <input value={currentAddress} onChange={(event) => setCurrentAddress(event.target.value)} className="career-form-field" placeholder="e.g. Quezon City, Metro Manila" />
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm text-white/72">Upload CV (PDF)</p>
              <label className="career-upload-zone">
                <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={handleResumeChange} />
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/18 bg-white/8">
                  {resumeFile ? <CheckCircle2 className="h-5 w-5 text-lifewood-saffron" /> : <Upload className="h-5 w-5 text-white/76" />}
                </span>
                <span className="mt-4 text-sm font-semibold">{resumeLabel}</span>
                <span className="mt-1 text-xs text-white/54">
                  {resumeFile ? 'File attached and ready to upload.' : 'Click to upload or drag and drop PDF only.'}
                </span>
              </label>
            </div>

            {error && <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
            {success && !showThankYouModal && <p className="mt-4 rounded-xl border border-lifewood-castleton/35 bg-lifewood-castleton/12 px-4 py-3 text-sm text-[#9ff1cc]">{success}</p>}

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="careers-apply-submit mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0.08))] px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:border-lifewood-saffron/40 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.25),rgba(255,255,255,0.12))] hover:shadow-[0_0_28px_rgba(255,179,71,0.2)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <>
                  <GhostLoader inline scale={0.16} className="[&_.ghost-loader__label]:hidden" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {showThankYouModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="thank-you-title"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeThankYouModal}
            aria-hidden
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1814] p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={closeThankYouModal}
              className="absolute right-4 top-4 rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-lifewood-castleton/20">
                <CheckCircle2 className="h-8 w-8 text-lifewood-castleton" />
              </div>
              <h2 id="thank-you-title" className="text-2xl font-bold text-white">
                Thank you
              </h2>
              <p className="mt-3 text-white/80">
                Your application has been submitted successfully. Our team will review it and an admin will contact you if your profile matches the next step.
              </p>
              {emailSendStatus === 'sent' && (
                <p className="mt-2 text-sm text-lifewood-castleton">
                  A confirmation email was sent to {applicantEmailForModal}.
                </p>
              )}
              {emailSendStatus === 'failed' && (
                <p className="mt-2 text-sm text-amber-400">
                  We couldn’t send the confirmation email. Check your spam folder, or open the browser console (F12) for details. In EmailJS, ensure the template <strong>To</strong> field is set to <code className="text-white/90">{"{{to_email}}"}</code>.
                </p>
              )}
              {emailSendStatus === 'skipped' && (
                <p className="mt-2 text-sm text-white/60">
                  Add EmailJS keys to .env.local to send confirmation emails.
                </p>
              )}
              <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={() => {
                    closeThankYouModal();
                    onNavigate(Page.CAREERS);
                  }}
                  className="rounded-xl bg-lifewood-saffron px-5 py-2.5 text-sm font-semibold text-lifewood-darkSerpent transition hover:bg-lifewood-earth"
                >
                  Back to Careers
                </button>
                <button
                  type="button"
                  onClick={closeThankYouModal}
                  className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes careersApplyFadeUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes careersApplyImageIn {
          0% { opacity: 0.7; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        .careers-apply-back-btn {
          animation: careersApplyFadeUp 0.6s ease-out both;
        }
        .careers-apply-card-left {
          animation: careersApplyFadeUp 0.7s ease-out 0.08s both;
        }
        .careers-apply-stagger-1 { animation: careersApplyFadeUp 0.6s ease-out 0.2s both; }
        .careers-apply-stagger-2 { animation: careersApplyFadeUp 0.6s ease-out 0.28s both; }
        .careers-apply-stagger-3 { animation: careersApplyFadeUp 0.6s ease-out 0.36s both; }
        .careers-apply-image-wrap {
          animation: careersApplyFadeUp 0.6s ease-out 0.44s both;
        }
        .careers-apply-image {
          animation: careersApplyImageIn 1.2s ease-out 0.5s both;
        }
        .careers-apply-card-right {
          animation: careersApplyFadeUp 0.7s ease-out 0.15s both;
        }
        .careers-apply-form-title { animation: careersApplyFadeUp 0.5s ease-out 0.25s both; }
        .careers-apply-form-subtitle { animation: careersApplyFadeUp 0.5s ease-out 0.32s both; }
        .careers-apply-fields {
          animation: careersApplyFadeUp 0.5s ease-out 0.4s both;
        }
        .careers-apply-submit {
          animation: careersApplyFadeUp 0.5s ease-out 0.55s both;
        }
        @media (prefers-reduced-motion: reduce) {
          .careers-apply-back-btn,
          .careers-apply-card-left,
          .careers-apply-card-right,
          .careers-apply-stagger-1,
          .careers-apply-stagger-2,
          .careers-apply-stagger-3,
          .careers-apply-image-wrap,
          .careers-apply-image,
          .careers-apply-form-title,
          .careers-apply-form-subtitle,
          .careers-apply-fields,
          .careers-apply-submit { animation: none; }
        }
        .career-form-field {
          width: 100%;
          height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08);
          padding: 0 14px;
          color: #ffffff;
          outline: none;
          transition: border-color 200ms ease, background 200ms ease, box-shadow 200ms ease;
        }
        .career-form-field:focus {
          border-color: rgba(255,179,71,0.58);
          background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 3px rgba(255,179,71,0.18);
        }
        .career-form-field::placeholder {
          color: rgba(255,255,255,0.42);
        }
        .career-form-field option {
          background: #17201b;
          color: #f9f7f7;
        }
        .career-form-dropdown-trigger-open {
          border-color: rgba(255,179,71,0.58);
          background: rgba(255,255,255,0.12);
          box-shadow: 0 0 0 3px rgba(255,179,71,0.18);
        }
        .career-form-dropdown-panel {
          position: absolute;
          left: 0;
          right: 0;
          top: 100%;
          margin-top: 4px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          background: #17201b;
          box-shadow: 0 12px 28px rgba(0,0,0,0.4);
          max-height: 240px;
          overflow-y: auto;
          z-index: 20;
          padding: 6px 0;
        }
        .career-form-dropdown-option {
          display: block;
          width: 100%;
          padding: 12px 14px;
          text-align: left;
          font-size: inherit;
          color: #f9f7f7;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .career-form-dropdown-option:hover {
          background: rgba(255,179,71,0.22);
          color: #ffffff;
        }
        .career-form-dropdown-option-selected,
        .career-form-dropdown-option-selected:hover {
          background: rgba(255,179,71,0.35);
          color: #ffffff;
        }
        .career-upload-zone {
          display: flex;
          min-height: 158px;
          cursor: pointer;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 18px;
          border: 1px dashed rgba(255,255,255,0.26);
          background: rgba(255,255,255,0.04);
          text-align: center;
          transition: border-color 200ms ease, background 200ms ease, transform 200ms ease, box-shadow 200ms ease;
        }
        .career-upload-zone:hover {
          border-color: rgba(255,179,71,0.6);
          background: rgba(255,255,255,0.06);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
      `}</style>
    </section>
  );
};

export default CareersApplication;
