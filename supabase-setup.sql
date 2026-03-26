-- ============================================
-- Villanova Pet Registry — Supabase Setup v2
-- With Phone Auth + Pet Ownership
-- ============================================
-- Run this ONCE in your Supabase Dashboard → SQL Editor
-- ============================================

-- 1. Create the pets table with owner reference
create table if not exists public.pets (
  id            uuid default gen_random_uuid() primary key,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  type          text not null check (type in ('cat', 'dog')),
  name          text not null,
  breed         text not null,
  description   text,
  owner_id      uuid not null references auth.users(id) on delete cascade,
  whatsapp      text not null,
  photo_urls    text[] default '{}'::text[]
);

-- 2. Enable Row Level Security
alter table public.pets enable row level security;

-- 3. Public view — hides private fields, exposes only wa.me link
create or replace view public.pets_public as
  select
    id,
    created_at,
    type,
    name,
    breed,
    description,
    photo_urls,
    owner_id,
    'https://wa.me/' || regexp_replace(whatsapp, '[^0-9]', '', 'g') as whatsapp_link
  from public.pets
  order by created_at desc;

-- 4. RLS policies

-- Anyone logged in can read all pets
create policy "Authenticated users can read pets"
  on public.pets for select
  to authenticated
  using (true);

-- Users can only insert their own pets
create policy "Users can register their own pets"
  on public.pets for insert
  to authenticated
  with check (auth.uid() = owner_id);

-- Users can only update their own pets
create policy "Users can update their own pets"
  on public.pets for update
  to authenticated
  using (auth.uid() = owner_id);

-- Users can only delete their own pets
create policy "Users can delete their own pets"
  on public.pets for delete
  to authenticated
  using (auth.uid() = owner_id);

-- 5. Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger pets_updated_at
  before update on public.pets
  for each row execute function update_updated_at();

-- 6. Create storage bucket for pet photos
insert into storage.buckets (id, name, public)
values ('pet-photos', 'pet-photos', true)
on conflict (id) do nothing;

-- 7. Storage policies
create policy "Authenticated users can upload pet photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'pet-photos');

create policy "Anyone can view pet photos"
  on storage.objects for select
  using (bucket_id = 'pet-photos');

create policy "Users can delete their pet photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'pet-photos');

-- ============================================
-- IMPORTANT: Enable Phone Auth
-- Go to: Authentication → Providers → Phone
-- Turn it ON and configure an SMS provider
-- (Twilio recommended — free trial available)
-- ============================================
