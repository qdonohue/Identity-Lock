package models

import (
	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email      string `gorm:"index;unique"`
	Sub        string `gorm:"primaryKey"`
	Name       string
	Documents  []Document  `gorm:"foreignKey:ID"`
	Contacts   []User      `gorm:"foreignKey:Email"`
	Violations []Violation `gorm:"foreignKey:ID"`
	FaceKey    uuid.UUID
}

type Document struct {
	gorm.Model
	Title    string
	Owner    User   `gorm:"foreignKey:Email"`
	Approved []User `gorm:"foreignKey:Email"`
}

type Violation struct {
	gorm.Model
	Document Document `gorm:"foreignKey:ID"`
	Violator User     `gorm:"foreignKey:Email"`
}

func MakeMigrations(db *gorm.DB) error {
	return db.AutoMigrate(&User{}, &Document{}, &Violation{})
}
