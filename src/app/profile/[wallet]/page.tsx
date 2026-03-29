"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { FairScaleLogo } from "@/components/ui/Logo";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ProfileSkeleton } from "@/components/ui/ProfileSkeleton";
import { TrustVerdictCard } from "@/components/profile/TrustVerdictCard";
import { SignalsSection } from "@/components/profile/SignalsSection";
import { BadgesSection } from "@/components/profile/BadgesSection";
import { ExpandableMetrics } from "@/components/profile/ExpandableMetrics";
import { AttestationsSection } from "@/components/attestations/AttestationsSection";
import { TRUST_COLOURS } from "@/lib/interpret";
import type { TrustProfile } from "@/types";

const TIER_LABELS: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

const TIER_COLOURS: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#a8a9ad",
  gold: "#b8924a",
  platinum: "#e5e4e2",
};

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const wallet = params.wallet as string;
  const { user, login, logout, authenticated } = usePrivy();

  const [profile, setProfile] = useState<TrustProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const xHandle = user?.twitter?.username;
  const connectedWallet = user?.wallet?.address;
  const displayName = xHandle ? `@${xHandle}` : connectedWallet
    ? `${connectedWallet.slice(0, 6)}…${connectedWallet.slice(-4)}`
    : null;

  useEffect(() => {
    if (!wallet) return;
    setLoading(true);
    setError("");

    fetch(`/api/score?wallet=${wallet}`)
      .then((res) => {
        if (!res.ok) return res.json().then((d) => { throw new Error(d.error || "Failed"); });
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [wallet]);

  const trustColor = profile ? TRUST_COLOURS[profile.trust_level] : "#6b7280";
  const shortWallet = `${wallet.slice(0, 6)}…${wallet.slice(-4)}`;
  const profileDisplayName = profile ? (
    // In future: resolve X handle from attester data
    shortWallet
  ) : shortWallet;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background image — temple at night */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "url('/graphics/temple-night-stars.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.12,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14,13,10,0.5) 0%, rgba(14,13,10,0.85) 40%, rgba(14,13,10,0.98) 80%)",
        }}
      />
      {/* Trust-level ambient glow */}
      {profile && (
        <div
          className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2"
          style={{
            width: "600px",
            height: "300px",
            background: `radial-gradient(ellipse at center, ${trustColor}0a 0%, transparent 70%)`,
            transition: "background 0.8s ease",
          }}
        />
      )}

      {/* Nav */}
      <nav
        className="relative z-10 flex items-center justify-between px-6 md:px-8 py-5"
        style={{ borderBottom: "1px solid rgba(245,240,232,0.05)" }}
      >
        <button onClick={() => router.push("/")} className="opacity-80 hover:opacity-100 transition-opacity">
          <FairScaleLogo size="sm" />
        </button>

        <div className="flex items-center gap-3">
          {/* Score updated */}
          {profile && (
            <span className="hidden md:block text-xs font-mono" style={{ color: "rgba(245,240,232,0.2)" }}>
              Updated daily
            </span>
          )}

          {/* Auth button */}
          {authenticated ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono" style={{ color: "rgba(184,146,74,0.7)" }}>
                {displayName}
              </span>
              <button
                onClick={logout}
                className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
                style={{ color: "rgba(245,240,232,0.3)", border: "1px solid rgba(245,240,232,0.08)" }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="text-xs px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90"
              style={{
                color: "#b8924a",
                background: "rgba(184,146,74,0.08)",
                border: "1px solid rgba(184,146,74,0.2)",
              }}
            >
              Connect wallet
            </button>
          )}
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 pb-24">
        {loading && <ProfileSkeleton />}

        {error && !loading && (
          <div className="pt-20 text-center animate-fade-up">
            <div
              className="inline-block p-6 rounded-2xl mb-6"
              style={{
                background: "rgba(248,113,113,0.06)",
                border: "1px solid rgba(248,113,113,0.15)",
              }}
            >
              <p className="text-sm" style={{ color: "#f87171" }}>
                {error}
              </p>
              <p className="text-xs mt-2" style={{ color: "rgba(245,240,232,0.35)" }}>
                This wallet may not be in the FairScale dataset yet.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="text-sm"
              style={{ color: "rgba(184,146,74,0.7)" }}
            >
              ← Try another wallet
            </button>
          </div>
        )}

        {profile && !loading && (
          <div className="space-y-6 pt-10">
            {/* ── HERO HEADER ── */}
            <div className="flex items-center gap-6 animate-fade-up">
              {/* Score ring */}
              <div className="shrink-0">
                <ScoreRing
                  score={profile.fairscore}
                  trustLevel={profile.trust_level}
                  size={120}
                />
              </div>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                {/* Wallet address */}
                <div
                  className="font-mono text-sm mb-1 truncate"
                  style={{ color: "rgba(245,240,232,0.4)" }}
                  title={wallet}
                >
                  {wallet}
                </div>

                {/* Tier badge */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full"
                    style={{
                      color: TIER_COLOURS[profile.tier] ?? "#f5f0e8",
                      background: `${TIER_COLOURS[profile.tier] ?? "#f5f0e8"}15`,
                      border: `1px solid ${TIER_COLOURS[profile.tier] ?? "#f5f0e8"}30`,
                    }}
                  >
                    ◈ {TIER_LABELS[profile.tier] ?? profile.tier}
                  </span>
                </div>

                {/* Trust level large */}
                <div
                  className="font-advercase text-3xl leading-none"
                  style={{ color: trustColor }}
                >
                  {profile.trust_level}
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.3)" }}>
                  Trust level
                </div>
              </div>
            </div>

            {/* ── VERDICT CARD ── */}
            <TrustVerdictCard
              trustLevel={profile.trust_level}
              confidence={profile.confidence}
              summary={profile.summary}
            />

            {/* ── WHY THIS SCORE ── */}
            <div className="animate-fade-up delay-3">
              <h3
                className="text-xs font-mono tracking-widest uppercase mb-3"
                style={{ color: "rgba(184,146,74,0.6)" }}
              >
                Why this verdict
              </h3>
              <ul className="space-y-2.5">
                {profile.why_this_score.map((reason, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm leading-relaxed"
                    style={{ color: "rgba(245,240,232,0.65)" }}
                  >
                    <span
                      className="shrink-0 mt-0.5 font-mono text-xs"
                      style={{ color: "rgba(184,146,74,0.5)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── STRENGTHS / WATCHOUTS ── */}
            <SignalsSection
              strengths={profile.strengths}
              watchouts={profile.watchouts}
            />

            {/* ── BADGES ── */}
            {profile.badges.length > 0 && (
              <BadgesSection badges={profile.badges} />
            )}

            {/* ── DIVIDER ── */}
            <div style={{ borderTop: "1px solid rgba(245,240,232,0.06)" }} />

            {/* ── ATTESTATIONS ── */}
            <AttestationsSection subjectWallet={wallet} />

            {/* ── EXPANDABLE METRICS ── */}
            <ExpandableMetrics
              features={profile.features}
              fairscoreBase={profile.fairscore_base}
              socialScore={profile.social_score}
              tier={profile.tier}
              timestamp={profile.timestamp}
            />

            {/* ── FOOTER ── */}
            <div
              className="pt-2 pb-4 flex items-center justify-between animate-fade-up delay-8"
            >
              <button
                onClick={() => router.push("/")}
                className="text-xs transition-opacity hover:opacity-70"
                style={{ color: "rgba(245,240,232,0.25)" }}
              >
                ← Check another wallet
              </button>
              <span className="text-xs font-mono" style={{ color: "rgba(245,240,232,0.15)" }}>
                FairScale · Score updated daily
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
