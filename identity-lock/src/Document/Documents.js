import { useEffect, useState } from "react"

import useNetwork from "../Network/useNetwork"
import { DocumentTable } from "./DocumentTable"
import { DocumentTableHeader } from "./DocumentTableHeader"
import { DocumentManagementModal } from "./DocumentManagementModal"
import { DocumentUploadModal } from "./DocumentUploadModal"
import { DocumentView } from "./DocumentView"

const people = [
    {
        name: 'Calvin Hawkins',
        email: 'calvin.hawkins@example.com',
        image:
            'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Kristen Ramos',
        email: 'kristen.ramos@example.com',
        image:
            'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
        name: 'Ted Fox',
        email: 'ted.fox@example.com',
        image:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }
]

export const Documents = () => {
    const { apiGet } = useNetwork();
    const [documents, setDocuments] = useState(null)
    const [documentManagementModal, setDocumentManagementModal] = useState({ active: false, id: null })
    const [documentUploadModal, setDocumentUploadModal] = useState(null)
    const [viewDocument, setViewDocument] = useState(null)

    // useEffect(async () => {
    //     const resp = await apiGet("/api/getdocuments")
    //     console.log(resp)
    // }, [documentManagementModal, documentUploadModal])

    const fetchDocs = async () => {
        const docList = await apiGet("/api/getdocuments")
        setDocuments(docList)
    }

    const openManagementModal = (id) => {
        setDocumentManagementModal({ active: true, id })
    }

    const addDocument = (data) => {
        data["sharedWith"] = people
        documents.push(data)
        setDocuments(documents)
        setDocumentUploadModal(null)
    }
    if (viewDocument) {
        return (
            <DocumentView document={viewDocument} closeView={() => { setViewDocument(null) }} />
        )
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {documentUploadModal && <DocumentUploadModal closeModal={() => setDocumentUploadModal(null)} uploadDocument={addDocument} />}
            {documentManagementModal.active && <DocumentManagementModal document={documents[documentManagementModal.id]} viewDocument={setViewDocument} closeModal={() => setDocumentManagementModal({ active: false, id: null })} />}
            <DocumentTableHeader count={documents.length} openNewDocumentModal={setDocumentUploadModal} />
            <DocumentTable documents={documents} documentManagementModal={openManagementModal} />
            <button onClick={fetchDocs}>Get new documents</button>
        </div>
    )
}