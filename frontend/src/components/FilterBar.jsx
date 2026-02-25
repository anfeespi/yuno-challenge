const statuses = ["", "approved", "failed"];
const acquirerNames = ["", "PagBrasil", "StripeGlobal", "MercadoPagoLATAM", "CieloDirectBR"];

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">All Statuses</option>
        {statuses.filter(Boolean).map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select
        value={filters.acquirer}
        onChange={(e) => onChange({ ...filters, acquirer: e.target.value })}
        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">All Acquirers</option>
        {acquirerNames.filter(Boolean).map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
    </div>
  );
}
