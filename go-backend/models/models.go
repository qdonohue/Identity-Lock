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
	Contacts   []User      `gorm:"foreignKey:Sub"`
	Violations []Violation `gorm:"foreignKey:ID"`
	FaceKey    uuid.UUID
}

type Document struct {
	gorm.Model
	Title    string
	Owner    User   `gorm:"foreignKey:Sub"`
	Approved []User `gorm:"foreignKey:Sub"`
}

type Violation struct {
	gorm.Model
	Document Document `gorm:"foreignKey:ID"`
	Violator User     `gorm:"foreignKey:Sub"`
}

func MakeMigrations(db *gorm.DB) error {
	return db.AutoMigrate(&User{}, &Document{}, &Violation{})
}
