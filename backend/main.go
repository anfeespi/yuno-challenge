package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/anfeespi/yuno-challenge/backend/handlers"
	"github.com/anfeespi/yuno-challenge/backend/sse"
	"github.com/anfeespi/yuno-challenge/backend/store"
)

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	memStore := store.NewMemoryStore()
	broker := sse.NewBroker()
	api := handlers.NewAPI(memStore, broker)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/health", api.Health)
	mux.HandleFunc("POST /api/simulate", api.Simulate)
	mux.HandleFunc("POST /api/simulate/auto", api.SimulateAuto)
	mux.HandleFunc("GET /api/transactions", api.GetTransactions)
	mux.HandleFunc("GET /api/transactions/{id}", api.GetTransaction)
	mux.HandleFunc("GET /api/metrics", api.GetMetrics)
	mux.HandleFunc("GET /api/stream", broker.ServeHTTP)

	handler := corsMiddleware(mux)

	addr := ":3001"
	fmt.Printf("VoltCommerce Failover Console API running on http://localhost%s\n", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}
