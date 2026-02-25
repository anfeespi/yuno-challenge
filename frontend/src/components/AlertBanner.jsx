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
        const severity =
          m.timeoutRate > 0.25 || m.successRate < 0.6 ? "red" : "amber";

        const bg =
          severity === "red"
            ? "bg-red-500/10 border-red-500/30 text-red-400"
            : "bg-amber-500/10 border-amber-500/30 text-amber-400";

        return (
          <div
            key={m.name}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm ${bg}`}
          >
            <span className="font-medium">{m.name}</span>
            <span className="text-xs opacity-80">
              {isTimeout && `Timeout: ${(m.timeoutRate * 100).toFixed(1)}%`}
              {isTimeout && isLowSuccess && " | "}
              {isLowSuccess && `Success: ${(m.successRate * 100).toFixed(1)}%`}
            </span>
          </div>
        );
      })}
    </div>
  );
}
