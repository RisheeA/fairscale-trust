import type {
  FairScaleAPIResponse,
  TrustLevel,
  ConfidenceLevel,
  TrustProfile,
  TrustBadge,
  WalletFeatures,
} from "@/types";

// ─────────────────────────────────────────────
// TRUST LEVEL
// Derived from fairscore + behavioural evidence
// ─────────────────────────────────────────────
function deriveTrustLevel(
  fairscore: number,
  features: WalletFeatures,
  vouchCount: number = 0
): TrustLevel {
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const txCount = features.tx_count ?? 0;

  // Unknown: insufficient data
  if (age < 30 || txCount < 10) return "Unknown";

  // High: strong score + established behavioural footprint
  if (fairscore >= 70 && age >= 180 && activeDays >= 60) return "High";

  // High with vouching boost
  if (fairscore >= 65 && vouchCount >= 2 && age >= 90) return "High";

  // Low: weak score or very thin history
  if (fairscore < 40) return "Low";
  if (age < 60 && txCount < 50) return "Low";

  // Medium: everything in between
  return "Medium";
}

// ─────────────────────────────────────────────
// CONFIDENCE
// How strong is the evidence base?
// ─────────────────────────────────────────────
function deriveConfidence(features: WalletFeatures): ConfidenceLevel {
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const txCount = features.tx_count ?? 0;

  if (age >= 365 && activeDays >= 90 && txCount >= 500) return "Strong evidence";
  if (age >= 90 && activeDays >= 30 && txCount >= 100) return "Moderate evidence";
  return "Limited evidence";
}

// ─────────────────────────────────────────────
// SUMMARY
// 1–2 sentence human-readable verdict
// ─────────────────────────────────────────────
function deriveSummary(
  trustLevel: TrustLevel,
  fairscore: number,
  features: WalletFeatures,
  socialScore: number
): string {
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const major = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile ?? 0;
  const hasStrongActivity = activeDays >= 90;
  const hasOnchainPresence = major > 0.7 || native > 0.7;
  const hasSocialValidation = socialScore >= 30;

  if (trustLevel === "Unknown") {
    return "Insufficient onchain history to establish a reliable trust signal. This wallet is either new or has very limited activity.";
  }

  if (trustLevel === "High") {
    const activityStr = hasStrongActivity
      ? "consistent long-term activity"
      : "strong behavioural patterns";
    const socialStr = hasSocialValidation
      ? " Backed by solid social credibility."
      : " Social validation is limited but onchain signals are strong.";
    return `Established wallet with ${activityStr} and a credible onchain footprint.${socialStr}`;
  }

  if (trustLevel === "Low") {
    if (age < 60)
      return "Very new wallet with limited history. Insufficient data to establish trust.";
    return "Thin onchain activity and low score signals. Exercise caution and seek additional validation before transacting.";
  }

  // Medium
  const positives = hasOnchainPresence ? "meaningful onchain participation" : "moderate activity";
  const caveats = hasSocialValidation
    ? "Some social credibility present."
    : "Limited social validation.";
  return `Wallet shows ${positives} with a mixed evidence base. ${caveats} Proceed with reasonable caution.`;
}

