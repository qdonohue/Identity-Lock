package api

import (
	"Identity-Lock/go-backend/app_constants"

	"github.com/gorilla/mux"
)

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc(app_constants.USER_REGISTRATION_ENDPOINT, a.RegisterUser)
	r.HandleFunc(app_constants.USER_EXISTS_ENDPOINT, a.UserExists)
	r.HandleFunc("/api/detect", a.DetectFace).Methods("POST")
	r.HandleFunc("/api/upload", a.UploadDocument).Methods("POST")
	r.HandleFunc("/api/getdocuments", a.GetDocuments).Methods("GET")
	r.HandleFunc("/api/getdocumentinfo", a.GetDocumentInformation).Methods("GET")
	r.HandleFunc("/api/getdocument", a.GetDocumentFile).Methods("GET")
	r.HandleFunc("/api/deletedocument", a.DeleteDocument).Methods("GET")
	r.HandleFunc("/api/setviewers", a.SetApprovedViewerList).Methods("POST")
	r.HandleFunc("/api/searchallcontacts", a.SearchAllContacts).Methods("GET")
	r.HandleFunc("/api/searchusercontacts", a.SearchAllContacts).Methods("GET")
	r.HandleFunc("/api/getcontact", a.GetContact).Methods("GET")
	r.HandleFunc("/api/getcontacts", a.GetUserContacts).Methods("GET")
	r.HandleFunc("/api/addcontact", a.AddContact)
	r.HandleFunc("/api/removecontact", a.RemoveContact)
	r.HandleFunc("/api/getalerts", a.GetAlerts).Methods("GET")
	r.HandleFunc("/api/getalert", a.GetAlertInfo).Methods("GET")
	r.HandleFunc("/api/createalert", a.CreateOrUpdateAlert)
}
