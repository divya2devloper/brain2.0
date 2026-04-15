-- Gym platform core schema (roles, onboarding, approvals, payouts, bookings)

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text not null,
  email text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('ADMIN', 'OWNER', 'TRAINER', 'MEMBER')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.gyms (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text not null,
  latitude numeric(10, 7) not null,
  longitude numeric(10, 7) not null,
  description text not null,
  timezone text not null default 'UTC',
  hours jsonb not null default '{}'::jsonb,
  amenities text[] not null default '{}',
  website text,
  phone text,
  logo_url text,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED')),
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gym_photos (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  file_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.gym_owner_applications (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  gym_id uuid not null references public.gyms(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED', 'MORE_INFO_REQUIRED')),
  review_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.business_verification_docs (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  business_tax_id text not null,
  vat_number text,
  license_doc_url text not null,
  id_doc_url text not null,
  proof_of_address_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.gym_trainers (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  specialization text,
  created_at timestamptz not null default now()
);

create table if not exists public.gym_classes (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  trainer_id uuid references public.gym_trainers(id) on delete set null,
  title text not null,
  description text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int not null default 20,
  created_at timestamptz not null default now()
);

create table if not exists public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  name text not null,
  billing_cycle text not null check (billing_cycle in ('MONTHLY', 'QUARTERLY', 'YEARLY')),
  price numeric(12, 2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  class_id uuid not null references public.gym_classes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  booking_status text not null default 'CONFIRMED' check (booking_status in ('CONFIRMED', 'CANCELLED', 'WAITLISTED')),
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  status text not null default 'ABSENT' check (status in ('PRESENT', 'ABSENT', 'LATE')),
  marked_at timestamptz not null default now()
);

create table if not exists public.payout_accounts (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  provider text not null default 'stripe',
  provider_account_id text not null,
  connected boolean not null default false,
  created_at timestamptz not null default now(),
  unique (gym_id, provider)
);

create table if not exists public.payout_history (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  payout_account_id uuid not null references public.payout_accounts(id) on delete cascade,
  amount numeric(12, 2) not null,
  currency text not null default 'USD',
  status text not null default 'PENDING' check (status in ('PENDING', 'PAID', 'FAILED')),
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  price_monthly numeric(12, 2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gym_subscriptions (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms(id) on delete cascade,
  plan_id uuid not null references public.subscription_plans(id) on delete restrict,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'PAST_DUE', 'CANCELLED')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid references public.gyms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'OPEN' check (status in ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  created_at timestamptz not null default now()
);

create index if not exists idx_user_roles_user on public.user_roles(user_id, role);
create index if not exists idx_gyms_owner on public.gyms(owner_user_id, status);
create index if not exists idx_gym_owner_apps_status on public.gym_owner_applications(status, created_at desc);
create index if not exists idx_gym_classes_gym_start on public.gym_classes(gym_id, starts_at);
create index if not exists idx_membership_plans_gym on public.membership_plans(gym_id, active);
create index if not exists idx_bookings_gym_user on public.bookings(gym_id, user_id);
create index if not exists idx_payout_history_gym on public.payout_history(gym_id, created_at desc);
create index if not exists idx_support_tickets_status on public.support_tickets(status, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.gyms enable row level security;
alter table public.gym_photos enable row level security;
alter table public.gym_owner_applications enable row level security;
alter table public.business_verification_docs enable row level security;
alter table public.gym_trainers enable row level security;
alter table public.gym_classes enable row level security;
alter table public.membership_plans enable row level security;
alter table public.bookings enable row level security;
alter table public.attendance enable row level security;
alter table public.payout_accounts enable row level security;
alter table public.payout_history enable row level security;
alter table public.subscription_plans enable row level security;
alter table public.gym_subscriptions enable row level security;
alter table public.support_tickets enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'role', '');
$$;

create policy own_profile_read_write on public.profiles
for all
using (id = auth.uid())
with check (id = auth.uid());

create policy own_roles_read on public.user_roles
for select
using (user_id = auth.uid() or public.current_user_role() = 'ADMIN');

create policy gyms_public_or_owner_or_admin on public.gyms
for select
using (is_public = true or owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN');

create policy gyms_owner_write on public.gyms
for all
using (owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN')
with check (owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN');

create policy gym_owner_apps_owner_or_admin on public.gym_owner_applications
for all
using (owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN')
with check (owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN');

create policy docs_owner_or_admin on public.business_verification_docs
for all
using (
  exists (
    select 1 from public.gyms g
    where g.id = gym_id and (g.owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN')
  )
)
with check (
  exists (
    select 1 from public.gyms g
    where g.id = gym_id and (g.owner_user_id = auth.uid() or public.current_user_role() = 'ADMIN')
  )
);

create policy tickets_owner_member_admin on public.support_tickets
for all
using (user_id = auth.uid() or public.current_user_role() in ('OWNER', 'ADMIN'))
with check (user_id = auth.uid() or public.current_user_role() in ('OWNER', 'ADMIN'));
