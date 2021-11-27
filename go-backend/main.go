package main

import (
	"Identity-Lock/go-backend/app"
	"log"

	"github.com/joho/godotenv"
)

func main() {
	// Load env variables
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	app := app.NewApp()

	log.Print("Starting server on port 8080")

	app.Run()
}
