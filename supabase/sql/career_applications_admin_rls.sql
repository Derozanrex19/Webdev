-- Run after career_applications.sql: restrict read/update to admins only

drop policy if exists "authenticated read career applications" on public.career_applications;

create policy "admin read career applications"
on public.career_applications
for select
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

create policy "admin update career applications"
on public.career_applications
for update
to authenticated
using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
)
with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Storage: only admins can read career-documents (for resume download)
drop policy if exists "authenticated read career documents" on storage.objects;

create policy "admin read career documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'career-documents'
  and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);
