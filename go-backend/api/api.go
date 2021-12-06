package api

import (
	"Identity-Lock/go-backend/ml"
)

type Api struct {
	ml *ml.Ml
}

func NewApi(ml *ml.Ml) *Api {
	return &Api{ml: ml}
}
