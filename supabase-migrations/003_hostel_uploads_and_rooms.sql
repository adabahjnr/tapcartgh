-- ============================================================
-- HostelHub: photo uploads, gender policy, structured room options,
--           and auto-publish for approved owners.
-- Run this in your Supabase SQL editor AFTER 001 and 002.
-- ============================================================

-- ---------- NEW COLUMNS ON HOSTELS ----------
do $$ begin
  create type public.gender_policy as enum ('boys', 'girls', 'mixed');
exception when duplicate_object then null; end $$;

alter table public.hostels
  add column if not exists gender_policy public.gender_policy not null default 'mixed';

-- Structured room options: [{ "name": "1-in-a-room", "price": 1000, "period": "year" }, ...]
alter table public.hostels
  add column if not exists room_options jsonb not null default '[]'::jsonb;

-- Auto-publish + auto-verify since the owner account itself is already vetted.
alter table public.hostels alter column is_published set default true;
alter table public.hostels alter column is_verified  set default true;

-- ---------- STORAGE BUCKET FOR HOSTEL PHOTOS ----------
insert into storage.buckets (id, name, public)
values ('hostel-photos', 'hostel-photos', true)
on conflict (id) do update set public = true;

-- Public read of hostel photos
drop policy if exists "Hostel photos are publicly readable" on storage.objects;
create policy "Hostel photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'hostel-photos');

-- Authenticated users can upload into their own folder: {user_id}/...
drop policy if exists "Owners upload hostel photos to own folder" on storage.objects;
create policy "Owners upload hostel photos to own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'hostel-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners update own hostel photos" on storage.objects;
create policy "Owners update own hostel photos"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'hostel-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners delete own hostel photos" on storage.objects;
create policy "Owners delete own hostel photos"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'hostel-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
