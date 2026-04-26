create table if not exists waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text not null default 'landing_page',
  created_at  timestamptz not null default now()
);

-- Only the service role can read/write waitlist rows.
-- Anon users cannot enumerate signups.
alter table waitlist enable row level security;

create policy "service_role_all" on waitlist
  for all
  to service_role
  using (true)
  with check (true);

-- Index for fast duplicate-check on email (unique constraint already covers this,
-- but an explicit index makes EXPLAIN output cleaner).
create index if not exists waitlist_email_idx on waitlist (email);
