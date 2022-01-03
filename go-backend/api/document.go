package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func (api *Api) UploadDocument(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	file, _, err := r.FormFile("document")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	fileTitle := r.Form.Get("title")
	authorizedUsers := r.Form.Get("contacts")
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	// Unpacking authorized users, finding in DB
	var contacts []string
	err = json.Unmarshal([]byte(authorizedUsers), &contacts)
	if err != nil {
		log.Panicln(err)
	}

	var approved []models.User
	db.DB.Find(&approved, contacts)

	// Uploading file (LOCALLY FOR NOW)
	log.Println("File title name: " + fileTitle)
	log.Println("Api name: " + api.tempDir)
	f, err := ioutil.TempFile(api.tempDir, fileTitle)
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	_, err = io.Copy(f, file)
	if err != nil {
		log.Fatal(err)
	}

	localTitle := f.Name()
	log.Println("Final file name: " + localTitle)

	document := models.Document{Title: fileTitle, DocumentOwner: user.ID, Approved: approved, LocalTitle: localTitle}

	result := db.DB.Create(&document)

	type UploadResponse struct {
		Success bool
	}

	w.Header().Set("Content-Type", "application/json")

	if result.Error != nil {
		log.Println(result.Error)
		body, _ := json.Marshal(UploadResponse{Success: false})
		w.WriteHeader(http.StatusBadRequest)
		w.Write(body)
	} else {
		body, _ := json.Marshal(UploadResponse{Success: true})
		w.WriteHeader(http.StatusCreated)
		w.Write(body)
	}
}

func (api *Api) GetDocuments(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	var documents []models.Document
	db.DB.Find(&documents, user)

	body, err := json.Marshal(documents)
	if err != nil {
		log.Println("Error getting documents data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

// Get request, w/ document uuid posted
func (api *Api) GetDocument(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	docID := mux.Vars(r)["document_id"]

	var doc models.Document
	db.DB.Find(&doc, docID)

	found := false

	for _, u := range doc.Approved {
		if u.Sub == user.Sub {
			found = true
			break
		}
	}

	if !found {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("You don't have access to that document"))
		return
	}

	http.ServeFile(w, r, api.tempDir+doc.Title)
}
