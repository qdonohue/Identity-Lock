package api

import (
	"Identity-Lock/go-backend/ml"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

type Api struct {
	ml *ml.Ml
}

func NewApi(ml *ml.Ml) *Api {

	return &Api{ml: ml}

}

func DetectFace(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	file, header, err := r.FormFile("file")
	if err != nil {
		panic(err)
	}
	defer file.Close()
	name := strings.Split(header.Filename, ".")
	fmt.Printf("File name %s\n", name[0])
	f, err := ioutil.TempFile("static", "uploadFile-*.png")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	// do something else
	// etc write header
	w.Write([]byte("File uploaded!"))
}

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/detect", DetectFace)
}
