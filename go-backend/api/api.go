package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/ml"
	"Identity-Lock/go-backend/models"
	"io"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gopkg.in/square/go-jose.v2/json"
	"gorm.io/gorm"
)

type Api struct {
	ml *ml.Ml
}

func NewApi(ml *ml.Ml) *Api {
	return &Api{ml: ml}
}

func (api *Api) RegisterUser(w http.ResponseWriter, r *http.Request) {
	// User name
	// Email address
	// Sub (already have)
	// Photo?
	r.ParseMultipartForm(32 << 20)

	sub := r.Context().Value(app_constants.ContextSubKey).(string)

	img, _, err := r.FormFile("image")
	if err != nil {
		log.Fatal(err)
	}

	io := io.NopCloser(img)
	faceID := api.ml.RegisterUserFace(io, sub)

	log.Println(faceID)

	name := r.Form.Get("name")
	email := r.Form.Get("email")

	user := models.User{Email: email, Name: name, Sub: sub, FaceKey: faceID}

	result := db.DB.Create(&user)

	if result.Error != nil {
		log.Fatal(result.Error)
		http.Error(w, "User registration error in DB", http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusCreated)

	w.Write([]byte("User registered successfully"))
}

func (api *Api) UserExists(w http.ResponseWriter, r *http.Request) {
	sub := r.Context().Value(app_constants.ContextSubKey).(string)

	var user models.User
	err := db.DB.Where("sub = ?", sub).First(&user).Error

	registered := (err != gorm.ErrRecordNotFound)
	data := map[string]bool{"Registered": registered}
	body, err := json.Marshal(data)
	if err != nil {
		log.Println("Error marshelling suer exists data")
	}
	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

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

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc(app_constants.USER_REGISTRATION_ENDPOINT, a.RegisterUser)
	r.HandleFunc(app_constants.USER_EXISTS_ENDPOINT, a.UserExists)
	r.HandleFunc("/api/detect", a.DetectFace)
}