// ─────────────────────────────────────────────
// WHY THIS SCORE
// Array of plain English reasons
// ─────────────────────────────────────────────
function deriveReasons(
  fairscore: number,
  features: WalletFeatures,
  socialScore: number
): string[] {
  const reasons: string[] = [];
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const txCount = features.tx_count ?? 0;
  const major = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile ?? 0;
  const lst = features.lst_percentile_score ?? 0;
  const stable = features.stable_percentile_score ?? 0;
  const medianGap = features.median_gap_hours ?? 999;

  if (age >= 365) reasons.push(`Wallet established for over ${Math.floor(age / 365)} year${age >= 730 ? "s" : ""} — long-term presence on Solana`);
  else if (age >= 90) reasons.push(`Wallet active for ${age} days — building a credible history`);
  else if (age > 0) reasons.push(`Relatively new wallet (${age} days old) — limited track record`);

  if (txCount >= 1000) reasons.push(`High transaction volume (${txCount.toLocaleString()} transactions) — strong onchain engagement`);
  else if (txCount >= 200) reasons.push(`Solid transaction history with ${txCount.toLocaleString()} recorded transactions`);
  else if (txCount > 0) reasons.push(`Limited transaction history (${txCount} transactions) — thin evidence base`);

  if (activeDays >= 180) reasons.push(`Active across ${activeDays} days — consistent, non-bursty behaviour`);
  else if (activeDays >= 60) reasons.push(`${activeDays} active days showing regular usage patterns`);

  if (major >= 0.8) reasons.push(`Top ${Math.round((1 - major) * 100)}% for major token holdings across the ecosystem`);
  else if (major >= 0.6) reasons.push(`Above-average major token holdings vs. ecosystem`);

  if (native >= 0.75) reasons.push(`Top ${Math.round((1 - native) * 100)}% for native SOL balance — strong ecosystem conviction`);

  if (lst >= 0.7) reasons.push(`Significant liquid staking participation — long-term alignment signal`);

  if (stable >= 0.7) reasons.push(`Strong stablecoin position — measured, risk-aware portfolio`);

  if (medianGap < 48 && activeDays >= 30) reasons.push("Frequent, consistent activity — not a dormant or one-time wallet");

  if (socialScore >= 50) reasons.push("Strong social reputation score — validated by the broader ecosystem");
  else if (socialScore >= 25) reasons.push("Moderate social reputation — some ecosystem recognition");
  else reasons.push("Limited social validation — no strong ecosystem backing detected");

  return reasons.slice(0, 5);
}

// ─────────────────────────────────────────────
// STRENGTHS
// ─────────────────────────────────────────────
function deriveStrengths(features: WalletFeatures, socialScore: number, fairscore: number): string[] {
  const strengths: string[] = [];
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const txCount = features.tx_count ?? 0;
  const major = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile ?? 0;
  const lst = features.lst_percentile_score ?? 0;

  if (age >= 365) strengths.push("Long-standing wallet with proven longevity");
  if (txCount >= 500) strengths.push("High transaction volume");
  if (activeDays >= 90) strengths.push("Consistent, sustained activity");
  if (major >= 0.75) strengths.push("Strong major token holdings");
  if (native >= 0.7) strengths.push("Significant SOL conviction");
  if (lst >= 0.65) strengths.push("Active liquid staking participant");
  if (socialScore >= 40) strengths.push("Solid social credibility");
  if (fairscore >= 70) strengths.push("Top-tier composite FairScore");

  return strengths.slice(0, 4);
}

// ─────────────────────────────────────────────
// WATCHOUTS
// ─────────────────────────────────────────────
function deriveWatchouts(features: WalletFeatures, socialScore: number, fairscore: number): string[] {
  const watchouts: string[] = [];
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const txCount = features.tx_count ?? 0;
  const medianGap = features.median_gap_hours ?? 0;

  if (age < 90) watchouts.push("New wallet — limited historical track record");
  if (txCount < 100) watchouts.push("Low transaction count — thin evidence base");
  if (activeDays < 30) watchouts.push("Sparse activity — inconsistent usage patterns");
  if (socialScore < 20) watchouts.push("No meaningful social validation detected");
  if (medianGap > 168 && activeDays > 0) watchouts.push("Infrequent activity — long gaps between transactions");
  if (fairscore < 50) watchouts.push("Below-average composite score vs. ecosystem");

  if (watchouts.length === 0) {
    watchouts.push("No significant risk signals detected from onchain data alone");
    watchouts.push("Qualitative trust signals (vouches, known relationships) still matter");
  }

  return watchouts.slice(0, 4);
}

