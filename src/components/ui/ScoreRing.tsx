"use client";

import { useEffect, useState } from "react";
import { TRUST_COLOURS } from "@/lib/interpret";
import type { TrustLevel } from "@/types";

interface ScoreRingProps {
  score: number;
  trustLevel: TrustLevel;
  size?: number;
}

export function ScoreRing({ score, trustLevel, size = 160 }: ScoreRingProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const offset = circumference - (clampedScore / 100) * circumference;
  const color = TRUST_COLOURS[trustLevel] ?? "#6b7280";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        style={{ transform: "rotate(-90deg)" }}
      >
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(245,240,232,0.06)"
          strokeWidth="7"
        />
        {/* Glow ring behind */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
            filter: `drop-shadow(0 0 8px ${color}50)`,
            opacity: 0.3,
          }}
        />
        {/* Main progress arc */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? offset : circumference}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>

      {/* Centre content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono font-medium leading-none"
          style={{
            fontSize: size * 0.26,
            color: "#f5f0e8",
            letterSpacing: "-0.02em",
          }}
        >
          {clampedScore.toFixed(1)}
        </span>
        <span
          className="font-sans text-center leading-tight mt-1"
          style={{
            fontSize: size * 0.085,
            color: "rgba(245,240,232,0.4)",
          }}
        >
          FairScore
        </span>
      </div>
    </div>
  );
}
