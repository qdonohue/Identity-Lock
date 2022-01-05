package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"encoding/json"
	"log"
	"net/http"
)

func (api *Api) AddContact(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20)

	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	contactID := r.Form.Get("id")

	var newContact models.User
	tx := db.DB.Where("id = ?", contactID).First(&newContact)
	if tx.Error != nil {
		log.Fatal(tx.Error)
	}

	err := db.DB.Model(&user).Association("Contacts").Append(&newContact)
	if err != nil {
		log.Fatal(err)
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

	err := db.DB.Model(&user).Association("Contacts").Delete(&removeContact)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Error removing contact", http.StatusBadRequest)
	}

	w.WriteHeader(http.StatusCreated)

	w.Write([]byte("Contact removed successfully"))
}

type ContactListContact struct {
	Id              uint   `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	CurrrentContact bool   `json:"status"`
}

func currentContact(associations []uint, id uint) bool {

	for _, i := range associations {
		if i == id {
			return true
		}
	}

	return false
}

// Document name, sent, uploaded by (author), uploaded date
func processContactArrayForList(cList []models.User, u models.User) []ContactListContact {
	var final []ContactListContact

	var currentAssociations []models.User

	db.DB.Model(&u).Association("Contacts").Find(&currentAssociations)

	var extractedIDs []uint

	for _, cur := range currentAssociations {
		extractedIDs = append(extractedIDs, cur.ID)
	}

	for _, c := range cList {

		cur := ContactListContact{Id: c.ID, Name: c.Name, Email: c.Email, CurrrentContact: currentContact(extractedIDs, c.ID)}

		final = append(final, cur)
	}

	return final
}

// TODO: Add in email search functionality
func (api *Api) SearchAllContacts(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	searchString := r.URL.Query()["searchString"][0] + "%"

	var searchResults []models.User
	db.DB.Where("name like ?", searchString).Find(&searchResults)

	body, err := json.Marshal(processContactArrayForList(searchResults, user))
	if err != nil {
		log.Println("Error getting contacts data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

func processUserContactsForList(cList []models.User) []ContactListContact {
	var final []ContactListContact

	for _, c := range cList {
		cur := ContactListContact{Name: c.Name, Email: c.Email, CurrrentContact: true}
		final = append(final, cur)
	}

	return final
}

func (api *Api) GetUserContacts(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	var contacts []models.User
	db.DB.Model(&user).Association("Contacts").Find(&contacts)

	body, err := json.Marshal(processUserContactsForList(contacts))
	if err != nil {
		log.Println("Error in contact JSON")
	}

	w.WriteHeader(http.StatusOK)
	w.Write(body)
}
