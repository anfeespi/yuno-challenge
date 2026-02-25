import { useEffect, useRef } from "react";

export function useSSE(onTransaction, onMetrics) {
  const onTxRef = useRef(onTransaction);
  const onMetricsRef = useRef(onMetrics);
  const esRef = useRef(null);

  useEffect(() => { onTxRef.current = onTransaction; }, [onTransaction]);
  useEffect(() => { onMetricsRef.current = onMetrics; }, [onMetrics]);

  useEffect(() => {
    let cancelled = false;

    function connect() {
      if (cancelled) return;
      const es = new EventSource("/api/stream");
      esRef.current = es;

      es.addEventListener("transaction", (e) => {
        try {
          const tx = JSON.parse(e.data);
          onTxRef.current(tx);
        } catch (err) {
          console.warn("Failed to parse SSE transaction event:", err);
        }
      });

      es.addEventListener("metrics", (e) => {
        try {
          const m = JSON.parse(e.data);
          onMetricsRef.current(m);
        } catch (err) {
          console.warn("Failed to parse SSE metrics event:", err);
        }
      });

      es.addEventListener("connected", () => {
        console.log("SSE connected");
      });

      es.onerror = () => {
        es.close();
        if (!cancelled) setTimeout(connect, 3000);
      };
    }

    connect();

    return () => {
      cancelled = true;
      if (esRef.current) {
        esRef.current.close();
      }
    };
  }, []);
}
