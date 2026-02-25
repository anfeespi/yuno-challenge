package acquirers

import "github.com/anfeespi/yuno-challenge/backend/models"

var Profiles = []models.AcquirerProfile{
	{
		Name:         "PagBrasil",
		SuccessRate:  0.95,
		TimeoutRate:  0.02,
		MinLatencyMs: 1000,
		MaxLatencyMs: 3000,
		Priority:     1,
	},
	{
		Name:         "StripeGlobal",
		SuccessRate:  0.88,
		TimeoutRate:  0.08,
		MinLatencyMs: 2000,
		MaxLatencyMs: 4000,
		Priority:     2,
	},
	{
		Name:         "MercadoPagoLATAM",
		SuccessRate:  0.85,
		TimeoutRate:  0.10,
		MinLatencyMs: 3000,
		MaxLatencyMs: 5000,
		Priority:     3,
	},
	{
		Name:         "CieloDirectBR",
		SuccessRate:  0.70,
		TimeoutRate:  0.25,
		MinLatencyMs: 6000,
		MaxLatencyMs: 10000,
		Priority:     4,
	},
}

// GetRoutingOrder returns acquirers sorted by priority, starting from the given primary.
func GetRoutingOrder(primaryIdx int) []models.AcquirerProfile {
	n := len(Profiles)
	order := make([]models.AcquirerProfile, 0, n)
	order = append(order, Profiles[primaryIdx])
	for i := 0; i < n; i++ {
		if i != primaryIdx {
			order = append(order, Profiles[i])
		}
	}
	return order
}
