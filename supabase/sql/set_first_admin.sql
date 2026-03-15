-- One-time setup: set first admin (bypasses prevent_non_admin_role_change trigger)
-- Replace 'admin@lifewood.com' with the email you used in Authentication → Users.

-- 1) Disable only the role-change trigger (not system triggers)
do $$
declare
  trg name;
begin
  select t.tgname into trg
  from pg_trigger t
  join pg_proc p on t.tgfoid = p.oid
  where t.tgrelid = 'public.profiles'::regclass
    and p.proname = 'prevent_non_admin_role_change'
  limit 1;
  if trg is not null then
    execute format('alter table public.profiles disable trigger %I', trg);
  end if;
end $$;

-- 2) Insert or update the profile to role = 'admin'
insert into public.profiles (id, role)
select id, 'admin' from auth.users where email = 'admin@lifewood.com'
on conflict (id) do update set role = 'admin';

-- 3) Re-enable the role-change trigger
do $$
declare
  trg name;
begin
  select t.tgname into trg
  from pg_trigger t
  join pg_proc p on t.tgfoid = p.oid
  where t.tgrelid = 'public.profiles'::regclass
    and p.proname = 'prevent_non_admin_role_change'
  limit 1;
  if trg is not null then
    execute format('alter table public.profiles enable trigger %I', trg);
  end if;
end $$;
