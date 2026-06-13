-- ============================================================
-- HostelHub: 004 — fix signup trigger + site settings (hero bg)
-- Run this in your Supabase SQL editor AFTER 001, 002, 003.
-- ============================================================

-- ---------- FIX: resilient handle_new_user trigger ----------
-- The previous version could raise an exception (e.g. profiles row
-- already exists from a partial signup, or auth metadata is null),
-- which causes Supabase to return "Database error saving new user".
-- We wrap the profile creation in an EXCEPTION block so a profile
-- insert failure never blocks user creation.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  begin
    insert into public.profiles (id, full_name, phone)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      coalesce(new.raw_user_meta_data->>'phone', '')
    )
    on conflict (id) do nothing;
  exception when others then
    -- swallow errors so auth signup always succeeds
    raise warning 'handle_new_user: could not create profile for %: %', new.id, sqlerrm;
  end;
  return new;
end;
$$;

-- Make sure trigger is bound (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- SITE SETTINGS (key/value, admin-managed) ----------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);

grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant all on public.site_settings to service_role;

alter table public.site_settings enable row level security;

drop policy if exists "Site settings are publicly readable" on public.site_settings;
create policy "Site settings are publicly readable"
  on public.site_settings for select using (true);

drop policy if exists "Admins manage site settings" on public.site_settings;
create policy "Admins manage site settings"
  on public.site_settings for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Seed the hero appearance row
insert into public.site_settings (key, value)
values ('hero', jsonb_build_object('image_url', null, 'dim', 0.4))
on conflict (key) do nothing;

-- ---------- STORAGE BUCKET FOR SITE ASSETS ----------
insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Site assets are publicly readable" on storage.objects;
create policy "Site assets are publicly readable"
  on storage.objects for select
  using (bucket_id = 'site-assets');

drop policy if exists "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins update site assets" on storage.objects;
create policy "Admins update site assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins delete site assets" on storage.objects;
create policy "Admins delete site assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-assets' and public.has_role(auth.uid(), 'admin'));
