const BASE = "/api";

async function apiCall(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json();
}

export async function fetchHealth() {
  return apiCall(`${BASE}/health`);
}

export async function simulateTransactions(count = 1) {
  return apiCall(`${BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });
}

export async function toggleAutoSimulate() {
  return apiCall(`${BASE}/simulate/auto`, { method: "POST" });
}

export async function fetchTransactions({ status, acquirer, limit, offset } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (acquirer) params.set("acquirer", acquirer);
  if (limit != null && limit > 0) params.set("limit", String(limit));
  if (offset != null && offset > 0) params.set("offset", String(offset));
  return apiCall(`${BASE}/transactions?${params}`);
}

export async function fetchTransaction(id) {
  return apiCall(`${BASE}/transactions/${id}`);
}

export async function fetchMetrics() {
  return apiCall(`${BASE}/metrics`);
}
