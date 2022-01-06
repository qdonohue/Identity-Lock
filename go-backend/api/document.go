package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
)

type DocumentResponse struct {
	Success bool
}

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

	contactIDs := strings.Split(authorizedUsers, ",")

	var approved []models.User
	db.DB.Find(&approved, contactIDs)

	f, err := ioutil.TempFile(api.tempDir, "")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()

	_, err = io.Copy(f, file)
	if err != nil {
		log.Fatal(err)
	}

	localTitle := f.Name()

	document := models.Document{Title: fileTitle, DocumentOwner: user.ID, LocalTitle: localTitle}

	result := db.DB.Create(&document)

	db.DB.Model(&document).Association("approved_documents").Append(approved)

	w.Header().Set("Content-Type", "application/json")

	if result.Error != nil {
		log.Println(result.Error)
		body, _ := json.Marshal(DocumentResponse{Success: false})
		w.WriteHeader(http.StatusBadRequest)
		w.Write(body)
	} else {
		body, _ := json.Marshal(DocumentResponse{Success: true})
		w.WriteHeader(http.StatusCreated)
		w.Write(body)
	}
}

func (api *Api) DeleteDocument(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	docID := r.URL.Query()["id"][0]

	var doc models.Document
	result := db.DB.Find(&doc, docID)

	w.Header().Set("Content-Type", "application/json")

	if result.RowsAffected == 0 || user.ID == doc.DocumentOwner {
		// Incredibly stupid, but funky behavior on foreign key delete (parent gets deleted?!) means SQL is easiest
		db.DB.Exec("DELETE FROM Documents where id = ?", docID)
		w.WriteHeader(http.StatusAccepted)
		body, _ := json.Marshal(DocumentResponse{Success: true})
		w.Write(body)
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		body, _ := json.Marshal(DocumentResponse{Success: false})
		w.Write(body)
	}

}

type DocumentListDocument struct {
	Title        string `json:"name"`
	ID           uint   `json:"id"`
	UploadedDate string `json:"uploaded"`
	Author       string `json:"author"`
	Sent         bool   `json:"distributed"`
}

// Document name, sent, uploaded by (author), uploaded date
func processDocumentArrayForList(dList []models.Document, author string) []DocumentListDocument {
	var final []DocumentListDocument

	for _, d := range dList {
		var cur DocumentListDocument

		cur.Title = d.Title
		cur.ID = d.ID

		date := d.CreatedAt
		cur.UploadedDate = fmt.Sprintf("%d/%d/%d", date.Month(), date.Day(), date.Year())

		cur.Author = author

		cur.Sent = (db.DB.Model(&d).Association("approved_documents").Count() > 0)

		final = append(final, cur)
	}

	return final
}

func (api *Api) GetDocuments(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	var documents []models.Document
	db.DB.Where("document_owner = ?", user.ID).Find(&documents)

	var approvedDocuments []models.Document
	db.DB.Model(&user).Association("approved_documents").Find(&approvedDocuments)

	body, err := json.Marshal(processDocumentArrayForList(append(documents, approvedDocuments...), user.Name))
	if err != nil {
		log.Println("Error getting documents data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

// Get request, w/ document uuid posted
func (api *Api) GetDocument(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	docID := r.URL.Query()["id"][0]

	var doc models.Document
	db.DB.Find(&doc, docID)

	found := doc.DocumentOwner == user.ID

	if !found {
		count := db.DB.Model(&user).Where("document_id = ?", doc).Association("approved_documents").Count()
		found = (count == 1)
	}

	if !found {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("You don't have access to that document"))
		return
	}

	http.ServeFile(w, r, doc.LocalTitle)
}
