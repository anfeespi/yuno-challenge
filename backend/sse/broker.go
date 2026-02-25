package sse

import (
	"fmt"
	"net/http"
	"sync"
)

type Client struct {
	ID     string
	Events chan string
}

type Broker struct {
	mu      sync.RWMutex
	clients map[string]*Client
	nextID  int
}

func NewBroker() *Broker {
	return &Broker{
		clients: make(map[string]*Client),
	}
}

func (b *Broker) AddClient() *Client {
	b.mu.Lock()
	b.nextID++
	client := &Client{
		ID:     fmt.Sprintf("client-%d", b.nextID),
		Events: make(chan string, 256),
	}
	b.clients[client.ID] = client
	b.mu.Unlock()
	return client
}

func (b *Broker) RemoveClient(id string) {
	b.mu.Lock()
	if client, ok := b.clients[id]; ok {
		close(client.Events)
		delete(b.clients, id)
	}
	b.mu.Unlock()
}

func (b *Broker) Broadcast(event string, data string) {
	b.mu.RLock()
	for _, client := range b.clients {
		msg := "event: " + event + "\ndata: " + data + "\n\n"
		select {
		case client.Events <- msg:
		default:
		}
	}
	b.mu.RUnlock()
}

func (b *Broker) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher, ok := w.(http.Flusher)
	if !ok {
		return
	}

	client := b.AddClient()
	defer b.RemoveClient(client.ID)

	fmt.Fprintf(w, "event: connected\ndata: %s\n\n", client.ID)
	flusher.Flush()

	ctx := r.Context()
	for {
		select {
		case msg, ok := <-client.Events:
			if !ok {
				return
			}
			fmt.Fprint(w, msg)
			flusher.Flush()
		case <-ctx.Done():
			return
		}
	}
}
