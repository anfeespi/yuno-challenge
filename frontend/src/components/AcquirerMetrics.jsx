function healthColor(successRate) {
  if (successRate >= 0.9) return "text-emerald-400";
  if (successRate >= 0.75) return "text-amber-400";
  return "text-red-400";
}

function barColor(successRate) {
  if (successRate >= 0.9) return "bg-emerald-500";
  if (successRate >= 0.75) return "bg-amber-500";
  return "bg-red-500";
}

function MetricCard({ metric }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white text-sm">{metric.name}</h3>
        <span className="text-xs text-gray-500">{metric.totalVolume} txns</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Success Rate</span>
          <span className={healthColor(metric.successRate)}>
            {(metric.successRate * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full ${barColor(metric.successRate)}`}
            style={{ width: `${metric.successRate * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-500">Avg Latency</span>
          <p className="text-white font-medium">{metric.avgLatencyMs.toFixed(0)}ms</p>
        </div>
        <div>
          <span className="text-gray-500">Timeout Rate</span>
          <p className={metric.timeoutRate > 0.15 ? "text-red-400 font-medium" : "text-white font-medium"}>
            {(metric.timeoutRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AcquirerMetrics({ metrics }) {
  if (!metrics || !metrics.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <MetricCard key={m.name} metric={m} />
      ))}
    </div>
  );
}
