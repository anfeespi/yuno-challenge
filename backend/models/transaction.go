package models

type Attempt struct {
	Acquirer       string `json:"acquirer"`
	Status         string `json:"status"` // approved, declined, timeout
	ResponseTimeMs int    `json:"responseTimeMs"`
	StartedAt      string `json:"startedAt"`
	EndedAt        string `json:"endedAt"`
	ErrorCode      string `json:"errorCode,omitempty"`
	ErrorMessage   string `json:"errorMessage,omitempty"`
}

type Transaction struct {
	ID          string    `json:"id"`
	Amount      float64   `json:"amount"`
	Currency    string    `json:"currency"`
	Status      string    `json:"status"` // approved, failed
	CardBrand   string    `json:"cardBrand"`
	CardLast4   string    `json:"cardLast4"`
	CreatedAt   string    `json:"createdAt"`
	CompletedAt string    `json:"completedAt"`
	Attempts    []Attempt `json:"attempts"`
}

type AcquirerProfile struct {
	Name           string  `json:"name"`
	SuccessRate    float64 `json:"successRate"`
	TimeoutRate    float64 `json:"timeoutRate"`
	MinLatencyMs   int     `json:"minLatencyMs"`
	MaxLatencyMs   int     `json:"maxLatencyMs"`
	Priority       int     `json:"priority"` // lower = higher priority
}

type AcquirerMetrics struct {
	Name         string  `json:"name"`
	SuccessRate  float64 `json:"successRate"`
	AvgLatencyMs float64 `json:"avgLatencyMs"`
	TimeoutRate  float64 `json:"timeoutRate"`
	TotalVolume  int     `json:"totalVolume"`
}
