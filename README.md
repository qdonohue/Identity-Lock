# Identity-Lock


# TODO:

## Document management:
- Loading state for PDF
- Delete document
- Rename document (?)

## Contacts / sharing
- Add a contact / search for one
- Share document with a person
- See document appear as the non-owner of the document
- Validate permissions for viewing document
## TODO:
- How to manage contacts being visible to others? Being open to everyone on site prob a no go (especially not contact photo... but maybe for someone who is added? That requires an element of opt-in on contact add invite)
- Search options --> search by email or name
- Standarize badge into modal too?

- Get authorized users for document --> verify that model is storing this array correctly!

## Contact Selection
- Feed contacts into search-async component
- Add to document based on selection (How do those results get passed?)
    - Possible you can grab onchange - but would need to store record of diff and not just auto-send
    - Or could have an explicit "add" button --> need to trigger re-render btw...

## Alerts / Violations
- More nuanced violations (create violation IFF unverified-person violation)
- Violation / alerts page (dismiss?)


## Paper
- Probably get done BEFORE deployment
- uhhh whatever goes into this....

## Deployment

### Hosting Frontend
- S3 bucket equivalent for react
- HTTPS (?)
- URL / DNS bullshit

### Hosting backend
- RDS for backend
- Go server
- HTTPS (?)
- Blob storage
- Face API integration inside microsoft network ?

### Auth0 Cleanup
- Better image
- Verify it works

