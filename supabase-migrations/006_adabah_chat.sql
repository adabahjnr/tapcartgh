-- Adabah AI chat: threads + messages for two bots (matchmaker, assistant)

create table if not exists public.adabah_threads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bot text not null check (bot in ('matchmaker','assistant')),
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists adabah_threads_user_bot_idx
  on public.adabah_threads(user_id, bot, updated_at desc);

create table if not exists public.adabah_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.adabah_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant','system')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists adabah_messages_thread_idx
  on public.adabah_messages(thread_id, created_at);

grant select, insert, update, delete on public.adabah_threads to authenticated;
grant select, insert, update, delete on public.adabah_messages to authenticated;
grant all on public.adabah_threads to service_role;
grant all on public.adabah_messages to service_role;

alter table public.adabah_threads enable row level security;
alter table public.adabah_messages enable row level security;

drop policy if exists "own threads" on public.adabah_threads;
create policy "own threads" on public.adabah_threads
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "own messages" on public.adabah_messages;
create policy "own messages" on public.adabah_messages
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
