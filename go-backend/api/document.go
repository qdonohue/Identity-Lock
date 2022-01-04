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

		cur.Sent = (len(d.Approved) > 0)

		final = append(final, cur)
	}

	return final
}

func (api *Api) GetDocuments(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	var documents []models.Document
	db.DB.Where("document_owner = ?", user.ID).Find(&documents)

	body, err := json.Marshal(processDocumentArrayForList(documents, user.Name))
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

	// TODO: Ensure security
	found := doc.DocumentOwner == user.ID

	for _, u := range doc.Approved {
		if u.ID == user.ID {
			found = true
			break
		}
	}

	if !found {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("You don't have access to that document"))
		return
	}

	http.ServeFile(w, r, doc.LocalTitle)
}
