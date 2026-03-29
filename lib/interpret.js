// ─────────────────────────────────────────────────────────────────
// FairScale Trust — Interpretation Engine
// Transforms raw API data → human-readable trust profile
// All thresholds are editable. This is the core product logic.
// ─────────────────────────────────────────────────────────────────

export const TRUST_COLOURS = {
  High:    '#1a6640',
  Medium:  '#7a5200',
  Low:     '#7a1f1f',
  Unknown: '#5a5248',
};

export const TRUST_BG = {
  High:    'rgba(26,102,64,0.07)',
  Medium:  'rgba(122,82,0,0.07)',
  Low:     'rgba(122,31,31,0.07)',
  Unknown: 'rgba(90,82,72,0.07)',
};

export const TRUST_BORDER = {
  High:    'rgba(26,102,64,0.2)',
  Medium:  'rgba(122,82,0,0.2)',
  Low:     'rgba(122,31,31,0.2)',
  Unknown: 'rgba(90,82,72,0.2)',
};

// ── Trust level ───────────────────────────────────────────────────
function deriveTrustLevel(fairscore, features, vouchCount = 0) {
  const age    = features.wallet_age_days  ?? 0;
  const active = features.active_days      ?? 0;
  const tx     = features.tx_count         ?? 0;

  if (age < 30 || tx < 10)                              return 'Unknown';
  if (fairscore >= 70 && age >= 180 && active >= 60)    return 'High';
  if (fairscore >= 65 && vouchCount >= 2 && age >= 90)  return 'High';
  if (fairscore < 40)                                    return 'Low';
  if (age < 60 && tx < 50)                              return 'Low';
  return 'Medium';
}

// ── Evidence confidence ───────────────────────────────────────────
function deriveConfidence(features) {
  const age    = features.wallet_age_days ?? 0;
  const active = features.active_days     ?? 0;
  const tx     = features.tx_count        ?? 0;
  if (age >= 365 && active >= 90 && tx >= 500) return 'Strong evidence';
  if (age >= 90  && active >= 30 && tx >= 100) return 'Moderate evidence';
  return 'Limited evidence';
}

// ── Plain English summary ─────────────────────────────────────────
function deriveSummary(trustLevel, features, socialScore) {
  const age    = features.wallet_age_days       ?? 0;
  const active = features.active_days           ?? 0;
  const major  = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile  ?? 0;

  if (trustLevel === 'Unknown')
    return 'Insufficient onchain history to establish a reliable trust signal. This wallet is either very new or has minimal activity.';

  if (trustLevel === 'High') {
    const social = socialScore >= 30 ? ' Backed by solid social credibility.' : ' Social validation is limited but onchain signals are strong.';
    return `Established wallet with ${active >= 90 ? 'consistent long-term activity' : 'strong behavioural patterns'} and a credible onchain footprint.${social}`;
  }

  if (trustLevel === 'Low') {
    if (age < 60) return 'Very new wallet with insufficient history to form a reliable trust judgement.';
    return 'Thin onchain activity and a below-average score. Seek additional validation before transacting.';
  }

  const presence = (major > 0.7 || native > 0.7) ? 'meaningful onchain participation' : 'moderate activity';
  const social   = socialScore >= 25 ? 'Some social credibility present.' : 'Limited social validation.';
  return `Wallet shows ${presence} with a mixed evidence base. ${social} Proceed with reasonable caution.`;
}

// ── Reasons array ─────────────────────────────────────────────────
function deriveReasons(fairscore, features, socialScore) {
  const reasons = [];
  const age    = features.wallet_age_days        ?? 0;
  const active = features.active_days            ?? 0;
  const tx     = features.tx_count              ?? 0;
  const major  = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile  ?? 0;
  const lst    = features.lst_percentile_score   ?? 0;
  const stable = features.stable_percentile_score ?? 0;
  const gap    = features.median_gap_hours       ?? 999;

  if (age >= 365)      reasons.push(`Wallet established for over ${Math.floor(age/365)} year${age>=730?'s':''} — long-term presence on Solana`);
  else if (age >= 90)  reasons.push(`Wallet active for ${age} days — building a credible history`);
  else if (age > 0)    reasons.push(`Relatively new wallet (${age} days) — limited track record`);

  if (tx >= 1000)      reasons.push(`High transaction volume (${tx.toLocaleString()} transactions) — strong onchain engagement`);
  else if (tx >= 200)  reasons.push(`Solid history with ${tx.toLocaleString()} recorded transactions`);
  else if (tx > 0)     reasons.push(`Limited transaction history (${tx}) — thin evidence base`);

  if (active >= 180)   reasons.push(`Active across ${active} days — consistent, non-bursty behaviour`);
  else if (active >= 60) reasons.push(`${active} active days showing regular usage patterns`);

  if (major >= 0.8)    reasons.push(`Top ${Math.round((1-major)*100)}% for major token holdings across the ecosystem`);
  else if (major >= 0.6) reasons.push('Above-average major token holdings vs. ecosystem');

  if (native >= 0.75)  reasons.push(`Top ${Math.round((1-native)*100)}% for native SOL balance — strong conviction signal`);
  if (lst >= 0.7)      reasons.push('Significant liquid staking participation — long-term alignment signal');
  if (stable >= 0.7)   reasons.push('Strong stablecoin position — measured, risk-aware portfolio');
  if (gap < 48 && active >= 30) reasons.push('Frequent, consistent activity — not a dormant or one-time wallet');

  if (socialScore >= 50)      reasons.push('Strong social reputation score — validated by the broader ecosystem');
  else if (socialScore >= 25) reasons.push('Moderate social reputation — some ecosystem recognition');
  else                         reasons.push('Limited social validation — no strong ecosystem backing detected');

  return reasons.slice(0, 5);
}

