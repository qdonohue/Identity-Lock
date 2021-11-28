package middleware

import (
	"Identity-Lock/go-backend/app_constants"
	"Identity-Lock/go-backend/db"
	"Identity-Lock/go-backend/models"
	"context"
	"crypto/rsa"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"
)

type AuthError struct {
	Error        string
	UserNotFound bool
}

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			fmt.Println("Malformed token")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		} else {

			jwtToken := authHeader[1]
			token, err := jwt.Parse(jwtToken, func(token *jwt.Token) (interface{}, error) {
				// Don't forget to validate the alg is what you expect:
				if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
					return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
				}

				key, err := getPEMCertificate(token)
				if err != nil {
					return nil, fmt.Errorf("Failure getting PEM certificate")
				}

				return key, nil
			})

			if err != nil {
				fmt.Println(err)
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}

			claims := token.Claims.(jwt.MapClaims)

			if validClaims(&claims) {

				sub := claims["sub"].(string)

				// Extract just the last portion of the sub
				userSub := strings.Split(sub, "|")[1]

				ctx := context.WithValue(r.Context(), app_constants.ContextUserKey, userSub)

				if r.RequestURI == app_constants.USER_REGISTRATION_ENDPOINT || r.RequestURI == app_constants.USER_EXISTS_ENDPOINT {
					next.ServeHTTP(w, r.WithContext(ctx))
					return
				}

				// Check for user account
				var user models.User

				log.Println(userSub)

				err := db.DB.Where("sub = ?", userSub).First(&user).Error

				// User needs to be created
				if err != nil {
					if err != gorm.ErrRecordNotFound {
						w.WriteHeader(http.StatusInternalServerError)
						w.Write([]byte("Unexpected server error"))
						return
					}
					resp, err := json.Marshal(&AuthError{Error: "User not in DB", UserNotFound: true})
					if err != nil {
						log.Fatalln("Shit happened in auth")
					}
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusBadRequest)
					w.Write(resp)
					return
				}

				//ctx := context.WithValue(r.Context(), ContextUserKey, user)
				// Access context values in handlers like this
				// props, _ := r.Context().Value("props").(jwt.MapClaims)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
		}

	})
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Do stuff here
		log.Println(r.RequestURI)
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}

func validClaims(claims *jwt.MapClaims) bool {

	err := claims.Valid()
	if err != nil {
		fmt.Print(err)
		fmt.Print("INVALID CLAIMS")
		return false
	}

	return claims.VerifyIssuer("https://dev-xpa94aad.us.auth0.com/", true) && claims.VerifyAudience("identity-lock", true)
}

type (
	jwks struct {
		Keys []jsonWebKeys `json:"keys"`
	}

	jsonWebKeys struct {
		Kty string   `json:"kty"`
		Kid string   `json:"kid"`
		Use string   `json:"use"`
		N   string   `json:"n"`
		E   string   `json:"e"`
		X5c []string `json:"x5c"`
	}
)

func getPEMCertificate(token *jwt.Token) (*rsa.PublicKey, error) {
	response, err := http.Get("https://dev-xpa94aad.us.auth0.com/.well-known/jwks.json")
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()

	var jwks jwks
	if err = json.NewDecoder(response.Body).Decode(&jwks); err != nil {
		return nil, err
	}

	var cert string
	for _, key := range jwks.Keys {
		if token.Header["kid"] == key.Kid {
			cert = "-----BEGIN CERTIFICATE-----\n" + key.X5c[0] + "\n-----END CERTIFICATE-----"
			break
		}
	}

	if cert == "" {
		return nil, errors.New("unable to find appropriate key")
	}

	return jwt.ParseRSAPublicKeyFromPEM([]byte(cert))
}
