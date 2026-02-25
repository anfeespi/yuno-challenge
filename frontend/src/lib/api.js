const BASE = "/api";

export async function fetchHealth() {
  const res = await fetch(`${BASE}/health`);
  return res.json();
}

export async function simulateTransactions(count = 1) {
  const res = await fetch(`${BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });
  return res.json();
}

export async function toggleAutoSimulate() {
  const res = await fetch(`${BASE}/simulate/auto`, { method: "POST" });
  return res.json();
}

export async function fetchTransactions({ status, acquirer, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (acquirer) params.set("acquirer", acquirer);
  if (limit) params.set("limit", String(limit));
  if (offset) params.set("offset", String(offset));
  const res = await fetch(`${BASE}/transactions?${params}`);
  return res.json();
}

export async function fetchTransaction(id) {
  const res = await fetch(`${BASE}/transactions/${id}`);
  return res.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${BASE}/metrics`);
  return res.json();
}
