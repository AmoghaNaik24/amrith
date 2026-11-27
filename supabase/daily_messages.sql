-- AMRITH shared daily morning messages
-- Replace AMOGHA_AUTH_EMAIL with the exact email used by Amogha in Supabase Authentication.
create table if not exists public.daily_messages (
  message_date date not null,
  period text not null default 'morning' check (period = 'morning'),
  content text not null default '',
  is_published boolean not null default false,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now(),
  primary key (message_date, period)
);
alter table public.daily_messages enable row level security;
create or replace function public.amrith_is_admin()
returns boolean
language sql stable
as $$
  select lower(coalesce(auth.jwt()->>'email','')) = lower('AMOGHA_AUTH_EMAIL')
$$;
drop policy if exists "Authenticated users read published morning notes" on public.daily_messages;
create policy "Authenticated users read published morning notes"
on public.daily_messages for select to authenticated
using (is_published = true or public.amrith_is_admin());
drop policy if exists "Only Amogha manages morning notes" on public.daily_messages;
create policy "Only Amogha manages morning notes"
on public.daily_messages for all to authenticated
using (public.amrith_is_admin())
with check (public.amrith_is_admin());
