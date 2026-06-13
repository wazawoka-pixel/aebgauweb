-- Run this in Supabase SQL editor

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  api_tokens integer not null default 0,
  plan text not null default 'free',
  created_at timestamptz not null default now()
);

create index if not exists users_email_idx on users (email);
