import StatusBadge from "./StatusBadge";

function AttemptNode({ attempt, isLast }) {
  const dotColor =
    attempt.status === "approved"
      ? "bg-emerald-400 shadow-emerald-400/40"
      : attempt.status === "timeout"
      ? "bg-amber-400 shadow-amber-400/40"
      : "bg-red-400 shadow-red-400/40";

  const lineColor =
    attempt.status === "timeout" ? "border-amber-500/30" : "border-border";

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mt-1.5 shadow-lg ${dotColor}`} />
        {!isLast && (
          <div className={`w-0 h-14 border-l-2 border-dashed mt-1 ${lineColor}`} />
        )}
      </div>
      <div className="flex-1 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-white font-semibold text-sm">{attempt.acquirer}</span>
          <StatusBadge status={attempt.status} />
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-xs">
          <span className="text-gray-400 font-mono tabular-nums">
            {attempt.responseTimeMs}ms
          </span>
          {attempt.errorMessage && (
            <span className="text-red-400/80">
              {attempt.errorCode}: {attempt.errorMessage}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TransactionDetail({ transaction, onClose }) {
  if (!transaction) return null;

  const tx = transaction;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-1 border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-surface-1/90 backdrop-blur-md border-b border-border-subtle px-6 py-4 flex items-start justify-between rounded-t-2xl">
          <div>
            <h2 className="text-base font-bold text-white">Transaction Detail</h2>
            <p className="text-[11px] text-gray-500 font-mono mt-1">{tx.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-3 hover:bg-surface-2 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-0/60 rounded-xl px-4 py-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Amount</span>
              <p className="text-white font-bold text-lg mt-1 tabular-nums">
                <span className="text-gray-400 text-sm font-normal">{tx.currency}</span>{" "}
                {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-surface-0/60 rounded-xl px-4 py-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</span>
              <div className="mt-2">
                <StatusBadge status={tx.status} size="lg" />
              </div>
            </div>
            <div className="bg-surface-0/60 rounded-xl px-4 py-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Card</span>
              <p className="text-white font-medium text-sm mt-1">
                {tx.cardBrand}{" "}
                <span className="font-mono text-gray-400">****{tx.cardLast4}</span>
              </p>
            </div>
            <div className="bg-surface-0/60 rounded-xl px-4 py-3">
              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Attempts</span>
              <p className="text-white font-bold text-lg mt-1">{tx.attempts.length}</p>
            </div>
          </div>

          {/* Failover Journey */}
          <div>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Failover Journey
            </h3>
            <div className="pl-1">
              {tx.attempts.map((attempt, i) => (
                <AttemptNode
                  key={i}
                  attempt={attempt}
                  isLast={i === tx.attempts.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Timestamps */}
          <div className="border-t border-border-subtle pt-4 flex gap-6 text-[11px] text-gray-600 font-mono">
            <div>
              <span className="text-gray-500">Created</span>
              <p className="mt-0.5">{new Date(tx.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Completed</span>
              <p className="mt-0.5">{new Date(tx.completedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
