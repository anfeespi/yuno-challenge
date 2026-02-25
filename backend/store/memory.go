package store

import (
	"sort"
	"strings"
	"sync"

	"github.com/anfeespi/yuno-challenge/backend/models"
)

type MemoryStore struct {
	mu           sync.RWMutex
	transactions []*models.Transaction
	maxSize      int
}

func NewMemoryStore() *MemoryStore {
	return &MemoryStore{
		transactions: make([]*models.Transaction, 0),
		maxSize:      1000,
	}
}

func (s *MemoryStore) Add(tx *models.Transaction) {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.transactions = append([]*models.Transaction{tx}, s.transactions...)

	if len(s.transactions) > s.maxSize {
		s.transactions = s.transactions[:s.maxSize]
	}
}

func (s *MemoryStore) GetAll(status, acquirer string, limit, offset int) []*models.Transaction {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var filtered []*models.Transaction

	for _, tx := range s.transactions {
		if status != "" && !strings.EqualFold(tx.Status, status) {
			continue
		}

		if acquirer != "" {
			found := false
			for _, a := range tx.Attempts {
				if strings.EqualFold(a.Acquirer, acquirer) {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}

		filtered = append(filtered, tx)
	}

	if limit <= 0 {
		limit = 50
	}

	if offset > len(filtered) {
		return []*models.Transaction{}
	}

	filtered = filtered[offset:]

	if limit > len(filtered) {
		limit = len(filtered)
	}

	result := make([]*models.Transaction, limit)
	copy(result, filtered[:limit])

	return result
}

func (s *MemoryStore) GetByID(id string) *models.Transaction {
	s.mu.RLock()
	defer s.mu.RUnlock()

	for _, tx := range s.transactions {
		if tx.ID == id {
			return tx
		}
	}

	return nil
}

type aggregator struct {
	total        int
	successes    int
	timeouts     int
	totalLatency int
}

func (s *MemoryStore) GetMetrics() []models.AcquirerMetrics {
	s.mu.RLock()
	defer s.mu.RUnlock()

	aggs := make(map[string]*aggregator)

	for _, tx := range s.transactions {
		for _, attempt := range tx.Attempts {
			agg, ok := aggs[attempt.Acquirer]
			if !ok {
				agg = &aggregator{}
				aggs[attempt.Acquirer] = agg
			}

			agg.total++
			if attempt.Status == "approved" {
				agg.successes++
			}
			if attempt.Status == "timeout" {
				agg.timeouts++
			}
			agg.totalLatency += attempt.ResponseTimeMs
		}
	}

	metrics := make([]models.AcquirerMetrics, 0, len(aggs))

	for name, agg := range aggs {
		m := models.AcquirerMetrics{
			Name:        name,
			TotalVolume: agg.total,
		}

		if agg.total > 0 {
			m.SuccessRate = float64(agg.successes) / float64(agg.total)
			m.TimeoutRate = float64(agg.timeouts) / float64(agg.total)
			m.AvgLatencyMs = float64(agg.totalLatency) / float64(agg.total)
		}

		metrics = append(metrics, m)
	}

	sort.Slice(metrics, func(i, j int) bool {
		return metrics[i].Name < metrics[j].Name
	})

	return metrics
}
