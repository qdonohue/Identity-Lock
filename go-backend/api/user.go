package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"io"
	"log"
	"net/http"

	"gopkg.in/square/go-jose.v2/json"
	"gorm.io/gorm"
)

func (api *Api) RegisterUser(w http.ResponseWriter, r *http.Request) {
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
		log.Println("Error marshelling user exists data")
	}
	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

func (api *Api) GetContacts(w http.ResponseWriter, r *http.Request) {

}
