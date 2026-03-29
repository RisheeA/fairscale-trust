// ─────────────────────────────────────────────────────────────────
// FairScale Trust — Interpretation Engine v2
// Calibrated against real API response shape:
//   - features are 0–100 scores (NOT 0–1 decimals)
//   - wallet_age_score (0–100) not wallet_age_days
//   - tx_count, active_days are raw numbers
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

function deriveTrustLevel(fairscore, features, vouchCount = 0) {
  const ageScore   = features.wallet_age_score ?? 0;
  const activeDays = features.active_days      ?? 0;
  const tx         = features.tx_count         ?? 0;

  if (tx < 5) return 'Unknown';
  if (ageScore < 5 && activeDays < 7) return 'Unknown';
  if (fairscore >= 60 && ageScore >= 40 && activeDays >= 20) return 'High';
  if (fairscore >= 55 && vouchCount >= 2) return 'High';
  if (fairscore < 25) return 'Low';
  if (ageScore < 10 && tx < 20) return 'Low';
  return 'Medium';
}

function deriveConfidence(features) {
  const ageScore   = features.wallet_age_score ?? 0;
  const activeDays = features.active_days      ?? 0;
  const tx         = features.tx_count         ?? 0;
  if (ageScore >= 60 && activeDays >= 60 && tx >= 200) return 'Strong evidence';
  if (ageScore >= 25 && activeDays >= 15 && tx >= 30)  return 'Moderate evidence';
  return 'Limited evidence';
}

function deriveSummary(trustLevel, features, socialScore) {
  const ageScore   = features.wallet_age_score   ?? 0;
  const activeDays = features.active_days        ?? 0;
  const conviction = features.conviction_ratio   ?? 0;

  if (trustLevel === 'Unknown')
    return 'Insufficient onchain history to establish a reliable trust signal. This wallet has minimal recorded activity.';

  if (trustLevel === 'High') {
    const social = socialScore >= 30 ? ' Backed by strong social credibility.' : ' Onchain signals are strong.';
    const activity = activeDays >= 60 ? 'consistent activity and long-term presence' : 'solid behavioural patterns';
    return `Established wallet with ${activity} across Solana.${social}`;
  }

  if (trustLevel === 'Low') {
    if (ageScore < 15) return 'New or lightly-used wallet with insufficient history to form a reliable trust judgement.';
    return 'Below-average onchain signals. Seek additional validation before transacting.';
  }

  const socialStr = socialScore >= 30 ? 'Some social credibility present.' : 'Limited social validation.';
  const activityStr = conviction >= 40 ? 'Shows token conviction and portfolio discipline.' : 'Mixed behavioural signals.';
  return `Wallet shows moderate onchain activity with a mixed evidence base. ${activityStr} ${socialStr}`;
}

function deriveReasons(fairscore, features, socialScore) {
  const reasons    = [];
  const ageScore   = features.wallet_age_score     ?? 0;
  const activeDays = features.active_days          ?? 0;
  const tx         = features.tx_count             ?? 0;
  const lst        = features.lst_percentile_score  ?? 0;
  const major      = features.major_percentile_score ?? 0;
  const conviction = features.conviction_ratio     ?? 0;
  const diversity  = features.platform_diversity   ?? 0;
  const noDumps    = features.no_instant_dumps     ?? 0;
  const burst      = features.burst_ratio          ?? 0;

  if (ageScore >= 70)       reasons.push('Long-established wallet with a proven multi-year presence on Solana');
  else if (ageScore >= 40)  reasons.push('Wallet has meaningful age — building a credible onchain history');
  else if (ageScore >= 15)  reasons.push('Relatively young wallet — history is still developing');
  else                       reasons.push('New or lightly-aged wallet — limited historical track record');

  if (tx >= 500)            reasons.push(`High transaction volume (${tx.toLocaleString()} transactions) — strong engagement`);
  else if (tx >= 100)       reasons.push(`Solid transaction history with ${tx.toLocaleString()} recorded transactions`);
  else if (tx >= 20)        reasons.push(`${tx} transactions recorded — moderate activity level`);
  else                       reasons.push(`Very low transaction count (${tx}) — thin evidence base`);

  if (activeDays >= 100)    reasons.push(`Active across ${activeDays} days — sustained, consistent usage`);
  else if (activeDays >= 20) reasons.push(`${activeDays} active days showing usage over time`);

  if (lst >= 40)            reasons.push('Liquid staking participation — long-term ecosystem conviction');
  else if (major >= 50)     reasons.push('Strong major token holdings relative to ecosystem');
  else if (conviction >= 50) reasons.push('High conviction ratio — holds positions with discipline');

  if (diversity >= 50)      reasons.push('Uses multiple Solana protocols — broad ecosystem participant');
  else if (noDumps >= 70)   reasons.push('No instant dump behaviour detected — disciplined token management');

  if (socialScore >= 50)    reasons.push('Strong social reputation — validated by the broader ecosystem');
  else if (socialScore >= 25) reasons.push(`Moderate social score (${socialScore.toFixed(0)}) — some ecosystem recognition`);
  else                       reasons.push('Limited social validation detected');

  return reasons.slice(0, 5);
}

