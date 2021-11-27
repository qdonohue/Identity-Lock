package api

import (
	"Identity-Lock/go-backend/ml"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"gopkg.in/square/go-jose.v2/json"
)

type Api struct {
	ml *ml.Ml
}

func NewApi(ml *ml.Ml) *Api {

	return &Api{ml: ml}

}

// func DetectFace(w http.ResponseWriter, r *http.Request) {
// 	r.ParseMultipartForm(32 << 20) // limit your max input length!
// 	file, header, err := r.FormFile("file")
// 	if err != nil {
// 		panic(err)
// 	}
// 	defer file.Close()
// 	name := strings.Split(header.Filename, ".")
// 	fmt.Printf("File name %s\n", name[0])
// 	f, err := ioutil.TempFile("static", "uploadFile-*.png")
// 	if err != nil {
// 		log.Fatal(err)
// 	}
// 	defer f.Close()
// 	// do something else
// 	// etc write header
// 	w.Write([]byte("File uploaded!"))
// }

func (api *Api) DetectFace(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(32 << 20) // limit your max input length!
	file, _, err := r.FormFile("image")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	rc := io.NopCloser(file)

	analysis := api.ml.DetectFaceStream(rc)

	fmt.Println("analysis data")
	fmt.Println(analysis)

	body, err := json.Marshal(analysis)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("analysis data")
	fmt.Println(body)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(body)
}

func (a *Api) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/detect", a.DetectFace)
}
