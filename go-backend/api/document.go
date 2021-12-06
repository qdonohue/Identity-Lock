package api

import "net/http"

func (api *Api) UploadDocument(w http.ResponseWriter, r *http.Request) {

	r.ParseMultipartForm(32 << 20) // limit your max input length!
	file, _, err := r.FormFile("document")
	if err != nil {
		panic(err)
	}
	defer file.Close()

}
