-- Brain 2.0 initial schema with strict tenant isolation

create extension if not exists "pgcrypto";

create table if not exists public.business (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.container (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.lead (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  full_name text,
  phone text,
  source text,
  status text not null default 'NEW',
  created_at timestamptz not null default now()
);

create table if not exists public.sub_account (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  user_id uuid,
  username text not null,
  role text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.finance_entry (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  kind text not null check (kind in ('income','expense')),
  amount numeric(12,2) not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.embeddings (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  source text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.hiring_record (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  candidate_name text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.job_opening (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  title text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.conversation (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  channel text not null,
  external_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.business(id) on delete cascade,
  conversation_id uuid not null references public.conversation(id) on delete cascade,
  sender text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_container_business on public.container(business_id);
create index if not exists idx_lead_business_status on public.lead(business_id, status);
create index if not exists idx_sub_account_business_role on public.sub_account(business_id, role);
create index if not exists idx_finance_business_kind on public.finance_entry(business_id, kind);
create index if not exists idx_embeddings_business on public.embeddings(business_id);
create index if not exists idx_hiring_business on public.hiring_record(business_id);
create index if not exists idx_job_business_status on public.job_opening(business_id, status);
create index if not exists idx_conversation_business_channel on public.conversation(business_id, channel);
create index if not exists idx_chat_log_business_conversation on public.chat_log(business_id, conversation_id);

alter table public.business enable row level security;
alter table public.container enable row level security;
alter table public.lead enable row level security;
alter table public.sub_account enable row level security;
alter table public.finance_entry enable row level security;
alter table public.embeddings enable row level security;
alter table public.hiring_record enable row level security;
alter table public.job_opening enable row level security;
alter table public.conversation enable row level security;
alter table public.chat_log enable row level security;

-- helper: current business from JWT claim `business_id`
create or replace function public.current_business_id()
returns uuid
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'business_id', '')::uuid;
$$;

create policy business_isolation_business on public.business
for all
using (id = public.current_business_id())
with check (id = public.current_business_id());

create policy business_isolation_container on public.container
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_lead on public.lead
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_sub_account on public.sub_account
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_finance_entry on public.finance_entry
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_embeddings on public.embeddings
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_hiring_record on public.hiring_record
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_job_opening on public.job_opening
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_conversation on public.conversation
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());

create policy business_isolation_chat_log on public.chat_log
for all
using (business_id = public.current_business_id())
with check (business_id = public.current_business_id());
