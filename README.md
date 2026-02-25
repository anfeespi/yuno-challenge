# VoltCommerce Failover Console

Real-time monitoring console for tracking payment transaction timeouts across 4 acquirers and visualizing failover behavior.

## Tech Stack

- **Backend**: Go (stdlib `net/http`), in-memory storage, SSE
- **Frontend**: React + Vite + Tailwind CSS v4

## Getting Started

### Prerequisites

- Go 1.21+
- Node.js 18+

### Backend

```bash
cd backend
go run .
# Server starts on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/simulate` | Simulate transactions (`{"count": N}`) |
| `POST` | `/api/simulate/auto` | Toggle auto-simulation (every 2s) |
| `GET` | `/api/transactions` | List transactions (?status, ?acquirer, ?limit, ?offset) |
| `GET` | `/api/transactions/{id}` | Get transaction by ID |
| `GET` | `/api/metrics` | Aggregated per-acquirer metrics |
| `GET` | `/api/stream` | SSE stream (events: `transaction`, `metrics`) |

## Acquirer Profiles

| Acquirer | Success Rate | Timeout Rate | Latency |
|----------|-------------|-------------|---------|
| PagBrasil | 95% | 2% | 1-3s |
| StripeGlobal | 88% | 8% | 2-4s |
| MercadoPagoLATAM | 85% | 10% | 3-5s |
| CieloDirectBR | 70% | 25% | 6-10s |

## Architecture

- **Failover Logic**: On timeout, the engine retries with the next acquirer in priority order (max 3 attempts). Declines stop immediately (card issue).
- **In-Memory Store**: Thread-safe with `sync.RWMutex`, capped at 1000 transactions.
- **SSE Broker**: Channel-based client management with non-blocking broadcast.
- **Frontend State**: `useReducer` for centralized state, `EventSource` for real-time SSE updates with auto-reconnect.
