-- The Workout Club — Supabase schema (packages replaced per spec)
create extension if not exists "pgcrypto";

create table if not exists branches (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  address text,
  phone text not null,
  map_query text,
  lat numeric, lng numeric,
  photos jsonb default '[]',
  facilities jsonb default '[]'
);

-- packages: time_slot x duration matrix, NO branch_id (same price everywhere)
drop table if exists packages cascade;
create table packages (
  id uuid primary key default gen_random_uuid(),
  time_slot text not null check (time_slot in ('full_day','morning','noon','female_hour')),
  duration_months int not null check (duration_months in (1,3,6,12)),
  original_price_tk numeric not null,
  discounted_price_tk numeric not null,
  is_offer_active boolean not null default true,
  features jsonb not null default '[]',
  label text, -- 'Best Value' | 'Most Popular' | null
  unique (time_slot, duration_months)
);

create table if not exists settings (
  key text primary key,
  value jsonb not null
);
insert into settings (key, value) values ('admission_fee_tk', '1500')
  on conflict (key) do update set value = excluded.value;

create table if not exists trainers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  specialty text,
  photo text,
  is_founder boolean default false,
  is_featured boolean default false,
  sort_order int default 100,
  modes jsonb default '["Offline"]'
);

create table if not exists memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  branch_id uuid references branches(id),
  package_id uuid references packages(id),
  time_slot text not null,
  admission_fee_paid boolean not null default false,
  starts_on date default now(),
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid references memberships(id),
  line_item text not null,      -- 'package' | 'admission_fee'
  amount_tk numeric not null,
  method text,                  -- 'bkash' | 'nagad' | 'card' | 'cash'
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid references trainers(id),
  branch_id uuid references branches(id),
  training_mode text not null default 'Offline' check (training_mode in ('Offline','Online')),
  name text not null, phone text not null, email text,
  goal text, note text,
  status text default 'new',
  created_at timestamptz default now()
);
