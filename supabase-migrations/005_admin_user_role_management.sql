-- Allow admins to manage user_roles directly (assign/revoke owner role, etc.)

drop policy if exists "Admins read all user_roles" on public.user_roles;
create policy "Admins read all user_roles"
  on public.user_roles for select to authenticated
  using (public.has_role(auth.uid(), 'admin') or user_id = auth.uid());

drop policy if exists "Admins insert user_roles" on public.user_roles;
create policy "Admins insert user_roles"
  on public.user_roles for insert to authenticated
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins delete user_roles" on public.user_roles;
create policy "Admins delete user_roles"
  on public.user_roles for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));
