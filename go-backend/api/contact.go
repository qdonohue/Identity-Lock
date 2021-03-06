package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"encoding/json"
	"log"
	"net/http"
)

type ContactResponse struct {
	Success bool
}

func (api *Api) AddContact(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	contactID := r.URL.Query()["id"][0]

	var newContact models.User
	db.DB.Where("id = ?", contactID).Find(&newContact)

	err := db.DB.Model(&user).Association("Contacts").Append(&newContact)
	if err != nil {
		log.Println("Error in creating association")
		log.Println(err)
	}

	body, _ := json.Marshal(ContactResponse{Success: true})

	w.WriteHeader(http.StatusCreated)

	w.Write(body)
}

func (api *Api) RemoveContact(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	contactID := r.URL.Query()["id"][0]

	var removeContact models.User
	db.DB.Where("id = ?", contactID).Find(&removeContact)

	err := db.DB.Model(&user).Association("Contacts").Delete(&removeContact)
	if err != nil {
		log.Println(err)
	}

	body, _ := json.Marshal(ContactResponse{Success: true})

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

type ContactListContact struct {
	Id              uint   `json:"id"`
	Name            string `json:"name"`
	Email           string `json:"email"`
	CurrrentContact bool   `json:"currentContact"`
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
		if c.ID == u.ID {
			continue
		}

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

func processUserContactsForList(cList []models.User, userID uint) []ContactListContact {
	var final []ContactListContact

	for _, c := range cList {
		if c.ID == userID {
			continue
		}
		cur := ContactListContact{Name: c.Name, Email: c.Email, CurrrentContact: true, Id: c.ID}
		final = append(final, cur)
	}

	return final
}

func (api *Api) GetUserContacts(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	var contacts []models.User
	db.DB.Model(&user).Association("Contacts").Find(&contacts)

	body, err := json.Marshal(processUserContactsForList(contacts, user.ID))
	if err != nil {
		log.Println("Error in contact JSON")
	}

	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

func (api *Api) GetContact(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	contactID := r.URL.Query()["id"][0]

	var contact models.User
	db.DB.Where("id = ?", contactID).Find(&contact)

	// Check for if existing contact
	var currentAssociations []models.User

	db.DB.Model(&user).Association("Contacts").Find(&currentAssociations)

	currentContact := false

	for _, p := range currentAssociations {
		if p.ID == contact.ID {
			currentContact = true
			break
		}
	}

	processed := ContactListContact{Name: contact.Name, Id: contact.ID, Email: contact.Email, CurrrentContact: currentContact}

	body, _ := json.Marshal(processed)

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}
