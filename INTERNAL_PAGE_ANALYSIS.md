# Internal Page – Analysis

Overview of the internal (authenticated) experience: routing, **Internal Dashboard** (intern), **Admin Dashboard**, auth, data, and suggested improvements.

---

## 1. Access & routing

- **URL:** `#internal` (hash routing).
- **Auth:** Supabase Auth. If not logged in and user hits `#internal`, they are redirected to `#login`.
- **Role:** After login, `profiles.role` is read (via Supabase). Only two values are used: **`admin`** → Admin Dashboard, anything else → **Internal Dashboard** (intern).
- **Layout:** No main site Navbar/Footer on the internal page. App shell uses `bg-[#0a0f0d]` when `currentPage === Page.INTERNAL`.

---

## 2. Internal Dashboard (intern)

**File:** `components/InternalDashboard.tsx`  
**Props:** `userEmail`, `onLogout`, `onGoHome`.

### Structure

- **Background:** Full-bleed Balatro (animated gradient) + radial overlays. Green/lime (`#C8FF34`), Castleton (`#046241`), dark base.
- **Layout:** Two-column grid (sidebar ~4/12, main ~8/9). Responsive: stacks on small screens.

### Sidebar (left)

- **Profile block:** Avatar image, `fullName`, `userEmail`. Name/avatar come from `profiles` (or auth `user_metadata` fallback).
- **Nav:** Three sections – **Dashboard**, **Lessons**, **Reports** (local state `activeSection`).
- **Summary cards:** “3 active modules, next in 2h” and “2 pending reviews this week” (static copy).
- **Actions:** Logout, Home (navigate to `#home`).

### Main content (by section)

**Dashboard**

- Hero: “Welcome back, {fullName}” / “Internal Workspace”.
- **Metrics:** Completion 98%, Weekly Goals 04, Alerts “1 New Update” (hardcoded).
- **Profile card:** Large cover image (avatar), “Edit Profile” button, name + school + school logo. Clicking Edit opens profile modal.
- **Activity:** “Quiz Score: React Hooks”, “Productivity Streak”, “Optimization Bonus”, “Profile Sync Complete” (static list).

**Lessons**

- **Tracks:** Two learning tracks (Web Development, LLM Prompt Engineering), each with 5 modules. Data in `lessonTracks` (title, description, image, modules with objective/content/task/duration).
- **Active course:** Selected track; module list on the left, current lesson detail (objective, content, hands-on task) on the right.
- “Next class in 02:10:25” is static.

**Reports**

- **Performance timeline:** Three bars – Code Quality 92%, Prompt Reliability 87%, Delivery Speed 90% (hardcoded). “Bonus unlocked – top 8%” message.
- **Latest reports:** “Weekly Internship Health”, “Prompt Accuracy Summary”, “Frontend Delivery Metrics” with “Updated X ago” (static).

### Profile modal

- **Avatar:** Crop UI (drag to reposition, zoom slider). Upload via file input or drag-and-drop. Cropped result is drawn to canvas, converted to JPEG, then:
  - Uploaded to Supabase Storage bucket **`avatars`** at `{userId}/avatar.jpg` (upsert).
  - Public URL saved to `profiles.avatar_url` and `user_metadata.avatar_url`.
- **Profile fields:** Full name, School (dropdown of Cebu universities). Saved to `profiles` (upsert on `id`) and `auth.updateUser({ data: { display_name, full_name, school, avatar_url } })`.
- **Default avatar:** `profileImage` state initializes to `'/profile-default.jpg'`. If that file is missing in `public/`, the img can 404.

### Data & Supabase

- **Read:** On mount, `supabase.auth.getUser()` and `supabase.from('profiles').select('full_name, school, avatar_url').eq('id', user.id).maybeSingle()`.
- **Write:** Profile save uses `profiles` upsert and `avatars` storage upload. Assumes RLS/policies allow the authenticated user to update their own row and upload to their path.

### Animations

- Inline `<style>`: `fadeUp`, `panelRise`, `growBar` keyframes. Panels use `animation: panelRise 560ms ease …` with staggered delays; lesson cards use `fadeUp`; report bars use `growBar`.

### Branding

- Uses lime `#C8FF34` and Castleton `#046241` heavily. Not from the main Lifewood palette (Paper, Saffaron, Dark Serpent) but consistent with an “internal/tech” look. Sidebar and cards use dark glass (`bg-[#0d1512]/92`, `border-white/12`).

---

## 3. Admin Dashboard

**File:** `components/AdminDashboard.tsx`  
**Props:** `userEmail`, `onLogout`, `onGoHome`.

- **Layout:** Same visual system as Internal Dashboard (Balatro background, same grid, same sidebar pattern).
- **Sections:** Overview, User Management, Reports, Settings (local state).
- **Overview:** Four stat cards – Active Interns 42, Admins 4, Open Reports 9, Alerts 3 (all hardcoded).
- **User Management:** Table with Email, Role, Status. Rows are static (current user + `intern1@lifewood.com`, `intern2@lifewood.com`). “Add User” button has no handler.
- **Reports:** Three cards with short descriptive text (productivity, QA, program health) – static.
- **Settings:** “Role Model” (admin/intern) and “Next Step” (connect to Supabase role updates and invite flows) – placeholder copy.
- **No Supabase reads/writes** for users or reports; everything is mock.

---

## 4. Gaps & recommendations

| Area | Current state | Recommendation |
|------|----------------|----------------|
| **Profile default image** | `profileImage` defaults to `/profile-default.jpg`. | Add a real `public/profile-default.jpg` or use a data URI / placeholder avatar so the sidebar never 404s. |
| **Dashboard metrics** | Completion, goals, alerts are hardcoded. | Back with real data (e.g. a `user_progress` or `intern_metrics` table, or aggregates from lessons/reports). |
| **Lessons** | Tracks and modules are static. No progress, no “completed” state. | Store progress in DB (e.g. `lesson_progress`), drive “Completion” and “Next” from it; optionally drive lesson content from CMS/DB. |
| **Reports** | Timeline and “Latest Reports” are static. | Source from real reports/tasks (e.g. from Supabase), or add a simple reports table and list by user. |
| **Admin – users** | Table is static; “Add User” does nothing. | Fetch users from `profiles` (and auth if needed); implement invite flow and role update (e.g. `profiles.role`). |
| **Admin – overview** | Counts are hardcoded. | Query `profiles` (role counts), reports/applications tables for real “Active Interns”, “Open Reports”, etc. |
| **Duplicate file** | `InternalDashboard.tsx` exists in project root and in `components/`. | Prefer a single source: use `components/InternalDashboard.tsx` and remove the root duplicate if it’s redundant. |
| **Lifewood branding** | Internal uses lime/dark more than Saffaron/Paper. | Optional: add small accents (e.g. Saffaron for primary actions) to align with main site while keeping the internal “workspace” look. |

---

## 5. Quick reference

- **Intern view:** Dashboard (welcome + profile + activity), Lessons (tracks + module detail), Reports (performance bars + report list). Profile edit: avatar crop + upload to `avatars`, name/school to `profiles` + auth metadata.
- **Admin view:** Overview (stat cards), User Management (static table), Reports (static cards), Settings (placeholder). No real user/report data yet.
- **Auth:** Supabase Auth + `profiles.role`. Navbar shows “Dashboard” and links to `#internal`; App hides Navbar/Footer when on `#internal`.

If you tell me which part you want to change first (e.g. real metrics, profile default image, or Admin user list), I can outline concrete code changes next.
