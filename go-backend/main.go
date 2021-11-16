package main

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v4"
)

func pong(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}

func main() {
	http.Handle("/ping", middleware(http.HandlerFunc(pong)))
	log.Print("Starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := strings.Split(r.Header.Get("Authorization"), "Bearer ")
		if len(authHeader) != 2 {
			fmt.Println("Malformed token")
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Malformed Token"))
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
				log.Fatal(err)
			}

			if token.Valid {
				claims := token.Claims.(jwt.MapClaims)

				if !claims.VerifyIssuer("https://dev-xpa94aad.us.auth0.com/", true) {
					w.WriteHeader(http.StatusUnauthorized)
					w.Write([]byte("Unauthorized"))
				}

				if !claims.VerifyAudience("identity-lock https://dev-xpa94aad.us.auth0.com/userinfo", true) {
					w.WriteHeader(http.StatusUnauthorized)
					w.Write([]byte("Unauthorized"))

				}

				ctx := context.WithValue(r.Context(), "props", claims)
				// Access context values in handlers like this
				// props, _ := r.Context().Value("props").(jwt.MapClaims)
				next.ServeHTTP(w, r.WithContext(ctx))
			} else {
				fmt.Println(err)
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte("Unauthorized"))
			}
		}

		next.ServeHTTP(w, r)
	})
}

func validateClaims(claims *jwt.MapClaims) bool {

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