// ── Strengths ─────────────────────────────────────────────────────
function deriveStrengths(features, socialScore, fairscore) {
  const s = [];
  const age    = features.wallet_age_days        ?? 0;
  const active = features.active_days            ?? 0;
  const tx     = features.tx_count              ?? 0;
  const major  = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile  ?? 0;
  const lst    = features.lst_percentile_score   ?? 0;

  if (age >= 365)     s.push('Long-standing wallet with proven longevity');
  if (tx >= 500)      s.push('High transaction volume');
  if (active >= 90)   s.push('Consistent, sustained activity');
  if (major >= 0.75)  s.push('Strong major token holdings');
  if (native >= 0.70) s.push('Significant SOL conviction');
  if (lst >= 0.65)    s.push('Active liquid staking participant');
  if (socialScore >= 40) s.push('Solid social credibility');
  if (fairscore >= 70)  s.push('Top-tier composite FairScore');
  return s.slice(0, 4);
}

// ── Watchouts ─────────────────────────────────────────────────────
function deriveWatchouts(features, socialScore, fairscore) {
  const w = [];
  const age    = features.wallet_age_days ?? 0;
  const active = features.active_days     ?? 0;
  const tx     = features.tx_count        ?? 0;
  const gap    = features.median_gap_hours ?? 0;

  if (age < 90)    w.push('New wallet — limited historical track record');
  if (tx < 100)    w.push('Low transaction count — thin evidence base');
  if (active < 30) w.push('Sparse activity — inconsistent usage patterns');
  if (socialScore < 20) w.push('No meaningful social validation detected');
  if (gap > 168 && active > 0) w.push('Infrequent activity — long gaps between transactions');
  if (fairscore < 50) w.push('Below-average composite score vs. ecosystem');

  if (w.length === 0) {
    w.push('No significant risk signals from onchain data alone');
    w.push('Qualitative signals — vouches, known relationships — still matter');
  }
  return w.slice(0, 4);
}

// ── Custom badges ─────────────────────────────────────────────────
function deriveBadges(features, socialScore, tier) {
  const badges = [];
  const age    = features.wallet_age_days        ?? 0;
  const active = features.active_days            ?? 0;
  const tx     = features.tx_count              ?? 0;
  const gap    = features.median_gap_hours       ?? 999;
  const major  = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile  ?? 0;
  const lst    = features.lst_percentile_score   ?? 0;

  if (age >= 730)  badges.push({ id:'veteran',    label:'Veteran',           desc:'Wallet established 2+ years ago',          tier:'gold' });
  else if (age >= 365) badges.push({ id:'established', label:'Established',  desc:'Active for over a year',                   tier:'silver' });

  if (tx >= 1000 && active >= 100) badges.push({ id:'high_volume', label:'High Volume', desc:'Top-tier transaction activity', tier:'silver' });
  if (gap < 72 && active >= 60)    badges.push({ id:'consistent',  label:'Consistent',  desc:'Regular, non-bursty patterns',  tier:'bronze' });
  if (major >= 0.8 || native >= 0.8) badges.push({ id:'conviction', label:'Conviction', desc:'Top-tier token holdings',       tier:'silver' });
  if (lst >= 0.7) badges.push({ id:'liquid', label:'Liquid', desc:'Active liquid staking participant', tier:'bronze' });
  if (socialScore >= 40) badges.push({ id:'socially_validated', label:'Socially Validated', desc:'Strong ecosystem reputation', tier:'silver' });
  if (tier === 'platinum') badges.push({ id:'ecosystem_native', label:'Ecosystem Native', desc:'Broad Solana protocol participation', tier:'gold' });

  return badges;
}

// ── Percentile label ──────────────────────────────────────────────
export function percentileLabel(score) {
  return `Top ${Math.round((1 - score) * 100)}% vs. ecosystem`;
}

// ── Vouch weight display bar width ────────────────────────────────
export function vouchBarWidth(weight) {
  return `${Math.max(8, (weight / 100) * 60)}px`;
}

// ── Main export ───────────────────────────────────────────────────
export function interpretScore(data, vouchCount = 0) {
  const { wallet, fairscore_base, social_score, fairscore, tier, features, timestamp } = data;

  const trust_level  = deriveTrustLevel(fairscore, features, vouchCount);
  const confidence   = deriveConfidence(features);
  const summary      = deriveSummary(trust_level, features, social_score);
  const why          = deriveReasons(fairscore, features, social_score);
  const strengths    = deriveStrengths(features, social_score, fairscore);
  const watchouts    = deriveWatchouts(features, social_score, fairscore);
  const badges       = deriveBadges(features, social_score, tier);

  return { wallet, fairscore, fairscore_base, social_score, tier, features, timestamp, trust_level, confidence, summary, why, strengths, watchouts, badges };
}
