function healthGradient(successRate) {
  if (successRate >= 0.9) return "from-emerald-500 to-emerald-400";
  if (successRate >= 0.75) return "from-amber-500 to-amber-400";
  return "from-red-500 to-red-400";
}

function healthText(successRate) {
  if (successRate >= 0.9) return "text-emerald-400";
  if (successRate >= 0.75) return "text-amber-400";
  return "text-red-400";
}

function healthBg(successRate) {
  if (successRate >= 0.9) return "bg-emerald-500";
  if (successRate >= 0.75) return "bg-amber-500";
  return "bg-red-500";
}

function MetricCard({ metric, index }) {
  const pct = (metric.successRate * 100).toFixed(1);
  const timeoutPct = (metric.timeoutRate * 100).toFixed(1);

  return (
    <div
      className="glass-card rounded-2xl p-5 space-y-4 transition-all duration-300 hover:translate-y-[-2px] animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-white text-sm">{metric.name}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5 font-mono">{metric.totalVolume} transactions</p>
        </div>
        <div className={`w-3 h-3 rounded-full mt-1 ${healthBg(metric.successRate)}`} />
      </div>

      {/* Success Rate */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Success</span>
          <span className={`text-2xl font-bold tabular-nums ${healthText(metric.successRate)}`}>
            {pct}<span className="text-sm font-semibold">%</span>
          </span>
        </div>
        <div className="w-full bg-surface-3 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${healthGradient(metric.successRate)} transition-all duration-700 ease-out`}
            style={{ width: `${metric.successRate * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-surface-0/50 rounded-lg px-3 py-2">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block">Latency</span>
          <p className="text-white font-bold text-sm mt-0.5 tabular-nums">
            {metric.avgLatencyMs.toFixed(0)}<span className="text-gray-500 font-normal text-xs">ms</span>
          </p>
        </div>
        <div className="bg-surface-0/50 rounded-lg px-3 py-2">
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider block">Timeout</span>
          <p className={`font-bold text-sm mt-0.5 tabular-nums ${
            metric.timeoutRate > 0.15 ? "text-red-400" : "text-white"
          }`}>
            {timeoutPct}<span className={`font-normal text-xs ${metric.timeoutRate > 0.15 ? "text-red-400/60" : "text-gray-500"}`}>%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcquirerMetrics({ metrics }) {
  if (!metrics || !metrics.length) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
        Acquirer Health
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={m.name} metric={m} index={i} />
        ))}
      </div>
    </div>
  );
}
