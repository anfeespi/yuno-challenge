import { useReducer, useCallback, useState } from "react";
import { useSSE } from "../hooks/useSSE";
import { simulateTransactions, toggleAutoSimulate, fetchTransactions, fetchMetrics } from "../lib/api";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={handleSimulate}
          disabled={simulating}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors cursor-pointer"
        >
          {simulating ? "Simulating..." : "Simulate 5"}
        </button>
        <button
          onClick={handleToggleAuto}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            state.autoOn
              ? "bg-red-600 hover:bg-red-500"
              : "bg-emerald-600 hover:bg-emerald-500"
          }`}
        >
          {state.autoOn ? "Stop Auto" : "Start Auto"}
        </button>
        <span className="text-sm text-gray-500">
          {state.transactions.length} transactions
        </span>
      </div>

      <AlertBanner metrics={state.metrics} />

      <AcquirerMetrics metrics={state.metrics} />

      <FilterBar filters={filters} onChange={setFilters} />

      <TransactionFeed
        transactions={state.transactions.filter((tx) => {
          if (filters.status && tx.status !== filters.status) return false;
          if (filters.acquirer && !tx.attempts.some((a) => a.acquirer === filters.acquirer)) return false;
          return true;
        })}
        onSelect={onSelectTransaction}
      />
    </div>
  );
}
