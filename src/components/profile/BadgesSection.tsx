import type { TrustBadge } from "@/types";

interface BadgesProps {
  badges: TrustBadge[];
}

const TIER_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  premium: {
    color: "#d4a853",
    bg: "rgba(212,168,83,0.1)",
    border: "rgba(212,168,83,0.25)",
  },
  elevated: {
    color: "#f5f0e8",
    bg: "rgba(245,240,232,0.07)",
    border: "rgba(245,240,232,0.15)",
  },
  standard: {
    color: "rgba(245,240,232,0.6)",
    bg: "rgba(245,240,232,0.04)",
    border: "rgba(245,240,232,0.1)",
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  behavioural: "◉",
  social: "◈",
  identity: "◎",
};

export function BadgesSection({ badges }: BadgesProps) {
  if (badges.length === 0) return null;

  return (
    <div className="animate-fade-up delay-4">
      <h3
        className="text-xs font-mono tracking-widest uppercase mb-3"
        style={{ color: "rgba(184,146,74,0.6)" }}
      >
        Earned Badges
      </h3>
      <div className="flex flex-wrap gap-2">
        {badges.map((badge) => {
          const style = TIER_STYLES[badge.tier] ?? TIER_STYLES.standard;
          return (
            <div
              key={badge.id}
              title={badge.description}
              className="group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-default transition-all"
              style={{
                color: style.color,
                background: style.bg,
                border: `1px solid ${style.border}`,
              }}
            >
              <span className="text-xs opacity-60">
                {CATEGORY_ICONS[badge.category]}
              </span>
              <span className="text-xs font-medium">{badge.label}</span>

              {/* Tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                style={{
                  background: "rgba(20,18,16,0.95)",
                  border: "1px solid rgba(184,146,74,0.15)",
                  color: "rgba(245,240,232,0.7)",
                }}
              >
                {badge.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
