export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-40 rounded shimmer" />
          <div className="h-6 w-24 rounded shimmer" />
          <div className="h-3 w-32 rounded shimmer" />
        </div>
      </div>

      {/* Verdict card */}
      <div className="h-32 rounded-2xl shimmer" />

      {/* Why section */}
      <div className="space-y-2">
        <div className="h-3 w-20 rounded shimmer" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 rounded shimmer" style={{ width: `${70 + Math.random() * 25}%` }} />
        ))}
      </div>

      {/* Signals */}
      <div className="grid grid-cols-2 gap-4">
        <div className="h-36 rounded-xl shimmer" />
        <div className="h-36 rounded-xl shimmer" />
      </div>

      {/* Attestations */}
      <div className="h-48 rounded-xl shimmer" />
    </div>
  );
}
