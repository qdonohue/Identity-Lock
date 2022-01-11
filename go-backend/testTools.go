package main

import (
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"math/rand"

	"github.com/gofrs/uuid"
	randUUID "github.com/nu7hatch/gouuid"
)

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randStringRunes(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}

var demoNames = []string{"Sarah", "Julian", "Thomas", "Nancy", "Bob"}
var demoEmails = []string{"Sarah@gmail.com", "Julian@gmail.com", "Thomas@gmail.com", "Nancy@gmail.com", "Bob@gmail.com"}

func seedDBUsers() {

	for i := 0; i < 5; i++ {
		rUUID, _ := randUUID.NewV4()
		validUUID, _ := uuid.FromString(rUUID.String())
		newUser := models.User{Email: demoEmails[i], Name: demoNames[i], Sub: randStringRunes(4), FaceKey: validUUID}
		db.DB.Create(&newUser)
	}

}
