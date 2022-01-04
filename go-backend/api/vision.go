package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/models"
	"io"
	"log"
	"net/http"

	"gopkg.in/square/go-jose.v2/json"
)

func (api *Api) DetectFace(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	file, _, err := r.FormFile("image")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	rc := io.NopCloser(file)

	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	analysis := api.ml.VerifyFaceFromStream(user.FaceKey, rc)

	body, err := json.Marshal(analysis)

	if err != nil {
		log.Fatal(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}
