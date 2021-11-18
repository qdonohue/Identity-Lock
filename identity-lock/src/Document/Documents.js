import { DocumentTable } from "./DocumentTable"
import { DocumentTableHeader } from "./DocumentTableHeader"

const documents = [
    { name: "Test document 1", uploaded: "01/02/20", distributed: true },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false },
    { name: "Test document 1", uploaded: "01/02/20", distributed: true },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false },
    { name: "Test document 1", uploaded: "01/02/20", distributed: true },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false },
    { name: "Test document 1", uploaded: "01/02/20", distributed: true },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false }
]

export const Documents = () => {
    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            <DocumentTableHeader count={documents.length}/>
            <DocumentTable documents={documents}/>
        </div>
    )
}