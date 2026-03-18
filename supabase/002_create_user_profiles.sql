-- =====================================================
-- Tabela: user_profiles
-- =====================================================

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  created_at timestamptz default now()
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

alter table public.user_profiles enable row level security;

create policy "Authenticated users can view profiles"
  on public.user_profiles
  for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- =====================================================
-- Trigger: cria perfil automaticamente ao registrar
-- =====================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

-- Dispara ao inserir um novo usuário no auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