// ─────────────────────────────────────────────
// BADGES
// Fully custom — deterministic from features
// ─────────────────────────────────────────────
function deriveBadges(features: WalletFeatures, socialScore: number, tier: string): TrustBadge[] {
  const badges: TrustBadge[] = [];
  const age = features.wallet_age_days ?? 0;
  const activeDays = features.active_days ?? 0;
  const txCount = features.tx_count ?? 0;
  const medianGap = features.median_gap_hours ?? 999;
  const major = features.major_percentile_score ?? 0;
  const native = features.native_sol_percentile ?? 0;
  const lst = features.lst_percentile_score ?? 0;

  if (age >= 730) badges.push({ id: "veteran", label: "Veteran", description: "Wallet established 2+ years ago", category: "behavioural", tier: "premium" });
  else if (age >= 365) badges.push({ id: "established", label: "Established", description: "Wallet active for over a year", category: "behavioural", tier: "elevated" });

  if (txCount >= 1000 && activeDays >= 100) badges.push({ id: "high_volume", label: "High Volume", description: "Top-tier transaction activity", category: "behavioural", tier: "elevated" });

  if (medianGap < 72 && activeDays >= 60) badges.push({ id: "consistent", label: "Consistent", description: "Regular, non-bursty activity pattern", category: "behavioural", tier: "standard" });

  if (major >= 0.8 || native >= 0.8) badges.push({ id: "conviction", label: "Conviction", description: "Top-tier token holdings vs. ecosystem", category: "behavioural", tier: "elevated" });

  if (lst >= 0.7) badges.push({ id: "liquid", label: "Liquid", description: "Active liquid staking participant", category: "behavioural", tier: "standard" });

  if (socialScore >= 40) badges.push({ id: "socially_validated", label: "Socially Validated", description: "Strong ecosystem reputation score", category: "social", tier: "elevated" });

  if (tier === "platinum") badges.push({ id: "ecosystem_native", label: "Ecosystem Native", description: "Broad, deep Solana protocol participation", category: "behavioural", tier: "premium" });

  return badges;
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// Transforms raw API response into TrustProfile
// ─────────────────────────────────────────────
export function interpretScore(
  data: FairScaleAPIResponse,
  vouchCount: number = 0
): TrustProfile {
  const { wallet, fairscore, fairscore_base, social_score, tier, features, timestamp } = data;

  const trust_level = deriveTrustLevel(fairscore, features, vouchCount);
  const confidence = deriveConfidence(features);
  const summary = deriveSummary(trust_level, fairscore, features, social_score);
  const why_this_score = deriveReasons(fairscore, features, social_score);
  const strengths = deriveStrengths(features, social_score, fairscore);
  const watchouts = deriveWatchouts(features, social_score, fairscore);
  const badges = deriveBadges(features, social_score, tier);

  return {
    wallet,
    fairscore,
    fairscore_base,
    social_score,
    tier,
    trust_level,
    confidence,
    summary,
    why_this_score,
    strengths,
    watchouts,
    badges,
    features,
    timestamp,
  };
}

// ─────────────────────────────────────────────
// VOUCH WEIGHT
// How influential is a voucher?
// ─────────────────────────────────────────────
export function computeVouchWeight(voucherFairScore: number): number {
  // Normalise to 0–100 stored as integer
  return Math.round(Math.max(0, Math.min(100, voucherFairScore)));
}

// ─────────────────────────────────────────────
// PERCENTILE LABEL
// Human readable percentile string
// ─────────────────────────────────────────────
export function percentileLabel(score: number): string {
  const pct = Math.round((1 - score) * 100);
  return `Top ${pct}% vs. ecosystem`;
}

// ─────────────────────────────────────────────
// TRUST LEVEL COLOURS
// ─────────────────────────────────────────────
export const TRUST_COLOURS: Record<string, string> = {
  High: "#4ade80",
  Medium: "#fbbf24",
  Low: "#f87171",
  Unknown: "#6b7280",
};

export const TRUST_BG: Record<string, string> = {
  High: "rgba(74, 222, 128, 0.08)",
  Medium: "rgba(251, 191, 36, 0.08)",
  Low: "rgba(248, 113, 113, 0.08)",
  Unknown: "rgba(107, 114, 128, 0.08)",
};
