-- =====================================================
-- Tabela: book_favorites
-- =====================================================

create table if not exists public.book_favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  title text not null,
  authors text[] default '{}',
  description text,
  published_date text,
  publisher text,
  thumbnail text,
  info_url text,
  read_url text,
  buy_url text,
  pdf_url text,
  notes text default '',
  rating smallint default 0 check (rating >= 0 and rating <= 5),
  tags text[] default '{}',
  created_at timestamptz default now(),
  unique(user_id, book_id)
);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

alter table public.book_favorites enable row level security;

create policy "Users can view own favorites"
  on public.book_favorites
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own favorites"
  on public.book_favorites
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own favorites"
  on public.book_favorites
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own favorites"
  on public.book_favorites
  for delete
  using (auth.uid() = user_id);

-- =====================================================
-- Índices para performance
-- =====================================================

create index if not exists idx_book_favorites_user_id
  on public.book_favorites(user_id);

create index if not exists idx_book_favorites_user_book
  on public.book_favorites(user_id, book_id);
