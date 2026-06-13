-- ============================================================
-- HostelHub: profiles + owner applications
-- Run this in your Supabase SQL editor.
-- ============================================================

-- ---------- PROFILES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  whatsapp text,
  avatar_url text,
  bio text,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

grant select, insert, update on public.profiles to authenticated;
grant select on public.profiles to anon;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any existing users that have no profile yet
insert into public.profiles (id)
select u.id from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- ---------- OWNER APPLICATIONS ----------
do $$ begin
  create type public.application_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.owner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text,
  whatsapp text not null,
  business_name text,
  message text,
  status public.application_status not null default 'pending',
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  unique (user_id)
);

grant select, insert, update on public.owner_applications to authenticated;
grant all on public.owner_applications to service_role;

alter table public.owner_applications enable row level security;

drop policy if exists "Users view own or admins view all applications" on public.owner_applications;
create policy "Users view own or admins view all applications"
  on public.owner_applications for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Users create own application" on public.owner_applications;
create policy "Users create own application"
  on public.owner_applications for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Admins update applications" on public.owner_applications;
create policy "Admins update applications"
  on public.owner_applications for update to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- On approval, automatically grant the 'owner' role
create or replace function public.handle_owner_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'approved' and (old.status is distinct from 'approved') then
    insert into public.user_roles (user_id, role)
    values (new.user_id, 'owner')
    on conflict (user_id, role) do nothing;
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists on_owner_approval on public.owner_applications;
create trigger on_owner_approval
  before update on public.owner_applications
  for each row execute function public.handle_owner_approval();
