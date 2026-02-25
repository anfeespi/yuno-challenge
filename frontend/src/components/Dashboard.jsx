import { useReducer, useCallback, useState } from "react";
import { useSSE } from "../hooks/useSSE";
import { simulateTransactions, toggleAutoSimulate } from "../lib/api";
import TransactionFeed from "./TransactionFeed";
import AcquirerMetrics from "./AcquirerMetrics";
import AlertBanner from "./AlertBanner";
import FilterBar from "./FilterBar";

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions].slice(0, 200),
      };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };
    case "SET_METRICS":
      return { ...state, metrics: action.payload };
    case "SET_AUTO":
      return { ...state, autoOn: action.payload };
    default:
      return state;
  }
}

export default function Dashboard({ onSelectTransaction }) {
  const [state, dispatch] = useReducer(reducer, {
    transactions: [],
    metrics: [],
    autoOn: false,
  });
  const [simulating, setSimulating] = useState(false);
  const [filters, setFilters] = useState({ status: "", acquirer: "" });

  const handleTransaction = useCallback((tx) => {
    dispatch({ type: "ADD_TRANSACTION", payload: tx });
  }, []);

  const handleMetrics = useCallback((m) => {
    dispatch({ type: "SET_METRICS", payload: m });
  }, []);

  useSSE(handleTransaction, handleMetrics);

  async function handleSimulate() {
    setSimulating(true);
    try {
      await simulateTransactions(5);
    } finally {
      setSimulating(false);
    }
  }

  async function handleToggleAuto() {
    const res = await toggleAutoSimulate();
    dispatch({ type: "SET_AUTO", payload: res.auto });
  }

  const filtered = state.transactions.filter((tx) => {
    if (filters.status && tx.status !== filters.status) return false;
    if (filters.acquirer && !tx.attempts.some((a) => a.acquirer === filters.acquirer))
      return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="group relative px-5 py-2.5 bg-volt-600 hover:bg-volt-500 disabled:opacity-50 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer shadow-lg shadow-volt-500/20 hover:shadow-volt-500/30"
          >
            <span className="relative z-10">
              {simulating ? "Simulating..." : "Simulate 5"}
            </span>
          </button>
          <button
            onClick={handleToggleAuto}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
              state.autoOn
                ? "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
                : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
            }`}
          >
            {state.autoOn ? "Stop Auto" : "Start Auto"}
          </button>
        </div>
        <span className="text-sm font-medium text-gray-500 font-mono">
          {state.transactions.length} transactions
        </span>
      </div>

      {/* Alerts */}
      <AlertBanner metrics={state.metrics} />

      {/* Metrics */}
      <AcquirerMetrics metrics={state.metrics} />

      {/* Feed section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
            Transaction Feed
          </h2>
          <FilterBar filters={filters} onChange={setFilters} />
        </div>
        <TransactionFeed
          transactions={filtered}
          onSelect={onSelectTransaction}
        />
      </div>
    </div>
  );
}
