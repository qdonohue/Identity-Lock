package models

import (
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email             string
	Sub               string
	Name              string
	Documents         []*Document `gorm:"foreignKey:DocumentOwner;constraint:OnDelete:SET NULL;"`
	ApprovedDocuments []*Document `gorm:"many2many:approved_documents;"`
	Contacts          []*User     `gorm:"many2many:contacts;"`
	Alerts            []*Alerts   `gorm:"foreignKey:DocumentOwner"`
	FaceKey           uuid.UUID
}

type Document struct {
	gorm.Model
	Title           string
	LocalTitle      string `json:"-"`
	DocumentOwner   uint
	ApprovedViewers []*User `gorm:"many2many:approved_documents;constraint:OnDelete:SET NULL;"`
}

type Alerts struct {
	gorm.Model
	Document      uint
	DocumentOwner uint
	Violator      uint
	Count         int
}

func MakeMigrations(db *gorm.DB) error {
	return db.AutoMigrate(&User{}, &Document{}, &Alerts{})
}
