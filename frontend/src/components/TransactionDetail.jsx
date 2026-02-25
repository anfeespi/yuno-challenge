import StatusBadge from "./StatusBadge";

function AttemptNode({ attempt, index, isLast }) {
  const bgColor =
    attempt.status === "approved"
      ? "bg-emerald-500"
      : attempt.status === "timeout"
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${bgColor} mt-1`} />
        {!isLast && <div className="w-0.5 h-12 bg-gray-700 mt-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">{attempt.acquirer}</span>
          <StatusBadge status={attempt.status} />
        </div>
        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
          <p>Response: {attempt.responseTimeMs}ms</p>
          {attempt.errorMessage && (
            <p className="text-red-400">{attempt.errorCode}: {attempt.errorMessage}</p>
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
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Transaction Detail</h2>
            <p className="text-xs text-gray-500 font-mono mt-1">{tx.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Amount</span>
            <p className="text-white font-medium">
              {tx.currency} {tx.amount.toFixed(2)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Status</span>
            <div className="mt-0.5">
              <StatusBadge status={tx.status} />
            </div>
          </div>
          <div>
            <span className="text-gray-500">Card</span>
            <p className="text-white">
              {tx.cardBrand} ****{tx.cardLast4}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Attempts</span>
            <p className="text-white">{tx.attempts.length}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Failover Journey
          </h3>
          <div className="pl-1">
            {tx.attempts.map((attempt, i) => (
              <AttemptNode
                key={i}
                attempt={attempt}
                index={i}
                isLast={i === tx.attempts.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-600 border-t border-gray-800 pt-3">
          <p>Created: {tx.createdAt}</p>
          <p>Completed: {tx.completedAt}</p>
        </div>
      </div>
    </div>
  );
}
