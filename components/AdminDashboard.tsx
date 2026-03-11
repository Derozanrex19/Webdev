import React, { useState } from 'react';
import {
  BarChart3,
  Briefcase,
  FileText,
  Home,
  LogOut,
  ShieldCheck,
  Users,
  UserPlus,
  Settings,
  Bell,
} from 'lucide-react';
import Balatro from './Balatro';

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => void;
  onGoHome: () => void;
}

type AdminSection = 'overview' | 'users' | 'reports' | 'settings';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ userEmail, onLogout, onGoHome }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

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
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_20%_12%,rgba(200,255,52,0.16),transparent_34%),radial-gradient(circle_at_80%_100%,rgba(255,179,71,0.16),transparent_36%),linear-gradient(to_bottom,rgba(4,14,10,0.30),rgba(4,14,10,0.58))]"></div>

      <div className="relative z-10 mx-auto grid max-w-[96rem] grid-cols-1 gap-5 lg:grid-cols-12">
        <aside className="rounded-3xl border border-white/12 bg-[#0d1512]/92 p-7 backdrop-blur-sm lg:col-span-4 xl:col-span-3">
          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-white/70">Admin Account</p>
            <p className="mt-2 text-lg font-bold">{userEmail}</p>
            <p className="mt-1 inline-flex items-center gap-2 text-xs text-[#C8FF34]">
              <ShieldCheck className="h-4 w-4" /> Full access enabled
            </p>
          </div>

          <div className="mt-7 space-y-2 text-base">
            <button onClick={() => setActiveSection('overview')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'overview' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>Overview</button>
            <button onClick={() => setActiveSection('users')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'users' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>User Management</button>
            <button onClick={() => setActiveSection('reports')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'reports' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>Reports</button>
            <button onClick={() => setActiveSection('settings')} className={`w-full rounded-xl px-4 py-3 text-left transition ${activeSection === 'settings' ? 'bg-white/14 font-semibold' : 'text-white/75 hover:bg-white/10'}`}>Settings</button>
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
          <article className="relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-r from-[#131c17]/95 to-[#101612]/95 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#C8FF34]">Admin Workspace</p>
            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              {activeSection === 'overview'
                ? 'Admin Control Center'
                : activeSection === 'users'
                  ? 'Manage Users and Roles'
                  : activeSection === 'reports'
                    ? 'Operations Reports'
                    : 'Platform Settings'}
            </h1>
            <p className="mt-3 text-base text-white/72 md:text-lg">
              {activeSection === 'overview'
                ? 'Monitor intern operations, assignments, and program health in one place.'
                : activeSection === 'users'
                  ? 'Assign intern/admin access and monitor account activity.'
                  : activeSection === 'reports'
                    ? 'Track completion, quality, and delivery outcomes.'
                    : 'Configure role policy, access rules, and workflow preferences.'}
            </p>
          </article>

          {activeSection === 'overview' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Active Interns</p>
                <p className="mt-2 text-4xl font-black text-[#C8FF34]">42</p>
              </article>
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Admins</p>
                <p className="mt-2 text-4xl font-black">4</p>
              </article>
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Open Reports</p>
                <p className="mt-2 text-4xl font-black">9</p>
              </article>
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-white/60">Alerts</p>
                <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-[#C8FF34]"><Bell className="h-5 w-5" /> 3 New</p>
              </article>
            </div>
          )}

          {activeSection === 'users' && (
            <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="inline-flex items-center gap-2 text-xl font-bold"><Users className="h-5 w-5 text-[#C8FF34]" /> User Management</h2>
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold transition hover:bg-white/10">
                  <UserPlus className="h-4 w-4" /> Add User
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-white/70">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Role</th>
                      <th className="px-4 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-white/10">
                      <td className="px-4 py-3">{userEmail}</td>
                      <td className="px-4 py-3 text-[#C8FF34]">admin</td>
                      <td className="px-4 py-3">Active</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="px-4 py-3">intern1@lifewood.com</td>
                      <td className="px-4 py-3">intern</td>
                      <td className="px-4 py-3">Active</td>
                    </tr>
                    <tr className="border-t border-white/10">
                      <td className="px-4 py-3">intern2@lifewood.com</td>
                      <td className="px-4 py-3">intern</td>
                      <td className="px-4 py-3">Invited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </article>
          )}

          {activeSection === 'reports' && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8FF34]"><BarChart3 className="h-4 w-4" /> Productivity</p>
                <p className="mt-2 text-sm text-white/70">Intern completion rate is up by 8% this week.</p>
              </article>
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8FF34]"><FileText className="h-4 w-4" /> QA Output</p>
                <p className="mt-2 text-sm text-white/70">92% report quality score across active projects.</p>
              </article>
              <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#C8FF34]"><Briefcase className="h-4 w-4" /> Program Health</p>
                <p className="mt-2 text-sm text-white/70">All internship tracks are on schedule this month.</p>
              </article>
            </div>
          )}

          {activeSection === 'settings' && (
            <article className="rounded-2xl border border-white/12 bg-[#101612]/94 p-6">
              <h2 className="inline-flex items-center gap-2 text-xl font-bold"><Settings className="h-5 w-5 text-[#C8FF34]" /> Access Configuration</h2>
              <div className="mt-5 space-y-3 text-sm text-white/80">
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">Role Model</p>
                  <p className="mt-1">Supported roles: <span className="text-[#C8FF34]">admin</span>, <span className="text-[#C8FF34]">intern</span></p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                  <p className="font-semibold text-white">Next Step</p>
                  <p className="mt-1">Connect this panel to Supabase role updates and invite flows.</p>
                </div>
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
