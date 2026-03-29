export interface FairScaleAPIResponse {
  wallet: string;
  fairscore_base: number;
  social_score: number;
  fairscore: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  badges: APIBadge[];
  actions: unknown[];
  timestamp: string;
  features: WalletFeatures;
}

export interface APIBadge {
  id: string;
  label: string;
  description: string;
  tier: string;
}

export interface WalletFeatures {
  lst_percentile_score?: number;
  major_percentile_score?: number;
  native_sol_percentile?: number;
  stable_percentile_score?: number;
  tx_count?: number;
  active_days?: number;
  median_gap_hours?: number;
  wallet_age_days?: number;
  [key: string]: number | undefined;
}

export type TrustLevel = "High" | "Medium" | "Low" | "Unknown";
export type ConfidenceLevel = "Strong evidence" | "Moderate evidence" | "Limited evidence";

export interface TrustBadge {
  id: string;
  label: string;
  description: string;
  category: "behavioural" | "social" | "identity";
  tier: "standard" | "elevated" | "premium";
}

export interface TrustProfile {
  wallet: string;
  fairscore: number;
  fairscore_base: number;
  social_score: number;
  tier: string;
  trust_level: TrustLevel;
  confidence: ConfidenceLevel;
  summary: string;
  why_this_score: string[];
  strengths: string[];
  watchouts: string[];
  badges: TrustBadge[];
  features: WalletFeatures;
  timestamp: string;
}

export interface Attestation {
  id: string;
  subject_wallet: string;
  attester_wallet: string;
  attester_handle?: string;
  attester_fairscore?: number;
  vouch_weight: number;
  reason_code: ReasonCode;
  revoked: boolean;
  revoked_at?: string;
  created_at: string;
}

export type ReasonCode =
  | "worked_with"
  | "trusted_builder"
  | "reliable_counterparty"
  | "strong_operator"
  | "known_personally";

export const REASON_LABELS: Record<ReasonCode, string> = {
  worked_with: "Worked with them",
  trusted_builder: "Trusted builder",
  reliable_counterparty: "Reliable counterparty",
  strong_operator: "Strong operator",
  known_personally: "Known personally",
};
