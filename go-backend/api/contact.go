package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"log"
	"net/http"
)

func (api *Api) AddContact(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)

	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	contactID := r.Form.Get("id")

	var newContact models.User
	db.DB.Where("id = ?", contactID).First(&newContact)

	result := db.DB.Model(&curUser).Association("Contacts").Append(&newContact)
	if result.Error != nil {
		log.Println(result.Error)
		http.Error(w, "Error adding contact", http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusCreated)

	w.Write([]byte("Contact added successfully"))
}

func (api *Api) RemoveContact(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)

	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	contactID := r.Form.Get("id")

	var removeContact models.User
	db.DB.Where("id = ?", contactID).First(&removeContact)

	result := db.DB.Model(&curUser).Association("Contacts").Delete(&removeContact)
	if result.Error != nil {
		log.Println(result.Error)
		http.Error(w, "Error removing contact", http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusCreated)

	w.Write([]byte("Contact removed successfully"))
}

// Document name, sent, uploaded by (author), uploaded date
// func processDocumentArrayForList(dList []models.Document, author string) []DocumentListDocument {
// 	var final []DocumentListDocument

// 	for _, d := range dList {
// 		var cur DocumentListDocument

// 		cur.Title = d.Title
// 		cur.ID = d.ID

// 		date := d.CreatedAt
// 		cur.UploadedDate = fmt.Sprintf("%d/%d/%d", date.Month(), date.Day(), date.Year())

// 		cur.Author = author

// 		cur.Sent = (len(d.Approved) > 0)

// 		final = append(final, cur)
// 	}

// 	return final
// }

// func (api *Api) SearchContacts(w http.ResponseWriter, r *http.Request) {
// 	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

// 	var contacts []models.User
// 	db.

// 	body, err := json.Marshal(processDocumentArrayForList(documents, user.Name))
// 	if err != nil {
// 		log.Println("Error getting documents data")
// 	}

// 	w.WriteHeader(http.StatusOK)

// 	w.Write(body)
// }
