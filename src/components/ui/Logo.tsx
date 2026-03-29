interface LogoProps {
  variant?: "white" | "gold" | "dark";
  size?: "sm" | "md" | "lg";
}

export function FairScaleLogo({ variant = "white", size = "md" }: LogoProps) {
  const heights = { sm: 24, md: 32, lg: 44 };
  const h = heights[size];

  const color = variant === "gold" ? "#b8924a" : variant === "dark" ? "#0e0d0a" : "#f5f0e8";

  // FairScale wordmark — scales SVG icon + text
  return (
    <div className="flex items-center gap-2.5">
      {/* Icon mark: scales symbol */}
      <svg
        width={h * 0.85}
        height={h}
        viewBox="0 0 34 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Balance beam */}
        <rect x="16" y="4" width="2" height="28" rx="1" fill={color} opacity="0.9" />
        {/* Top pivot */}
        <circle cx="17" cy="4" r="2.5" fill={color} />
        {/* Beam */}
        <rect x="4" y="11" width="26" height="2" rx="1" fill={color} opacity="0.9" />
        {/* Left pan */}
        <path d="M4 13 Q1 20 7 20 Q13 20 10 13Z" fill={color} opacity="0.7" />
        {/* Right pan */}
        <path d="M24 13 Q21 20 27 20 Q33 20 30 13Z" fill={color} opacity="0.7" />
        {/* Base */}
        <rect x="14" y="32" width="6" height="2" rx="1" fill={color} opacity="0.6" />
        <rect x="10" y="34" width="14" height="2" rx="1" fill={color} opacity="0.5" />
      </svg>

      {/* Wordmark — uses Advercase from CSS */}
      <span
        style={{
          fontFamily: "Advercase, serif",
          fontSize: h * 0.6,
          color: color,
          letterSpacing: "0.04em",
          lineHeight: 1,
          fontWeight: 400,
        }}
      >
        FairScale
      </span>
    </div>
  );
}

export function FairScaleIcon({ size = 32, color = "#f5f0e8" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="16" y="4" width="2" height="28" rx="1" fill={color} opacity="0.9" />
      <circle cx="17" cy="4" r="2.5" fill={color} />
      <rect x="4" y="11" width="26" height="2" rx="1" fill={color} opacity="0.9" />
      <path d="M4 13 Q1 20 7 20 Q13 20 10 13Z" fill={color} opacity="0.7" />
      <path d="M24 13 Q21 20 27 20 Q33 20 30 13Z" fill={color} opacity="0.7" />
      <rect x="14" y="32" width="6" height="2" rx="1" fill={color} opacity="0.6" />
      <rect x="10" y="34" width="14" height="2" rx="1" fill={color} opacity="0.5" />
    </svg>
  );
}
