# FairScale Trust Profile

Turns any Solana wallet into a human-readable trust verdict. Built to match the FairScale Credit Engine design language.

---

## Environment variables

You need exactly **5** variables. Add them in Vercel → your project → Settings → Environment Variables.

| Variable | Value |
|---|---|
| `FAIRSCALE_API_KEY` | Your FairScale API key |
| `NEXT_PUBLIC_FAIRSCALE_API_URL` | `https://api.fairscale.xyz` |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Your Privy app ID (same as Credit Engine) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://mdbarsshjmrinutavzdx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |

---

## Deploy via GitHub → Vercel

**Step 1 — Push to GitHub**

Create a new repo on GitHub (private is fine), then push this folder to it.

**Step 2 — Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) → Add New Project
2. Import your GitHub repo
3. Vercel will auto-detect Next.js — leave all build settings as default
4. Before deploying, click **Environment Variables** and add all 5 variables above
5. Click **Deploy**

That's it. No CLI needed.

**Step 3 — Supabase table (one-time)**

Go to your Supabase project → SQL Editor → New query → paste and run:

```sql
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

create index if not exists att_subject on attestations(subject_wallet);
create index if not exists att_attester on attestations(attester_wallet);

alter table attestations enable row level security;
create policy "read_all" on attestations for select using (true);
create policy "insert_all" on attestations for insert with check (true);
create policy "update_own" on attestations for update using (true);
```

---

## Project structure

```
pages/
  index.js               ← Landing page
  profile/[wallet].js    ← Trust profile page
  api/
    score.js             ← FairScale API proxy (API key stays server-side)
    attestations/
      index.js           ← GET vouches / POST new vouch
      revoke.js          ← POST revoke a vouch
lib/
  interpret.js           ← Interpretation engine (edit this to tune verdicts)
  supabase.js            ← Supabase client
styles/
  globals.css            ← FairScale design system (copied from Credit Engine)
public/
  fonts/                 ← Advercase Regular + Bold
  graphics/              ← All 9 atmospheric images
```

---

## Tuning the interpretation engine

All trust logic lives in `lib/interpret.js`. It's fully commented.

To change trust level thresholds, summary copy, badge rules, or watchout messaging — edit that one file. No other files need to change.

---

## Adding your custom domain

Vercel → your project → Settings → Domains → add `trust.fairscale.xyz` → update DNS with the CNAME Vercel provides.
