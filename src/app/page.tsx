"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { FairScaleLogo } from "@/components/ui/Logo";

function isValidSolanaAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
}

export default function HomePage() {
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCheck = () => {
    const address = wallet.trim();
    if (!address) {
      setError("Enter a Solana wallet address");
      inputRef.current?.focus();
      return;
    }
    if (!isValidSolanaAddress(address)) {
      setError("That doesn't look like a valid Solana address");
      return;
    }
    setError("");
    setLoading(true);
    router.push(`/profile/${address}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <main className="relative min-h-screen grid-bg flex flex-col overflow-hidden">
      {/* Hero background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/graphics/hero-two-figures.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          opacity: 0.22,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14,13,10,0.15) 0%, rgba(14,13,10,0.6) 45%, rgba(14,13,10,1) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 38%, rgba(184,146,74,0.09) 0%, transparent 70%)",
        }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <FairScaleLogo />
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-mono px-2 py-1 rounded"
            style={{
              color: "rgba(184,146,74,0.8)",
              background: "rgba(184,146,74,0.08)",
              border: "1px solid rgba(184,146,74,0.15)",
            }}
          >
            BETA
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-24">
        {/* Eyebrow */}
        <div
          className="animate-fade-up mb-6 flex items-center gap-2 text-xs font-mono tracking-widest uppercase"
          style={{ color: "rgba(184,146,74,0.7)", animationDelay: "0s" }}
        >
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
          />
          Reputation infrastructure for Solana
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up delay-1 font-advercase text-center mb-4"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: "#f5f0e8",
          }}
        >
          Can you trust
          <br />
          <span className="text-gold-gradient">this wallet?</span>
        </h1>

        {/* Subheadline */}
        <p
          className="animate-fade-up delay-2 text-center max-w-md mb-12 leading-relaxed"
          style={{ fontSize: "1.05rem", color: "rgba(245,240,232,0.5)" }}
        >
          FairScale turns onchain behaviour and social credibility into a single,
          human-readable trust verdict.
        </p>

        {/* Input card */}
        <div
          className="animate-fade-up delay-3 glass w-full max-w-xl rounded-2xl p-2"
          style={{ boxShadow: "0 8px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(184,146,74,0.08)" }}
        >
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={wallet}
              onChange={(e) => { setWallet(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter a Solana wallet address…"
              className="wallet-input flex-1 rounded-xl px-4 py-3.5 font-mono text-sm"
              style={{ color: "#f5f0e8", fontSize: "0.82rem" }}
              spellCheck={false}
              autoComplete="off"
            />
            <button
              onClick={handleCheck}
              disabled={loading}
              className="btn-gold rounded-xl px-6 py-3.5 text-sm font-sans font-semibold whitespace-nowrap shrink-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner />
                  Checking…
                </span>
              ) : (
                "Check profile →"
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="animate-fade-in mt-3 text-sm" style={{ color: "#f87171" }}>
            {error}
          </p>
        )}

        {/* Example wallets */}
        <div className="animate-fade-up delay-4 mt-6 flex items-center gap-3 flex-wrap justify-center">
          <span className="text-xs" style={{ color: "rgba(245,240,232,0.3)" }}>
            Try an example:
          </span>
          {[
            { label: "7xKXtg…sgAsU", address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU" },
            { label: "CKLqcv…poNv", address: "CKLqcv3TT1Ut15Xq13ALZFAnwK5dswf5VBaqFWDkpoNv" },
          ].map((ex) => (
            <button
              key={ex.address}
              onClick={() => { setWallet(ex.address); setError(""); }}
              className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{
                color: "rgba(184,146,74,0.7)",
                background: "rgba(184,146,74,0.06)",
                border: "1px solid rgba(184,146,74,0.12)",
              }}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div
        className="animate-fade-up delay-5 relative z-10 border-t py-5 px-8"
        style={{ borderColor: "rgba(184,146,74,0.08)" }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-12 flex-wrap">
          {[
            { value: "50K+", label: "Wallets scored" },
            { value: "4,000+", label: "Users signed up" },
            { value: "Daily", label: "Model retraining" },
            { value: "Live", label: "Solana mainnet" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-advercase text-xl" style={{ color: "#f5f0e8" }}>{stat.value}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(245,240,232,0.35)" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
