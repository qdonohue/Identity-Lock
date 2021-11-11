package router

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"01-Authorization-RS256/middleware"
)

// New sets up our routes and returns a *gin.Engine.
func New() *gin.Engine {
	router := gin.Default()

	// router.Use(cors.New(
	// 	cors.Config{
	// 		AllowOrigins:     []string{"http://localhost:3000"},
	// 		AllowCredentials: true,
	// 		AllowHeaders:     []string{"Authorization"},
	// 	},
	// ))

	//router.Use(cors.Default())

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"POST", "OPTIONS", "GET", "PUT"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// This route is always accessible.
	router.Any("/ping", func(ctx *gin.Context) {
		response := map[string]string{
			"message": "Pong",
		}
		ctx.JSON(http.StatusOK, response)
	})

	// This route is always accessible.
	router.Any("/api/public", func(ctx *gin.Context) {
		response := map[string]string{
			"message": "Hello from a public endpoint! You don't need to be authenticated to see this.",
		}
		ctx.JSON(http.StatusOK, response)
	})

	// This route is only accessible if the user has a valid access_token.
	router.GET(
		"/api/private",
		middleware.EnsureValidToken(),
		func(ctx *gin.Context) {
			response := map[string]string{
				"message": "Hello from a private endpoint! You need to be authenticated to see this.",
			}
			ctx.JSON(http.StatusOK, response)
		},
	)

	return router
}
