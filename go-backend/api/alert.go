package api

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

type AlertListAlert struct {
	ID           uint   `json:"id"`
	DocumentName string `json:"documentname"`
	Violator     string `json:"violatorname"`
	ViolatorID   uint   `json:"violatorID"`
	Date         string `json:"date"`
	Count        int    `json:"count"`
}

func processAlert(a *models.Alerts, u models.User) AlertListAlert {
	var doc models.Document
	db.DB.Where("id = ?", a.Document).Find(&doc)

	cur := AlertListAlert{ID: a.ID, DocumentName: doc.Title, Violator: u.Name, ViolatorID: u.ID, Count: a.Count}

	date := a.UpdatedAt
	cur.Date = fmt.Sprintf("%d/%d/%d", date.Month(), date.Day(), date.Year())

	return cur
}

func processAlertArrayForList(aList []*models.Alerts, u models.User) []AlertListAlert {
	var final []AlertListAlert

	for _, a := range aList {
		final = append(final, processAlert(a, u))

	}

	return final
}

func (api *Api) GetAlerts(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	var alerts []*models.Alerts
	db.DB.Where("document_owner = ?", user.ID).Find(&alerts)

	body, err := json.Marshal(processAlertArrayForList(alerts, user))
	if err != nil {
		log.Println("Error getting alerts data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

func (api *Api) GetAlertInfo(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)

	alertID := r.URL.Query()["id"][0]

	var alert *models.Alerts
	db.DB.Where("id = ?", alertID).Find(&alert)

	if alert.DocumentOwner != user.ID {
		w.WriteHeader(http.StatusForbidden)
		w.Write([]byte("Only the document owner can see alerts"))
		return
	}

	body, err := json.Marshal(processAlert(alert, user))
	if err != nil {
		log.Println("Error getting alert data")
	}

	w.WriteHeader(http.StatusOK)

	w.Write(body)
}

func (api *Api) CreateOrUpdateAlert(w http.ResponseWriter, r *http.Request) {
	user := r.Context().Value(app_constants.ContextUserKey).(models.User)
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	documentID := r.Form.Get("documentID")

	// Check if the alert exists
	type Result struct {
		ID    uint
		Count int
	}

	var res Result
	// tx := db.DB.Where("violator = ? AND document = ?", user.ID, documentID).Find(&existingAlert)
	tx := db.DB.Raw("SELECT id, count from alerts where violator = ? AND document = ?", user.ID, documentID).Scan(&res)

	log.Println(tx.RowsAffected)

	if tx.RowsAffected == 1 {
		var existingAlert models.Alerts
		db.DB.Where("id = ?", res.ID).Find(&existingAlert)
		log.Println("existing alert found")
		log.Println(existingAlert)
		db.DB.Model(&existingAlert).Where("id = ?", existingAlert.ID).Update("count", (res.Count + 1))
		w.WriteHeader(http.StatusOK)
	} else {
		log.Println("Novel alert found")
		var document models.Document
		db.DB.Find(&document, documentID)

		log.Println(document)

		// Do what you want if it's your document...
		if document.DocumentOwner == user.ID {
			w.WriteHeader(http.StatusOK)
			return
		}

		alert := models.Alerts{Document: document.ID, DocumentOwner: document.DocumentOwner, Violator: user.ID, Count: 1}

		db.DB.Create(&alert)
		w.WriteHeader(http.StatusCreated)
	}
}

func (api *Api) DeleteAlert(w http.ResponseWriter, r *http.Request) {
}
