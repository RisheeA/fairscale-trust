"use client";

import { useState } from "react";
import { percentileLabel } from "@/lib/interpret";
import type { WalletFeatures } from "@/types";

interface MetricsProps {
  features: WalletFeatures;
  fairscoreBase: number;
  socialScore: number;
  tier: string;
  timestamp: string;
}

export function ExpandableMetrics({ features, fairscoreBase, socialScore, tier, timestamp }: MetricsProps) {
  const [open, setOpen] = useState(false);

  const PERCENTILE_FIELDS: { key: keyof WalletFeatures; label: string }[] = [
    { key: "lst_percentile_score", label: "Liquid Staking" },
    { key: "major_percentile_score", label: "Major Tokens" },
    { key: "native_sol_percentile", label: "Native SOL" },
    { key: "stable_percentile_score", label: "Stablecoins" },
  ];

  const RAW_FIELDS: { key: keyof WalletFeatures; label: string; format: (v: number) => string }[] = [
    { key: "tx_count", label: "Total transactions", format: (v) => v.toLocaleString() },
    { key: "active_days", label: "Active days", format: (v) => `${v} days` },
    { key: "wallet_age_days", label: "Wallet age", format: (v) => `${v} days` },
    { key: "median_gap_hours", label: "Median gap between txns", format: (v) => `${v.toFixed(1)}h` },
  ];

  return (
    <div className="animate-fade-up delay-7">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left transition-opacity hover:opacity-70"
        style={{ borderTop: "1px solid rgba(245,240,232,0.06)" }}
      >
        <span
          className="text-xs font-mono tracking-widest uppercase"
          style={{ color: "rgba(245,240,232,0.3)" }}
        >
          Detailed metrics
        </span>
        <span style={{ color: "rgba(245,240,232,0.25)", fontSize: "0.8rem" }}>
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="pb-8 space-y-5">
          {/* Score breakdown */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(245,240,232,0.02)", border: "1px solid rgba(245,240,232,0.06)" }}
          >
            <h4
              className="text-xs font-mono tracking-wider uppercase mb-3"
              style={{ color: "rgba(245,240,232,0.25)" }}
            >
              Score Breakdown
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <MetricRow label="Base FairScore" value={fairscoreBase.toFixed(1)} />
              <MetricRow label="Social score" value={socialScore.toFixed(1)} />
              <MetricRow label="Tier" value={tier.charAt(0).toUpperCase() + tier.slice(1)} />
              <MetricRow
                label="Last updated"
                value={new Date(timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              />
            </div>
          </div>

          {/* Percentiles — vs ecosystem */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(245,240,232,0.02)", border: "1px solid rgba(245,240,232,0.06)" }}
          >
            <h4
              className="text-xs font-mono tracking-wider uppercase mb-3"
              style={{ color: "rgba(245,240,232,0.25)" }}
            >
              Ecosystem Percentiles
            </h4>
            <p className="text-xs mb-3" style={{ color: "rgba(245,240,232,0.25)" }}>
              How this wallet compares against 50K+ wallets scored by FairScale
            </p>
            <div className="space-y-3">
              {PERCENTILE_FIELDS.map(({ key, label }) => {
                const val = features[key];
                if (val === undefined) return null;
                const pct = Math.round(val * 100);
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: "rgba(245,240,232,0.45)" }}>{label}</span>
                      <span className="text-xs font-mono" style={{ color: "rgba(245,240,232,0.55)" }}>
                        {percentileLabel(val)}
                      </span>
                    </div>
                    <div className="h-1 rounded-full" style={{ background: "rgba(245,240,232,0.06)" }}>
                      <div
                        className="h-1 rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 75 ? "#4ade80" : pct >= 50 ? "#fbbf24" : "#9ca3af",
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Raw activity */}
          <div
            className="rounded-xl p-4"
            style={{ background: "rgba(245,240,232,0.02)", border: "1px solid rgba(245,240,232,0.06)" }}
          >
            <h4
              className="text-xs font-mono tracking-wider uppercase mb-3"
              style={{ color: "rgba(245,240,232,0.25)" }}
            >
              Activity Stats
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {RAW_FIELDS.map(({ key, label, format }) => {
                const val = features[key];
                if (val === undefined) return null;
                return <MetricRow key={key} label={label} value={format(val)} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs mb-0.5" style={{ color: "rgba(245,240,232,0.3)" }}>{label}</div>
      <div className="text-sm font-mono" style={{ color: "rgba(245,240,232,0.7)" }}>{value}</div>
    </div>
  );
}
