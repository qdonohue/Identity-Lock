package models

import (
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email      string
	Sub        string
	Name       string
	Documents  []Document  `gorm:"foreignKey:DocumentOwner;constraint:OnDelete:SET NULL;"`
	Contacts   []User      `gorm:"foreignKey:ID"`
	Violations []Violation `gorm:"foreignKey:Violator"`
	FaceKey    uuid.UUID
}

type Document struct {
	gorm.Model
	Title         string
	LocalTitle    string `json:"-"`
	DocumentOwner uint
	// Approved does NOT include document owner
	Approved []User `gorm:"foreignKey:ID"`
}

type Violation struct {
	gorm.Model
	Document Document `gorm:"foreignKey:ID"`
	Violator uint
}

func MakeMigrations(db *gorm.DB) error {
	return db.AutoMigrate(&User{}, &Document{}, &Violation{})
}