function deriveStrengths(features, socialScore, fairscore) {
  const s          = [];
  const ageScore   = features.wallet_age_score   ?? 0;
  const activeDays = features.active_days        ?? 0;
  const tx         = features.tx_count           ?? 0;
  const conviction = features.conviction_ratio   ?? 0;
  const diversity  = features.platform_diversity ?? 0;
  const noDumps    = features.no_instant_dumps   ?? 0;
  const lst        = features.lst_percentile_score ?? 0;

  if (ageScore >= 50)    s.push('Established wallet with proven longevity');
  if (tx >= 100)         s.push('Solid transaction history');
  if (activeDays >= 30)  s.push('Regular, sustained activity');
  if (conviction >= 50)  s.push('Strong token conviction');
  if (diversity >= 50)   s.push('Broad protocol participation');
  if (noDumps >= 70)     s.push('Disciplined token management');
  if (lst >= 40)         s.push('Liquid staking participant');
  if (socialScore >= 40) s.push('Solid social credibility');
  if (fairscore >= 60)   s.push('Above-average composite FairScore');
  return s.slice(0, 4);
}

function deriveWatchouts(features, socialScore, fairscore) {
  const w          = [];
  const ageScore   = features.wallet_age_score ?? 0;
  const activeDays = features.active_days      ?? 0;
  const tx         = features.tx_count         ?? 0;
  const burst      = features.burst_ratio      ?? 0;
  const tempoCv    = features.tempo_cv         ?? 0;

  if (ageScore < 20)    w.push('Limited wallet age — short track record');
  if (tx < 50)          w.push('Low transaction count — thin evidence base');
  if (activeDays < 15)  w.push('Sparse activity — limited usage history');
  if (socialScore < 20) w.push('No meaningful social validation detected');
  if (burst >= 80)      w.push('Bursty activity pattern — activity is clustered, not consistent');
  if (tempoCv >= 80)    w.push('Irregular transaction timing detected');
  if (fairscore < 30)   w.push('Below-average composite score vs. ecosystem');

  if (w.length === 0) {
    w.push('No significant risk signals from onchain data alone');
    w.push('Qualitative signals — vouches and known relationships — still matter');
  }
  return w.slice(0, 4);
}

function deriveBadges(features, socialScore, tier) {
  const badges     = [];
  const ageScore   = features.wallet_age_score   ?? 0;
  const activeDays = features.active_days        ?? 0;
  const tx         = features.tx_count           ?? 0;
  const conviction = features.conviction_ratio   ?? 0;
  const diversity  = features.platform_diversity ?? 0;
  const noDumps    = features.no_instant_dumps   ?? 0;
  const lst        = features.lst_percentile_score ?? 0;

  if (ageScore >= 70)      badges.push({ id:'veteran',    label:'Veteran',            desc:'Long-established wallet',                    tier:'gold' });
  else if (ageScore >= 40) badges.push({ id:'established', label:'Established',       desc:'Meaningful wallet age and history',          tier:'silver' });
  if (tx >= 200 && activeDays >= 30) badges.push({ id:'active',     label:'Active Participant', desc:'Consistent, high-volume activity',  tier:'silver' });
  if (conviction >= 60)    badges.push({ id:'conviction',  label:'Conviction',         desc:'Holds positions with discipline',            tier:'silver' });
  if (diversity >= 60)     badges.push({ id:'ecosystem',   label:'Ecosystem Native',   desc:'Broad Solana protocol participation',        tier:'silver' });
  if (noDumps >= 80)       badges.push({ id:'disciplined', label:'Disciplined',        desc:'No instant dump behaviour',                  tier:'bronze' });
  if (lst >= 40)           badges.push({ id:'liquid',      label:'Liquid Staker',      desc:'Active liquid staking participant',          tier:'bronze' });
  if (socialScore >= 40)   badges.push({ id:'social',      label:'Socially Validated', desc:'Strong ecosystem social reputation',         tier:'silver' });
  if (tier === 'platinum' || tier === 'gold') badges.push({ id:'top_tier', label:'Top Tier', desc:'Gold or Platinum FairScale tier',     tier:'gold' });

  return badges;
}

// Features are 0–100 where higher = better
// e.g. 75 = "top 25% of wallets"
export function percentileLabel(score) {
  const clamped = Math.max(0, Math.min(100, score ?? 0));
  const pct = Math.round(100 - clamped);
  if (pct <= 1)  return 'Top 1% vs. ecosystem';
  if (pct >= 99) return 'Bottom vs. ecosystem';
  return `Top ${pct}% vs. ecosystem`;
}

export function vouchBarWidth(weight) {
  return `${Math.max(8, (weight / 100) * 60)}px`;
}

export function interpretScore(data, vouchCount = 0) {
  const { wallet, fairscore_base, social_score, fairscore, tier, features, timestamp } = data;

  const trust_level = deriveTrustLevel(fairscore, features, vouchCount);
  const confidence  = deriveConfidence(features);
  const summary     = deriveSummary(trust_level, features, social_score);
  const why         = deriveReasons(fairscore, features, social_score);
  const strengths   = deriveStrengths(features, social_score, fairscore);
  const watchouts   = deriveWatchouts(features, social_score, fairscore);
  const badges      = deriveBadges(features, social_score, tier);

  return {
    wallet, fairscore, fairscore_base, social_score, tier,
    features, timestamp, trust_level, confidence,
    summary, why, strengths, watchouts, badges,
  };
}
