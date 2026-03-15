create extension if not exists pgcrypto;

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  gender text not null,
  age integer not null check (age >= 16 and age <= 99),
  phone_code text not null,
  phone_number text not null,
  email text not null,
  position_applied text not null,
  country text not null,
  current_address text not null,
  resume_path text not null,
  resume_file_name text not null,
  status text not null default 'submitted',
  created_at timestamptz not null default now()
);

alter table public.career_applications enable row level security;

drop policy if exists "public insert career applications" on public.career_applications;
create policy "public insert career applications"
on public.career_applications
for insert
to anon, authenticated
with check (true);

drop policy if exists "authenticated read career applications" on public.career_applications;
create policy "authenticated read career applications"
on public.career_applications
for select
to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('career-documents', 'career-documents', false)
on conflict (id) do nothing;

drop policy if exists "public upload career documents" on storage.objects;
create policy "public upload career documents"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'career-documents');

drop policy if exists "authenticated read career documents" on storage.objects;
create policy "authenticated read career documents"
on storage.objects
for select
to authenticated
using (bucket_id = 'career-documents');
