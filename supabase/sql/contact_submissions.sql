-- Contact form submissions (from Contact Us page)
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Anyone (anon or authenticated) can submit a message
drop policy if exists "public insert contact submissions" on public.contact_submissions;
create policy "public insert contact submissions"
on public.contact_submissions
for insert
to anon, authenticated
with check (true);

-- Only admins can read and update (e.g. mark as read)
drop policy if exists "admin read contact submissions" on public.contact_submissions;
create policy "admin read contact submissions"
on public.contact_submissions
for select
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "admin update contact submissions" on public.contact_submissions;
create policy "admin update contact submissions"
on public.contact_submissions
for update
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
)
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
