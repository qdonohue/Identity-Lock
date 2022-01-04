package api

import (
	"Identity-Lock/go-backend/ml"
)

type Api struct {
	ml      *ml.Ml
	tempDir string
}

func NewApi(ml *ml.Ml, tempDir string) *Api {
	return &Api{ml: ml, tempDir: tempDir}
}
