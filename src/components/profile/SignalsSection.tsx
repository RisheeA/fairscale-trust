interface SignalsProps {
  strengths: string[];
  watchouts: string[];
}

export function SignalsSection({ strengths, watchouts }: SignalsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up delay-4">
      {/* Strengths */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(74,222,128,0.04)",
          border: "1px solid rgba(74,222,128,0.12)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: "#4ade80", fontSize: "0.9rem" }}>↑</span>
          <h3
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "rgba(74,222,128,0.7)" }}
          >
            Strengths
          </h3>
        </div>
        <ul className="space-y-2">
          {strengths.length > 0 ? (
            strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(245,240,232,0.65)" }}>
                <span className="mt-0.5 shrink-0 text-xs" style={{ color: "#4ade8060" }}>◉</span>
                {s}
              </li>
            ))
          ) : (
            <li className="text-sm" style={{ color: "rgba(245,240,232,0.3)" }}>
              No significant strengths detected
            </li>
          )}
        </ul>
      </div>

      {/* Watchouts */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "rgba(248,113,113,0.04)",
          border: "1px solid rgba(248,113,113,0.12)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span style={{ color: "#f87171", fontSize: "0.9rem" }}>⚠</span>
          <h3
            className="text-xs font-mono tracking-widest uppercase"
            style={{ color: "rgba(248,113,113,0.7)" }}
          >
            Watch Outs
          </h3>
        </div>
        <ul className="space-y-2">
          {watchouts.map((w, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "rgba(245,240,232,0.65)" }}>
              <span className="mt-0.5 shrink-0 text-xs" style={{ color: "#f8717160" }}>◉</span>
              {w}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
