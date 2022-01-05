package api

import (
	"Identity-Lock/go-backend/app_constants"

	"github.com/gorilla/mux"
)

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc(app_constants.USER_REGISTRATION_ENDPOINT, a.RegisterUser)
	r.HandleFunc(app_constants.USER_EXISTS_ENDPOINT, a.UserExists)
	r.HandleFunc("/api/detect", a.DetectFace)
	r.HandleFunc("/api/upload", a.UploadDocument)
	r.HandleFunc("/api/getdocuments", a.GetDocuments).Methods("GET")
	r.HandleFunc("/api/getdocument", a.GetDocument).Methods("GET")
	r.HandleFunc("/api/deletedocument", a.DeleteDocument).Methods("GET")
	r.HandleFunc("/api/searchallcontacts", a.SearchAllContacts).Methods("GET")
	r.HandleFunc("/api/searchusercontacts", a.SearchAllContacts).Methods("GET")
	r.HandleFunc("/api/getcontact", a.GetContact).Methods("GET")
	r.HandleFunc("/api/getcontacts", a.GetUserContacts).Methods("GET")
	r.HandleFunc("/api/addcontact", a.AddContact)
	r.HandleFunc("/api/removecontact", a.RemoveContact)
}
