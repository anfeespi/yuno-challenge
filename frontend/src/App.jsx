import { useState } from "react";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [selectedTx, setSelectedTx] = useState(null);

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          VoltCommerce Failover Console
        </h1>
        <span className="text-xs text-gray-500">Real-time Payment Monitoring</span>
      </header>
      <main className="p-6">
        <Dashboard onSelectTransaction={setSelectedTx} />
      </main>
    </div>
  );
}
