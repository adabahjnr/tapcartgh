-- ============================================================
-- HostelHub: 007 — Waitlist signups + waitlist mode setting
-- ============================================================

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  position bigserial,
  name text not null,
  phone text not null,
  created_at timestamptz not null default now()
);

grant insert on public.waitlist_signups to anon, authenticated;
grant select on public.waitlist_signups to authenticated;
grant all on public.waitlist_signups to service_role;
grant usage, select on sequence public.waitlist_signups_position_seq to anon, authenticated;

alter table public.waitlist_signups enable row level security;

drop policy if exists "Anyone can join waitlist" on public.waitlist_signups;
create policy "Anyone can join waitlist"
  on public.waitlist_signups for insert
  with check (true);

drop policy if exists "Admins read waitlist" on public.waitlist_signups;
create policy "Admins read waitlist"
  on public.waitlist_signups for select to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins delete waitlist" on public.waitlist_signups;
create policy "Admins delete waitlist"
  on public.waitlist_signups for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Seed waitlist mode setting (off by default)
insert into public.site_settings (key, value)
values ('waitlist_mode', jsonb_build_object('enabled', false))
on conflict (key) do nothing;
