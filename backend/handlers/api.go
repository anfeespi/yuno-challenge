package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/anfeespi/yuno-challenge/backend/engine"
	"github.com/anfeespi/yuno-challenge/backend/sse"
	"github.com/anfeespi/yuno-challenge/backend/store"
)

type API struct {
	Store  *store.MemoryStore
	Broker *sse.Broker

	autoMu   sync.Mutex
	autoStop chan struct{}
	autoOn   bool
}

func NewAPI(s *store.MemoryStore, b *sse.Broker) *API {
	return &API{Store: s, Broker: b}
}

func (a *API) Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (a *API) Simulate(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Count int `json:"count"`
	}
	json.NewDecoder(r.Body).Decode(&body)
	if body.Count <= 0 {
		body.Count = 1
	}
	if body.Count > 100 {
		body.Count = 100
	}

	transactions := make([]interface{}, 0, body.Count)
	for i := 0; i < body.Count; i++ {
		tx := engine.SimulateTransaction()
		a.Store.Add(tx)

		txJSON, _ := json.Marshal(tx)
		a.Broker.Broadcast("transaction", string(txJSON))

		metrics := a.Store.GetMetrics()
		metricsJSON, _ := json.Marshal(metrics)
		a.Broker.Broadcast("metrics", string(metricsJSON))

		transactions = append(transactions, tx)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"simulated": len(transactions),
		"transactions": transactions,
	})
}

func (a *API) SimulateAuto(w http.ResponseWriter, r *http.Request) {
	a.autoMu.Lock()
	defer a.autoMu.Unlock()

	if a.autoOn {
		close(a.autoStop)
		a.autoOn = false
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{"auto": false})
		return
	}

	a.autoStop = make(chan struct{})
	a.autoOn = true
	stop := a.autoStop

	go func() {
		ticker := time.NewTicker(2 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-stop:
				return
			case <-ticker.C:
				tx := engine.SimulateTransaction()
				a.Store.Add(tx)

				txJSON, _ := json.Marshal(tx)
				a.Broker.Broadcast("transaction", string(txJSON))

				metrics := a.Store.GetMetrics()
				metricsJSON, _ := json.Marshal(metrics)
				a.Broker.Broadcast("metrics", string(metricsJSON))
			}
		}
	}()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"auto": true})
}

func (a *API) GetTransactions(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	status := q.Get("status")
	acquirer := q.Get("acquirer")
	limit, _ := strconv.Atoi(q.Get("limit"))
	offset, _ := strconv.Atoi(q.Get("offset"))

	txs := a.Store.GetAll(status, acquirer, limit, offset)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(txs)
}

func (a *API) GetTransaction(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	tx := a.Store.GetByID(id)
	if tx == nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte(`{"error":"not found"}`))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tx)
}

func (a *API) GetMetrics(w http.ResponseWriter, r *http.Request) {
	metrics := a.Store.GetMetrics()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}
