package ml

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"path"
	"strconv"

	"github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face"
	"github.com/gofrs/uuid"
)

type Ml struct {
	faceClient              *face.Client
	groupName               string
	personGroupClient       *face.PersonGroupClient
	personGroupPersonClient *face.PersonGroupPersonClient
	context                 *context.Context
}

type ImageCheck struct {
	Permitted bool
	FaceCount int
}

func NewMl(client *face.Client, groupName string, personGroupClient *face.PersonGroupClient, personGroupPersonClient *face.PersonGroupPersonClient, context *context.Context) *Ml {

	return &Ml{faceClient: client, personGroupClient: personGroupClient, personGroupPersonClient: personGroupPersonClient, context: context}
}

func (ml *Ml) RegisterUserFace(io io.ReadCloser, sub string) uuid.UUID {
	user := face.NameAndUserDataContract{Name: &sub}

	userPerson, err := ml.personGroupPersonClient.Create(*ml.context, ml.groupName, user)
	if err != nil {
		log.Fatal("ERROR CREATING USER WITH SUB: %s", sub)
	}

	userID := userPerson.PersonID

	ml.personGroupPersonClient.AddFaceFromStream(*ml.context, ml.groupName, *userID, io, "", nil, face.Detection01)

	ml.personGroupClient.Train(*ml.context, ml.groupName)

	return *userID
}

func (ml *Ml) DetectFaceStream(io io.ReadCloser) ImageCheck {
	// Detect a face in an image that contains a single face
	// Array types chosen for the attributes of Face
	attributes := []face.AttributeType{"age", "emotion", "gender"}
	returnFaceID := true
	returnRecognitionModel := false
	returnFaceLandmarks := false

	// API call to detect faces in single-faced image, using recognition model 4
	// We specify detection model 1 because we are retrieving attributes.
	detectSingleFaces, dErr := ml.faceClient.DetectWithStream(*ml.context, io, &returnFaceID, &returnFaceLandmarks, attributes, face.Recognition01, &returnRecognitionModel, face.Detection01)
	if dErr != nil {
		log.Fatal(dErr)
	}

	// Dereference *[]DetectedFace, in order to loop through it.
	dFaces := *detectSingleFaces.Value

	if len(dFaces) > 0 {
		fmt.Println("Detected face in with ID(s): ")
		fmt.Println(dFaces[0].FaceID)
		fmt.Println()
	}
	// Find/display the age and gender attributes
	for _, dFace := range dFaces {
		fmt.Println("Face attributes:")
		fmt.Printf("  Age: %.0f", *dFace.FaceAttributes.Age)
		fmt.Println("\n  Gender: " + dFace.FaceAttributes.Gender)
	}

	faceCount := len(dFaces)

	permitted := faceCount == 1

	fmt.Println("Detected face count: ")
	fmt.Println(len(dFaces))

	return ImageCheck{Permitted: permitted, FaceCount: faceCount}

}

func (ml *Ml) DetectFace() {
	// Detect a face in an image that contains a single face
	singleFaceImageURL := "https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg"
	singleImageURL := face.ImageURL{URL: &singleFaceImageURL}
	singleImageName := path.Base(singleFaceImageURL)
	// Array types chosen for the attributes of Face
	attributes := []face.AttributeType{"age", "emotion", "gender"}
	returnFaceID := true
	returnRecognitionModel := false
	returnFaceLandmarks := false

	// API call to detect faces in single-faced image, using recognition model 4
	// We specify detection model 1 because we are retrieving attributes.
	detectSingleFaces, dErr := ml.faceClient.DetectWithURL(*ml.context, singleImageURL, &returnFaceID, &returnFaceLandmarks, attributes, face.Recognition01, &returnRecognitionModel, face.Detection01)
	if dErr != nil {
		log.Fatal(dErr)
	}

	// Dereference *[]DetectedFace, in order to loop through it.
	dFaces := *detectSingleFaces.Value

	fmt.Println("Detected face in (" + singleImageName + ") with ID(s): ")
	fmt.Println(dFaces[0].FaceID)
	fmt.Println()
	// Find/display the age and gender attributes
	for _, dFace := range dFaces {
		fmt.Println("Face attributes:")
		fmt.Printf("  Age: %.0f", *dFace.FaceAttributes.Age)
		fmt.Println("\n  Gender: " + dFace.FaceAttributes.Gender)
	}
	// Get/display the emotion attribute
	emotionStruct := *dFaces[0].FaceAttributes.Emotion
	// Convert struct to a map
	var emotionMap map[string]float64
	result, _ := json.Marshal(emotionStruct)
	json.Unmarshal(result, &emotionMap)
	// Find the emotion with the highest score (confidence level). Range is 0.0 - 1.0.
	var highest float64
	emotion := ""
	dScore := -1.0
	for name, value := range emotionMap {
		if value > highest {
			emotion, dScore = name, value
			highest = value
		}
	}
	fmt.Println("  Emotion: " + emotion + " (score: " + strconv.FormatFloat(dScore, 'f', 3, 64) + ")")

}
