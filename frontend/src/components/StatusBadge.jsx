const statusStyles = {
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
  timeout: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  declined: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {status}
    </span>
  );
}
