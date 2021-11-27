package main

import (
	"Identity-Lock/go-backend/api"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// Load env variables
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	app := api.NewApp()

	log.Print("Starting server on port 8080")

	app.Run()
}
