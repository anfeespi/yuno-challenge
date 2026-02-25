import { useState } from "react";
import Dashboard from "./components/Dashboard";
import TransactionDetail from "./components/TransactionDetail";

export default function App() {
  const [selectedTx, setSelectedTx] = useState(null);

  return (
    <div className="min-h-screen bg-surface-0 font-sans">
      {/* Gradient accent at top */}
      <div className="fixed top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-volt-500 to-transparent z-50" />

      <header className="sticky top-0 z-40 border-b border-border-subtle bg-surface-0/80 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-volt-500 to-violet-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8.5 1L3 9.5H7.5L7 15L13 6.5H8.5L9 1H8.5Z" fill="white" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">
                VoltCommerce
              </h1>
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-widest -mt-0.5">
                Failover Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-dot" />
            <span className="text-xs font-medium text-gray-400">Live</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        <Dashboard onSelectTransaction={setSelectedTx} />
      </main>

      <TransactionDetail
        transaction={selectedTx}
        onClose={() => setSelectedTx(null)}
      />
    </div>
  );
}
