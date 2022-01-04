package main

import (
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"fmt"
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

func seedDBUsers() {

	for i := 0; i < 5; i++ {
		rUUID, _ := randUUID.NewV4()
		validUUID, _ := uuid.FromString(rUUID.String())
		newUser := models.User{Email: randStringRunes(10), Name: fmt.Sprint(i), Sub: randStringRunes(4), FaceKey: validUUID}
		db.DB.Create(&newUser)
	}

}
