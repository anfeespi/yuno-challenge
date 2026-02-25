export default function AlertBanner({ metrics }) {
  if (!metrics || !metrics.length) return null;

  const alerts = metrics.filter(
    (m) => m.totalVolume > 0 && (m.timeoutRate > 0.15 || m.successRate < 0.75)
  );

  if (!alerts.length) return null;

  return (
    <div className="space-y-2">
      {alerts.map((m) => {
        const isTimeout = m.timeoutRate > 0.15;
        const isLowSuccess = m.successRate < 0.75;
        const isCritical = m.timeoutRate > 0.25 || m.successRate < 0.6;

        return (
          <div
            key={m.name}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm animate-fade-in ${
              isCritical
                ? "bg-red-500/8 border-red-500/20"
                : "bg-amber-500/8 border-amber-500/20"
            }`}
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${
              isCritical ? "bg-red-400 animate-pulse-dot" : "bg-amber-400"
            }`} />
            <span className={`font-semibold text-sm ${
              isCritical ? "text-red-400" : "text-amber-400"
            }`}>
              {m.name}
            </span>
            <span className={`text-xs font-medium ${
              isCritical ? "text-red-400/60" : "text-amber-400/60"
            }`}>
              {isTimeout && `Timeout ${(m.timeoutRate * 100).toFixed(1)}%`}
              {isTimeout && isLowSuccess && " / "}
              {isLowSuccess && `Success ${(m.successRate * 100).toFixed(1)}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
