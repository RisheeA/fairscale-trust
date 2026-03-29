"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Attestation, ReasonCode } from "@/types";
import { REASON_LABELS } from "@/types";

interface AttestationsSectionProps {
  subjectWallet: string;
}

export function AttestationsSection({ subjectWallet }: AttestationsSectionProps) {
  const { user, login, authenticated } = usePrivy();
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<ReasonCode>("worked_with");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const connectedWallet = user?.wallet?.address;
  const xHandle = user?.twitter?.username;

  const fetchAttestations = async () => {
    try {
      const res = await fetch(`/api/attestations?wallet=${subjectWallet}`);
      const data = await res.json();
      setAttestations(Array.isArray(data) ? data : []);
    } catch {
      setAttestations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttestations();
  }, [subjectWallet]);

  const handleVouch = async () => {
    if (!connectedWallet) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/attestations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject_wallet: subjectWallet,
          attester_wallet: connectedWallet,
          attester_handle: xHandle || null,
          reason_code: selectedReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit vouch");
      } else {
        setSuccessMsg("Vouch submitted successfully");
        setShowForm(false);
        fetchAttestations();
        setTimeout(() => setSuccessMsg(""), 4000);
      }
    } catch {
      setErrorMsg("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (attestationId: string) => {
    if (!connectedWallet) return;
    setRevoking(attestationId);

    try {
      const res = await fetch("/api/attestations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attestation_id: attestationId,
          attester_wallet: connectedWallet,
        }),
      });

      if (res.ok) {
        fetchAttestations();
      }
    } catch {
      // silently fail
    } finally {
      setRevoking(null);
    }
  };

  const activeVouches = attestations.filter((a) => !a.revoked);
  const revokedVouches = attestations.filter((a) => a.revoked);
  const alreadyVouched = attestations.some(
    (a) => a.attester_wallet === connectedWallet && !a.revoked
  );
  const myRevokedVouch = attestations.find(
    (a) => a.attester_wallet === connectedWallet && a.revoked
  );

  return (
    <div className="animate-fade-up delay-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "rgba(184,146,74,0.6)" }}
          >
            Vouched By
          </h3>
          {activeVouches.length > 0 && (
            <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,232,0.3)" }}>
              {activeVouches.length} active vouch{activeVouches.length !== 1 ? "es" : ""}
            </p>
          )}
        </div>

        {/* Vouch CTA */}
        {!alreadyVouched && !myRevokedVouch && (
          authenticated ? (
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-xs px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                color: "#b8924a",
                background: "rgba(184,146,74,0.08)",
                border: "1px solid rgba(184,146,74,0.2)",
              }}
            >
              {showForm ? "Cancel" : "+ Vouch for this wallet"}
            </button>
          ) : (
            <button
              onClick={login}
              className="text-xs px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                color: "#b8924a",
                background: "rgba(184,146,74,0.08)",
                border: "1px solid rgba(184,146,74,0.2)",
              }}
            >
              Connect to vouch
            </button>
          )
        )}

        {alreadyVouched && (
          <span
            className="text-xs px-3 py-1.5 rounded-xl"
            style={{
              color: "#4ade80",
              background: "rgba(74,222,128,0.08)",
              border: "1px solid rgba(74,222,128,0.15)",
            }}
          >
            ✓ You've vouched
          </span>
        )}
      </div>

      {/* Success / Error messages */}
      {successMsg && (
        <div className="mb-3 px-4 py-3 rounded-xl text-sm" style={{ color: "#4ade80", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)" }}>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-3 px-4 py-3 rounded-xl text-sm" style={{ color: "#f87171", background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.15)" }}>
          {errorMsg}
        </div>
      )}

      {/* Vouch form */}
      {showForm && authenticated && (
        <div
          className="mb-4 p-4 rounded-xl"
          style={{ background: "rgba(28,25,22,0.8)", border: "1px solid rgba(184,146,74,0.12)" }}
        >
          <p className="text-xs mb-3" style={{ color: "rgba(245,240,232,0.4)" }}>
            Vouching as{" "}
            <span className="font-mono" style={{ color: "rgba(245,240,232,0.65)" }}>
              {xHandle ? `@${xHandle}` : `${connectedWallet?.slice(0, 8)}…`}
            </span>
            . Your FairScore determines the weight of your vouch.
          </p>

          <div className="mb-4">
            <label className="text-xs font-mono tracking-wider uppercase mb-2 block" style={{ color: "rgba(245,240,232,0.35)" }}>
              Reason
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.entries(REASON_LABELS) as [ReasonCode, string][]).map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => setSelectedReason(code)}
                  className="text-xs px-3 py-2 rounded-lg transition-all"
                  style={{
                    color: selectedReason === code ? "#0e0d0a" : "rgba(245,240,232,0.5)",
                    background: selectedReason === code ? "#b8924a" : "rgba(245,240,232,0.04)",
                    border: `1px solid ${selectedReason === code ? "#b8924a" : "rgba(245,240,232,0.1)"}`,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleVouch}
            disabled={submitting}
            className="btn-gold w-full py-2.5 rounded-xl text-sm font-semibold"
          >
            {submitting ? "Submitting…" : "Submit vouch"}
          </button>
        </div>
      )}

      {/* Active vouches */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 rounded-xl shimmer" />
          ))}
        </div>
      ) : activeVouches.length === 0 && revokedVouches.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: "rgba(245,240,232,0.02)", border: "1px dashed rgba(245,240,232,0.08)" }}
        >
          <p className="text-sm" style={{ color: "rgba(245,240,232,0.25)" }}>
            No vouches yet for this wallet
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.15)" }}>
            Be the first to vouch — your FairScore backs your credibility
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...activeVouches, ...revokedVouches].map((attestation) => (
            <AttestationCard
              key={attestation.id}
              attestation={attestation}
              connectedWallet={connectedWallet}
              onRevoke={handleRevoke}
              revoking={revoking === attestation.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AttestationCard({
  attestation,
  connectedWallet,
  onRevoke,
  revoking,
}: {
  attestation: Attestation;
  connectedWallet?: string;
  onRevoke: (id: string) => void;
  revoking: boolean;
}) {
  const isOwn = attestation.attester_wallet === connectedWallet;
  const displayName = attestation.attester_handle
    ? `@${attestation.attester_handle}`
    : `${attestation.attester_wallet.slice(0, 6)}…${attestation.attester_wallet.slice(-4)}`;

  const weightColor =
    attestation.vouch_weight >= 70 ? "#4ade80" :
    attestation.vouch_weight >= 40 ? "#fbbf24" : "#9ca3af";

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
      style={{
        background: attestation.revoked ? "rgba(248,113,113,0.03)" : "rgba(245,240,232,0.03)",
        border: `1px solid ${attestation.revoked ? "rgba(248,113,113,0.1)" : "rgba(245,240,232,0.07)"}`,
        opacity: attestation.revoked ? 0.6 : 1,
      }}
    >
      {/* Avatar placeholder */}
      <div
        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-mono"
        style={{
          background: "rgba(184,146,74,0.1)",
          border: "1px solid rgba(184,146,74,0.15)",
          color: "#b8924a",
        }}
      >
        {displayName.slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-sm font-medium"
            style={{
              color: "rgba(245,240,232,0.8)",
              textDecoration: attestation.revoked ? "line-through" : "none",
            }}
          >
            {displayName}
          </span>
          {attestation.revoked && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ color: "#f87171", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              ⚠ Revoked
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs" style={{ color: "rgba(245,240,232,0.35)" }}>
            {REASON_LABELS[attestation.reason_code as ReasonCode]}
          </span>
          <span style={{ color: "rgba(245,240,232,0.15)", fontSize: "0.6rem" }}>·</span>
          <span className="text-xs" style={{ color: "rgba(245,240,232,0.25)" }}>
            {new Date(attestation.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {/* Vouch weight */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        {attestation.vouch_weight > 0 && (
          <div className="flex items-center gap-1.5">
            <div
              className="h-1 rounded-full"
              style={{
                width: `${Math.max(16, (attestation.vouch_weight / 100) * 48)}px`,
                background: weightColor,
                opacity: 0.6,
              }}
            />
            <span className="text-xs font-mono" style={{ color: weightColor }}>
              {attestation.vouch_weight}
            </span>
          </div>
        )}

        {/* Revoke button — own active vouch */}
        {isOwn && !attestation.revoked && (
          <button
            onClick={() => onRevoke(attestation.id)}
            disabled={revoking}
            className="text-xs transition-opacity hover:opacity-80"
            style={{ color: "rgba(248,113,113,0.5)" }}
          >
            {revoking ? "…" : "Revoke"}
          </button>
        )}
      </div>
    </div>
  );
}
