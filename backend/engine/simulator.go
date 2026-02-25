package engine

import (
	"fmt"
	"math/rand"
	"time"

	"github.com/anfeespi/yuno-challenge/backend/acquirers"
	"github.com/anfeespi/yuno-challenge/backend/models"
)

func SimulateTransaction() *models.Transaction {
	id := fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		rand.Int63n(0xFFFFFFFF),
		rand.Int63n(0xFFFF),
		rand.Int63n(0xFFFF),
		rand.Int63n(0xFFFF),
		rand.Int63n(0xFFFFFFFFFFFF),
	)

	amount := float64(rand.Intn(499001)+1000) / 100.0
	amountStr := fmt.Sprintf("%.2f", amount)
	fmt.Sscanf(amountStr, "%f", &amount)

	currencies := []string{"USD", "BRL", "MXN", "COP"}
	currency := currencies[rand.Intn(len(currencies))]

	cardBrands := []string{"Visa", "Mastercard", "Amex"}
	cardBrand := cardBrands[rand.Intn(len(cardBrands))]

	cardLast4 := fmt.Sprintf("%04d", rand.Intn(10000))

	primaryIdx := rand.Intn(len(acquirers.Profiles))
	routingOrder := acquirers.GetRoutingOrder(primaryIdx)

	createdAt := time.Now().UTC().Format(time.RFC3339Nano)

	tx := &models.Transaction{
		ID:        id,
		Amount:    amount,
		Currency:  currency,
		CardBrand: cardBrand,
		CardLast4: cardLast4,
		CreatedAt: createdAt,
		Attempts:  []models.Attempt{},
	}

	maxAttempts := 3
	if len(routingOrder) < maxAttempts {
		maxAttempts = len(routingOrder)
	}

	for i := 0; i < maxAttempts; i++ {
		profile := routingOrder[i]

		startedAt := time.Now().UTC()

		roll := rand.Float64()

		var status, errorCode, errorMessage string

		if roll < profile.TimeoutRate {
			status = "timeout"
			errorCode = "TIMEOUT"
			errorMessage = "Request timed out"
		} else if roll < profile.TimeoutRate+(1-profile.SuccessRate-profile.TimeoutRate) {
			status = "declined"
			errorCode = "DECLINED"
			errorMessage = "Card declined by issuer"
		} else {
			status = "approved"
		}

		responseTimeMs := rand.Intn(profile.MaxLatencyMs-profile.MinLatencyMs) + profile.MinLatencyMs

		endedAt := startedAt.Add(time.Duration(responseTimeMs) * time.Millisecond)

		attempt := models.Attempt{
			Acquirer:       profile.Name,
			Status:         status,
			ErrorCode:      errorCode,
			ErrorMessage:   errorMessage,
			ResponseTimeMs: responseTimeMs,
			StartedAt:      startedAt.Format(time.RFC3339Nano),
			EndedAt:        endedAt.Format(time.RFC3339Nano),
		}

		tx.Attempts = append(tx.Attempts, attempt)

		if status == "approved" {
			tx.Status = "approved"
			break
		}
		if status == "declined" {
			tx.Status = "failed"
			break
		}
		// timeout → continue to next acquirer
	}

	if tx.Status == "" {
		tx.Status = "failed"
	}

	tx.CompletedAt = time.Now().UTC().Format(time.RFC3339Nano)

	return tx
}
