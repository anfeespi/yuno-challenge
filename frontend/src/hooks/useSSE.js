import { useEffect, useRef } from "react";

export function useSSE(onTransaction, onMetrics) {
  const esRef = useRef(null);

  useEffect(() => {
    function connect() {
      const es = new EventSource("/api/stream");
      esRef.current = es;

      es.addEventListener("transaction", (e) => {
        try {
          const tx = JSON.parse(e.data);
          onTransaction(tx);
        } catch {}
      });

      es.addEventListener("metrics", (e) => {
        try {
          const m = JSON.parse(e.data);
          onMetrics(m);
        } catch {}
      });

      es.addEventListener("connected", () => {
        console.log("SSE connected");
      });

      es.onerror = () => {
        es.close();
        setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      if (esRef.current) {
        esRef.current.close();
      }
    };
  }, []);
}
