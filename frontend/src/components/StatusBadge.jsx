const config = {
  approved: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  failed: {
    bg: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500/25",
    dot: "bg-red-400",
  },
  timeout: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/25",
    dot: "bg-amber-400",
  },
  declined: {
    bg: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500/25",
    dot: "bg-rose-400",
  },
};

const fallback = {
  bg: "bg-gray-500/15",
  text: "text-gray-400",
  border: "border-gray-500/25",
  dot: "bg-gray-400",
};

export default function StatusBadge({ status, size = "sm" }) {
  const c = config[status] || fallback;
  const sizeClass = size === "lg" ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[11px]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${sizeClass} ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
}
