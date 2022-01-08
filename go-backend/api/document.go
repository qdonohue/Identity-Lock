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

	var approved []*models.User
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

	document := models.Document{Title: fileTitle, DocumentOwner: user.ID, LocalTitle: localTitle, ApprovedViewers: approved}

	result := db.DB.Create(&document)

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

func (api *Api) SetApprovedViewerList(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	r.ParseMultipartForm(32 << 20) // limit your max input length!

	docID := r.Form.Get("docID")
	authorizedUsers := r.Form.Get("contacts")
	contactIDs := strings.Split(authorizedUsers, ",")

	var approved []*models.User
	db.DB.Find(&approved, contactIDs)

	var doc models.Document
	db.DB.Where("id = ?", docID).Find(&doc)

	if doc.DocumentOwner != user.ID {
		w.WriteHeader(http.StatusUnauthorized)
	}

	// Again - ugly hack, but unclear WHY the stated documentation on association
	// for gorm doesn't work... and unfortunatley running out of time to get the site working.
	// If long term project, would've been worth fixing
	db.DB.Exec("DELETE FROM approved_documents WHERE document_id = ?", doc.ID)

	doc.ApprovedViewers = approved
	db.DB.Model(&doc).Updates(doc)

	// err := db.DB.Model(&doc).Association("approved_documents").Replace(approved)
	// if err != nil {
	// 	log.Println(err)
	// }

	w.WriteHeader(http.StatusOK)
}

type documentListDocument struct {
	Title           string                 `json:"name"`
	ID              uint                   `json:"id"`
	UploadedDate    string                 `json:"uploaded"`
	Author          string                 `json:"author"`
	Owner           bool                   `json:"owner"`
	ApprovedViewers []approvedUserListUser `json:"approved"`
}

type approvedUserListUser struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	ID    uint   `json:"id"`
}

func processApprovedUsersForList(uList []*models.User, uID uint) []approvedUserListUser {
	var final []approvedUserListUser

	for _, u := range uList {
		if u.ID == uID {
			continue
		}

		cur := approvedUserListUser{Email: u.Email, Name: u.Name, ID: u.ID}

		final = append(final, cur)
	}

	return final
}

func processDocument(d *models.Document, uID uint) documentListDocument {
	var curDoc models.Document
	db.DB.Preload("ApprovedViewers").Find(&curDoc)
	var cur documentListDocument

	cur.Title = d.Title
	cur.ID = d.ID

	date := d.CreatedAt
	cur.UploadedDate = fmt.Sprintf("%d/%d/%d", date.Month(), date.Day(), date.Year())

	var author models.User
	db.DB.Where("id = ?", d.DocumentOwner).Find(&author)

	cur.Author = author.Name

	cur.ApprovedViewers = processApprovedUsersForList(curDoc.ApprovedViewers, d.DocumentOwner)

	cur.Owner = (author.ID == uID)

	return cur
}

// Document name, sent, uploaded by (author), uploaded date
func processDocumentArrayForList(dList []*models.Document, uID uint) []documentListDocument {
	var final []documentListDocument

	for _, d := range dList {
		cur := processDocument(d, uID)
		final = append(final, cur)
	}

	return final
}

func (api *Api) GetDocuments(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	db.DB.Preload("Documents").Preload("ApprovedDocuments").Find(&user)

	combined := append(user.ApprovedDocuments, user.Documents...)

	body, err := json.Marshal(processDocumentArrayForList(combined, user.ID))
	if err != nil {
		log.Println("Error getting documents data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

func (api *Api) GetDocumentInformation(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	docID := r.URL.Query()["id"][0]

	var doc *models.Document
	db.DB.Preload("ApprovedViewers").Find(&doc, docID)

	found := doc.DocumentOwner == user.ID

	if !found {
		for _, p := range doc.ApprovedViewers {
			if p.ID == user.ID {
				found = true
				break
			}
		}
	}

	if !found {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("You don't have access to that document"))
		return
	}

	body, err := json.Marshal(processDocument(doc, user.ID))
	if err != nil {
		log.Println("Error getting documents data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

// Get request, w/ document uuid posted
func (api *Api) GetDocumentFile(w http.ResponseWriter, r *http.Request) {
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
