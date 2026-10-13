-- Fixes Supabase Security Advisor warnings. Safe to run more than once.

-- 0025 public_bucket_allows_listing:
-- a public bucket serves files by URL without a SELECT policy; this policy only let anyone list every file.
drop policy if exists "media public read" on storage.objects;

-- 0028 / 0029 security_definer_function_executable:
-- is_admin() only checks the caller's own row, so it can run with the caller's rights (SECURITY INVOKER).
-- That requires admins' own read policy not to call is_admin() (would recurse); the admin list is
-- managed from the SQL Editor, so the "admins manage" policy is dropped as well.
drop policy if exists "admins manage" on public.admins;
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins for select using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;
