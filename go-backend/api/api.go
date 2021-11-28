package api

import (
	"Identity-Lock/go-backend/ml"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gopkg.in/square/go-jose.v2/json"
)

type Api struct {
	ml *ml.Ml
}

func NewApi(ml *ml.Ml) *Api {
	return &Api{ml: ml}
}

const USER_REGISTRATION_ENDPOINT string = "/api/register"

func (api *Api) RegisterUser(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("You tried to register"))
}

func (api *Api) DetectFace(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	file, _, err := r.FormFile("image")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	rc := io.NopCloser(file)

	analysis := api.ml.DetectFaceStream(rc)

	fmt.Println("analysis data")
	fmt.Println(analysis)

	body, err := json.Marshal(analysis)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("analysis data")
	fmt.Println(body)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc(USER_REGISTRATION_ENDPOINT, a.RegisterUser)
	r.HandleFunc("/api/detect", a.DetectFace)
}
