import { useEffect, useState } from "react"

import useNetwork from "../Network/useNetwork"
import { DocumentTable } from "./DocumentTable"
import { DocumentTableHeader } from "./DocumentTableHeader"
import { DocumentManagementModal } from "./DocumentManagementModal"
import { DocumentUploadModal } from "./DocumentUploadModal"
import { useHistory } from "react-router-dom"

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
    const history = useHistory();
    const [documents, setDocuments] = useState([])
    const [documentManagementModal, setDocumentManagementModal] = useState({ active: false, id: null })
    const [documentUploadModal, setDocumentUploadModal] = useState(null)

    const fetchDocs = async () => {
        const docList = await apiGet("/api/getdocuments")
        setDocuments(docList ? docList : [])
    }

    useEffect(async () => {
        const docList = await apiGet("/api/getdocuments")
        setDocuments(docList ? docList : [])
    }, [documentManagementModal, documentUploadModal])

    const openManagementModal = (id) => {
        setDocumentManagementModal({ active: true, id })
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
            {documentManagementModal.active && <DocumentManagementModal document={documents[documentManagementModal.id]} viewDocument={viewDoc} closeModal={() => setDocumentManagementModal({ active: false, id: null })} />}
            <DocumentTableHeader count={documents.length} openNewDocumentModal={setDocumentUploadModal} />
            <DocumentTable documents={documents} documentManagementModal={openManagementModal} />
            <button onClick={fetchDocs}>Get new documents</button>
        </div>
    )
}