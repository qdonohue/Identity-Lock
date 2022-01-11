# Identity-Lock

## Getting Started with Identity Lock

To begin with, clone the repo -
### Https:
```git clone https://github.com/qdonohue/Identity-Lock.git```
### SSH
```git clone git@github.com:qdonohue/Identity-Lock.git```


## Setting up the backend
If Go isn't installed get go via `brew install golang`.


Cd into the `go-backend` directory, and run `go mod download` to install all dependencies.

Next, copy the FACE_SUBSCRIPTION_KEY from the Final IW Appendix into the `environment` file value for it.

### Running the backend
At this point you're ready to launch the backend. Launch it the first time by running:

```go run .```

Since this is optimized for local development, if you want to re-create the server run it with:

```rm gorm.db && go run .```

(this deletes the local database file)

## Setting up the frontend
This requires Yarn - it can be installed with  `brew install yarn`.

Cd into the `identity-lock` folder.

To install all dependencies, run `yarn install`

### Running the frontend
Launch the backend with `yarn start`. 

`localhost:3000` should be automatically launched on your preferred browser, but you can also navigate to it to view the site.

The site has been seeded with some dummy users - try searching for Sarah, Julian, Thomas, Nancy, or Bob.

