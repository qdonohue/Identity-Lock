package app

import (
	"Identity-Lock/go-backend/api"
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/middleware"
	"Identity-Lock/go-backend/ml"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type App struct {
	router *mux.Router
	ml     *ml.Ml
}

func pong(w http.ResponseWriter, r *http.Request) {
	log.Println(r.Context().Value(app_constants.ContextUserKey).(string))
	w.Write([]byte("pong"))
}

func NewApp(ml *ml.Ml, tempDir string) *App {

	api := api.NewApi(ml, tempDir)

	r := mux.NewRouter()
	api.RegisterRoutes(r)
	r.HandleFunc("/ping", pong)

	r.Use(middleware.LoggingMiddleware)
	r.Use(middleware.AuthMiddleware)

	return &App{router: r, ml: ml}
}

func (app *App) Run() {
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}), handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}), handlers.AllowedOrigins([]string{"*"}))(app.router)))
}
