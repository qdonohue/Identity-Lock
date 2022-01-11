package main

import (
	"Identity-Lock/go-backend/app"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/ml"
	"context"
	"io/ioutil"
	"log"
	"os"

	"github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face"
	"github.com/Azure/go-autorest/autorest"
	"github.com/joho/godotenv"
)

func main() {
	// Load env variables
	err := godotenv.Load("environment")

	if err != nil {
		log.Fatalf("Error loading environment file")
	}

	err = db.Open()
	if err != nil {
		log.Fatalf("Error connecting to DB")
	}

	// DB SEED CODE:
	seedDBUsers()

	face_key := os.Getenv("FACE_SUBSCRIPTION_KEY")
	face_endpoint := os.Getenv("FACE_ENDPOINT")
	person_group_label := os.Getenv("PERSON_GROUP_LABEL")

	cnt := context.Background()

	// Face API setup
	client := face.NewClient(face_endpoint)
	client.Authorizer = autorest.NewCognitiveServicesAuthorizer(face_key)
	personGroupClient := face.NewPersonGroupClient(face_endpoint)
	personGroupClient.Authorizer = autorest.NewCognitiveServicesAuthorizer(face_key)

	// TERRIBLE HACK FOR LOCAL TESTING:
	personGroupClient.Delete(cnt, person_group_label)

	// SIMILARLY TERRIBLE HACK FOR LOCAL TESTING DOCUMENT UPLOAD
	dir, err := ioutil.TempDir(".", "documents")
	if err != nil {
		log.Fatal(err)
	}

	defer os.RemoveAll(dir)

	metadata := face.MetaDataContract{Name: &person_group_label}

	resp, err := personGroupClient.Create(cnt, person_group_label, metadata)
	if err != nil {
		log.Fatal(err)
	}

	if resp.StatusCode != 200 {
		log.Fatal("Error creating person group")
	}

	personGroupPersonClient := face.NewPersonGroupPersonClient(face_endpoint)
	personGroupPersonClient.Authorizer = autorest.NewCognitiveServicesAuthorizer(face_key)

	ml := ml.NewMl(&client, person_group_label, &personGroupClient, &personGroupPersonClient, &cnt)

	app := app.NewApp(ml, dir)

	log.Print("Starting server on port 8080")

	app.Run()
}
