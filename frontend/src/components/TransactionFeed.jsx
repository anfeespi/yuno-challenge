import StatusBadge from "./StatusBadge";

export default function TransactionFeed({ transactions, onSelect }) {
  if (!transactions.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        No transactions yet. Click &quot;Simulate&quot; to generate some.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/50">
            <th className="text-left px-4 py-3 font-medium text-gray-400">ID</th>
            <th className="text-left px-4 py-3 font-medium text-gray-400">Amount</th>
            <th className="text-left px-4 py-3 font-medium text-gray-400">Card</th>
            <th className="text-left px-4 py-3 font-medium text-gray-400">Acquirer</th>
            <th className="text-left px-4 py-3 font-medium text-gray-400">Attempts</th>
            <th className="text-left px-4 py-3 font-medium text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const lastAttempt = tx.attempts[tx.attempts.length - 1];
            return (
              <tr
                key={tx.id}
                onClick={() => onSelect(tx)}
                className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-gray-300">
                  {tx.id.slice(0, 8)}...
                </td>
                <td className="px-4 py-3 text-white font-medium">
                  {tx.currency} {tx.amount.toFixed(2)}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {tx.cardBrand} ****{tx.cardLast4}
                </td>
                <td className="px-4 py-3 text-gray-300">
                  {lastAttempt?.acquirer}
                </td>
                <td className="px-4 py-3 text-gray-300">{tx.attempts.length}</td>
                <td className="px-4 py-3">
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
