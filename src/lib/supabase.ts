import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────
// SUPABASE SETUP SQL
// Run this once in your Supabase SQL editor
// ─────────────────────────────────────────────
export const SETUP_SQL = `
create table if not exists attestations (
  id uuid primary key default gen_random_uuid(),
  subject_wallet text not null,
  attester_wallet text not null,
  attester_handle text,
  attester_fairscore numeric,
  vouch_weight integer not null default 0,
  reason_code text not null,
  revoked boolean not null default false,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists attestations_subject_wallet_idx on attestations(subject_wallet);
create index if not exists attestations_attester_wallet_idx on attestations(attester_wallet);

-- Row level security: anyone can read, authenticated users can insert/update their own
alter table attestations enable row level security;

create policy "Anyone can view attestations"
  on attestations for select using (true);

create policy "Anyone can add attestations"
  on attestations for insert with check (true);

create policy "Attester can revoke their own vouch"
  on attestations for update
  using (attester_wallet = current_setting('app.current_wallet', true));
`;
