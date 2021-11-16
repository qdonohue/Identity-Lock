package main

import (
	"Identity-Lock/go-backend/middleware"

	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func pong(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/ping", pong)

	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.AuthMiddleware)

	log.Print("Starting server on port 8080")
	// handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(r)

	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(r)))
	// log.Fatal(http.ListenAndServe(":8080", r))
}
