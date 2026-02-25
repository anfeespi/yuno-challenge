import StatusBadge from "./StatusBadge";

export default function TransactionFeed({ transactions, onSelect }) {
  if (!transactions.length) {
    return (
      <div className="glass-card rounded-2xl text-center py-16">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-surface-3 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-500">
            <path d="M10 4v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">No transactions yet</p>
        <p className="text-gray-600 text-sm mt-1">Click &quot;Simulate 5&quot; to generate some</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Card</th>
            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Acquirer</th>
            <th className="text-center px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Hops</th>
            <th className="text-left px-5 py-3.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => {
            const lastAttempt = tx.attempts[tx.attempts.length - 1];
            return (
              <tr
                key={tx.id}
                onClick={() => onSelect(tx)}
                className="border-b border-border-subtle hover:bg-volt-500/[0.04] cursor-pointer transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
              >
                <td className="px-5 py-3.5 font-mono text-xs text-gray-400">
                  {tx.id.slice(0, 8)}
                </td>
                <td className="px-5 py-3.5 text-white font-semibold tabular-nums">
                  <span className="text-gray-500 font-normal">{tx.currency}</span>{" "}
                  {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3.5 text-gray-400 hidden md:table-cell">
                  <span className="text-gray-300">{tx.cardBrand}</span>{" "}
                  <span className="font-mono text-xs">****{tx.cardLast4}</span>
                </td>
                <td className="px-5 py-3.5 text-gray-300 text-xs font-medium">
                  {lastAttempt?.acquirer}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    tx.attempts.length > 1
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-surface-3 text-gray-500"
                  }`}>
                    {tx.attempts.length}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
