package app

import (
	"Identity-Lock/go-backend/api"
	"Identity-Lock/go-backend/middleware"
	"Identity-Lock/go-backend/ml"
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/Azure/azure-sdk-for-go/services/cognitiveservices/v1.0/face"
	"github.com/Azure/go-autorest/autorest"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type App struct {
	router *mux.Router
	ml     *ml.Ml
}

func pong(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("pong"))
}

func ReceiveFile(w http.ResponseWriter, r *http.Request) {
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

func NewApp() *App {

	face_key := os.Getenv("FACE_SUBSCRIPTION_KEY")
	face_endpoint := os.Getenv("FACE_ENDPOINT")

	client := face.NewClient(face_endpoint)
	client.Authorizer = autorest.NewCognitiveServicesAuthorizer(face_key)

	cnt := context.Background()

	ml := ml.NewMl(&client, &cnt)

	api := api.NewApi(ml)

	r := mux.NewRouter()
	api.RegisterRoutes(r)
	r.HandleFunc("/ping", pong)
	r.HandleFunc("/file", ReceiveFile).Methods("POST")

	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.AuthMiddleware)

	return &App{router: r, ml: ml}
}

func (app *App) Run() {
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(app.router)))

}
