const statuses = ["", "approved", "failed"];
const acquirerNames = ["", "PagBrasil", "StripeGlobal", "MercadoPagoLATAM", "CieloDirectBR"];

function SelectField({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="appearance-none bg-surface-2 border border-border hover:border-volt-500/30 rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-gray-300 focus:outline-none focus:ring-1 focus:ring-volt-500/50 transition-colors cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {children}
    </select>
  );
}

export default function FilterBar({ filters, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <SelectField
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">All Statuses</option>
        {statuses.filter(Boolean).map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </SelectField>

      <SelectField
        value={filters.acquirer}
        onChange={(e) => onChange({ ...filters, acquirer: e.target.value })}
      >
        <option value="">All Acquirers</option>
        {acquirerNames.filter(Boolean).map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </SelectField>
    </div>
  );
}
