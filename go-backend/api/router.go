package api

import (
	"Identity-Lock/go-backend/app_constants"

	"github.com/gorilla/mux"
)

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc(app_constants.USER_REGISTRATION_ENDPOINT, a.RegisterUser)
	r.HandleFunc(app_constants.USER_EXISTS_ENDPOINT, a.UserExists)
	r.HandleFunc("/api/detect", a.DetectFace)
}
