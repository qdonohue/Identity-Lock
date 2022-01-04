package ml

import (
	"context"
	"io"
	"log"

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
	Permitted  bool
	Confidence float64
	FaceCount  int
}

func NewMl(client *face.Client, groupName string, personGroupClient *face.PersonGroupClient, personGroupPersonClient *face.PersonGroupPersonClient, context *context.Context) *Ml {

	return &Ml{faceClient: client, groupName: groupName, personGroupClient: personGroupClient, personGroupPersonClient: personGroupPersonClient, context: context}
}

// https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/e6202977ef87e1115bd79395d436ae22198586a9/go/Face/FaceQuickstart.go#L425
func (ml *Ml) RegisterUserFace(io io.ReadCloser, sub string) uuid.UUID {
	user := face.NameAndUserDataContract{Name: &sub}

	userPerson, err := ml.personGroupPersonClient.Create(*ml.context, ml.groupName, user)
	if err != nil {
		log.Println(err)
		log.Fatal("ERROR CREATING USER WITH SUB: ", sub)
	}

	userID := userPerson.PersonID

	ml.personGroupPersonClient.AddFaceFromStream(*ml.context, ml.groupName, *userID, io, "", nil, face.Detection01)

	ml.personGroupClient.Train(*ml.context, ml.groupName)

	return *userID
}

func (ml *Ml) DetectFaceStream(io io.ReadCloser) ImageCheck {
	// Detect a face in an image that contains a single face
	// Array types chosen for the attributes of Face
	attributes := []face.AttributeType{}
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

	faceCount := len(dFaces)

	permitted := faceCount == 1

	return ImageCheck{Permitted: permitted, FaceCount: faceCount}
}

func (ml *Ml) VerifyFaceFromStream(faceKey uuid.UUID, io io.ReadCloser) ImageCheck {
	// Detect a face in an image that contains a single face
	// Array types chosen for the attributes of Face
	attributes := []face.AttributeType{}
	returnFaceID := true
	returnRecognitionModel := false
	returnFaceLandmarks := false

	detectSingleFaces, dErr := ml.faceClient.DetectWithStream(*ml.context, io, &returnFaceID, &returnFaceLandmarks, attributes, face.Recognition01, &returnRecognitionModel, face.Detection01)
	if dErr != nil {
		log.Fatal(dErr)
	}

	// Dereference *[]DetectedFace, in order to loop through it.
	dFaces := *detectSingleFaces.Value

	faceCount := len(dFaces)

	if faceCount != 1 {
		return ImageCheck{Permitted: false, Confidence: float64(1), FaceCount: faceCount}
	}

	foundFace := dFaces[0]

	// At this point, we know that there is 1 user in the image - gotta verify it's the right one
	verifyRequest := face.VerifyFaceToPersonRequest{FaceID: foundFace.FaceID, PersonGroupID: &ml.groupName, PersonID: &faceKey}

	verifyResult, err := ml.faceClient.VerifyFaceToPerson(*ml.context, verifyRequest)
	if err != nil {
		log.Println("Error in face verification")
		log.Fatal(err)
	}

	return ImageCheck{Permitted: *verifyResult.IsIdentical, Confidence: *verifyResult.Confidence, FaceCount: faceCount}
}
