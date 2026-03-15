# Admin dashboard – Supabase setup

Run these in the **Supabase Dashboard → SQL Editor** (in order):

1. **Contact submissions table**  
   Run the entire contents of `sql/contact_submissions.sql`.  
   This creates the `contact_submissions` table and RLS so the Contact Us form can insert and only admins can read/update.

2. **Career applications – admin-only read/update**  
   Run the entire contents of `sql/career_applications_admin_rls.sql`.  
   This replaces the previous “any authenticated user can read” policy with **admin-only** read and update for `career_applications`, and admin-only read for the `career-documents` storage bucket (so only admins can generate resume download links).

After that, the admin dashboard will work: career applications and contact messages will load for admin users, and resume download will work for admins.
