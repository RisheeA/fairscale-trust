"use client";

import { TRUST_COLOURS, TRUST_BG } from "@/lib/interpret";
import type { TrustLevel, ConfidenceLevel } from "@/types";

interface TrustVerdictProps {
  trustLevel: TrustLevel;
  confidence: ConfidenceLevel;
  summary: string;
}

const TRUST_ICONS: Record<TrustLevel, string> = {
  High: "✦",
  Medium: "◈",
  Low: "⚠",
  Unknown: "?",
};

const TRUST_DESCRIPTIONS: Record<TrustLevel, string> = {
  High: "Strong behavioural signals and credible onchain footprint",
  Medium: "Mixed signals — proceed with reasonable caution",
  Low: "Weak or insufficient evidence — exercise significant caution",
  Unknown: "Insufficient data to establish a reliable trust verdict",
};

export function TrustVerdictCard({ trustLevel, confidence, summary }: TrustVerdictProps) {
  const color = TRUST_COLOURS[trustLevel];
  const bg = TRUST_BG[trustLevel];

  return (
    <div
      className="rounded-2xl p-6 animate-fade-up delay-2"
      style={{
        background: bg,
        border: `1px solid ${color}25`,
        boxShadow: `0 0 40px ${color}08`,
      }}
    >
      <div className="flex items-start gap-5">
        {/* Icon */}
        <div
          className="shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-mono text-xl"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}30`,
            color: color,
          }}
        >
          {TRUST_ICONS[trustLevel]}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span
              className="font-advercase text-2xl"
              style={{ color: color }}
            >
              {trustLevel} Trust
            </span>
            <ConfidencePill confidence={confidence} />
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(245,240,232,0.55)" }}
          >
            {TRUST_DESCRIPTIONS[trustLevel]}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div
        className="mt-5 pt-5"
        style={{ borderTop: "1px solid rgba(245,240,232,0.06)" }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: "rgba(245,240,232,0.75)" }}
        >
          {summary}
        </p>
      </div>
    </div>
  );
}

function ConfidencePill({ confidence }: { confidence: ConfidenceLevel }) {
  const colours: Record<ConfidenceLevel, string> = {
    "Strong evidence": "#4ade80",
    "Moderate evidence": "#fbbf24",
    "Limited evidence": "#9ca3af",
  };
  const color = colours[confidence];

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full"
      style={{
        color: color,
        background: `${color}12`,
        border: `1px solid ${color}25`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full inline-block"
        style={{ background: color }}
      />
      {confidence}
    </span>
  );
}
