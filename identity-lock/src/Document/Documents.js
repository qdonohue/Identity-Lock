import { useEffect, useState } from "react"

import useNetwork from "../Network/useNetwork"
import { DocumentTable } from "./DocumentTable"
import { DocumentTableHeader } from "./DocumentTableHeader"
import { DocumentManagementModal } from "./DocumentManagementModal"
import { DocumentUploadModal } from "./DocumentUploadModal"
import { useHistory } from "react-router-dom"

export const Documents = () => {
    const { apiGet } = useNetwork();
    const history = useHistory();
    const [documents, setDocuments] = useState([])
    const [documentManagementModal, setDocumentManagementModal] = useState(null)
    const [documentUploadModal, setDocumentUploadModal] = useState(null)
    
    useEffect(async () => {
        const docList = await apiGet("/api/getdocuments")
        setDocuments(docList ? docList : [])
    }, [documentManagementModal, documentUploadModal])

    const openManagementModal = (id) => {
        setDocumentManagementModal(id)
    }

    const addDocument = (data) => {
        data["sharedWith"] = people
        documents.push(data)
        setDocuments(documents)
        setDocumentUploadModal(null)
    }

    const viewDoc = (document) => {
        history.push('/viewdocument/' + document.id + '/' + encodeURI(document.name))
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {documentUploadModal && <DocumentUploadModal closeModal={() => setDocumentUploadModal(null)} uploadDocument={addDocument} />}
            {(documentManagementModal || documentManagementModal == 0) && <DocumentManagementModal documentID={documentManagementModal} viewDocument={viewDoc} closeModal={() => setDocumentManagementModal(null)} />}
            <DocumentTableHeader count={documents.length} openNewDocumentModal={setDocumentUploadModal} />
            <DocumentTable documents={documents} documentManagementModal={openManagementModal} />
        </div>
    )
}