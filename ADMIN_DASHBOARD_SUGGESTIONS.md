# Admin Dashboard – What to Build (Suggestions)

Suggestions for the Lifewood admin dashboard based on the current system: career applications, contact form, auth, and public site.

---

## 1. Data you already have

| Source | What it is | Use in admin |
|--------|------------|--------------|
| **`career_applications`** | Applications from the Careers Apply form (name, email, position, country, resume path, status, `created_at`) | List, filter, view detail, download resume, update status |
| **Supabase Storage `career-documents`** | Uploaded PDF resumes per application | “Download resume” link using signed or public URL |
| **`profiles`** | User accounts (id, role, full_name, etc.) | List admins/interns if you keep roles; optional “who has access” |

---

## 2. Data to add for “Contact Us”

The Contact page form currently does **not** save to the database. To show contact messages in the admin dashboard:

- **Create table** `contact_submissions` (e.g. `id`, `first_name`, `last_name`, `email`, `message`, `created_at`).
- **Add RLS**: allow `anon`/`authenticated` to `insert`; allow `authenticated` (or only admin via a small function) to `select`.
- **Wire the Contact form** to `supabase.from('contact_submissions').insert(...)` on submit and show success/error.

Then the admin dashboard can list and read contact messages in an “Inbox” or “Contact messages” section.

---

## 3. Suggested admin dashboard sections

### A. Overview (home of the dashboard)

- **Stats cards (real counts):**
  - Career applications: total and “new” (e.g. status = `submitted` or last 7 days).
  - Contact messages: total and unread (if you add an `read` flag) or “last 7 days”.
- **Recent activity:** Last 5–10 career applications and/or last 5 contact submissions (name, date, one-line preview), with links to the relevant section.
- **Quick links:** “View all applications”, “View all messages”.

Uses: `career_applications` (count, order by `created_at`), `contact_submissions` (same) when you add it.

---

### B. Career applications (core)

- **Table (or card list):**  
  Columns: Applicant name, Email, Position, Country, Status, Date applied. Optional: Phone.
- **Filters:**  
  By status (e.g. submitted / reviewed / contacted / rejected), by date range, by position.
- **Search:**  
  By name or email.
- **Row click or “View”:**  
  Detail view with all fields (name, email, phone, position, country, address, resume file name, status, created_at).
- **Actions:**
  - **Download resume:** Use `resume_path` and storage bucket `career-documents` to generate a signed URL and open/download.
  - **Update status:** Dropdown or buttons to set status (e.g. `submitted` → `reviewed` → `contacted` → `rejected`). Persist with `supabase.from('career_applications').update({ status }).eq('id', id)`.
- **Optional:** “Mark as reviewed” in bulk; export to CSV.

Fully driven by `career_applications` + storage; no mock data.

---

### C. Contact messages (inbox)

- **Table or list:**  
  Sender name, email, date, short message preview (e.g. first 60 chars), optional “read” indicator.
- **Filters:**  
  Unread / read (if you add a `read` column), date range.
- **Click row:**  
  Full message, full name, email, “How can we help?” text, date. Optional: “Mark as read”, “Reply” (opens mailto or your email client).

Requires adding `contact_submissions` and wiring the Contact form as above.

---

### D. Access / team (optional)

- **Who can log in:**  
  List users from `profiles` (and optionally auth) who have access: email, role (admin vs intern if you still use it), last sign-in if you store it.
- **Admin-only:**  
  Only show this section (or only allow access to dashboard) when `profiles.role = 'admin'`. If you drop “intern” entirely, this can be “Admins” and used to see who has dashboard access.

Lightweight: one table read from `profiles`; no need for full user management in v1.

---

### E. Settings (optional, later)

- **Profile for current admin:**  
  Name, email (display only), change password (Supabase auth), or “Send password reset”.
- **Dashboard preferences:**  
  e.g. default date range, items per page (if you add pagination).

Can start as a simple “Logged in as …” and Logout; expand later.

---

## 4. Access control (recommended)

- **Only admins see the dashboard:**  
  When user opens `#internal`, if not logged in → redirect to `#login`. If logged in and `profiles.role !== 'admin'` → redirect to `#home` (or show “Access denied”). Only `role === 'admin'` see the dashboard.
- **RLS:**  
  Keep `career_applications` and (when added) `contact_submissions` readable only by `authenticated` (or restrict in a policy to admins via a small helper). Resumes in storage: only authenticated (or admin) can read; applicants only need insert for their own upload.

This matches “admin-only POV” and keeps career and contact data directed to the admin dashboard.

---

## 5. UX flow summary

| User action on site | Where it goes | What admin sees |
|---------------------|---------------|------------------|
| Submits Careers application | `career_applications` + storage | Dashboard → Career applications list + detail + resume download + status update |
| Submits Contact form | `contact_submissions` (after you add table + form) | Dashboard → Contact messages list + detail |
| Admin logs in | Auth + `profiles.role` | Only if admin → dashboard (Overview, Career applications, Contact messages, optional Access/Settings) |

---

## 6. Build order suggestion

1. **Access:** Restrict `#internal` to `role === 'admin'`; others redirect. Remove or repurpose intern dashboard.
2. **Career applications:** New admin dashboard with real data from `career_applications`, list + detail + resume download + status update.
3. **Contact:** Add `contact_submissions` table + RLS, wire Contact form to insert, then add “Contact messages” section in admin with list + detail.
4. **Overview:** Add Overview section with real counts and recent activity from applications (and contact once table exists).
5. **Optional:** Access/team (list admins from `profiles`), Settings (profile/logout, maybe password reset).

If you tell me your priority (e.g. “career applications first” or “overview + applications + contact together”), I can outline the exact components and Supabase calls next (or implement the dashboard structure and career-app section step by step).
