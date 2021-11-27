import { useState } from "react"

import { DocumentTable } from "./DocumentTable"
import { DocumentTableHeader } from "./DocumentTableHeader"
import { DocumentManagementModal } from "./DocumentManagementModal"
import { DocumentUploadModal } from "./DocumentUploadModal"

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
    },
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
    },
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
    },
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
    },
]

const documents = [
    { name: "Test document 1", uploaded: "01/02/20", distributed: true, sharedWith: people},
    { name: "Test document 2", uploaded: "01/03/20", distributed: false, sharedWith: people },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true, sharedWith: people },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false, sharedWith: people },
    { name: "Test document 1", uploaded: "01/02/20", distributed: true, sharedWith: people },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false, sharedWith: people },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true, sharedWith: people },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false, sharedWith: people },
    { name: "Test document 1", uploaded: "01/02/20", distributed: true, sharedWith: people },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false, sharedWith: people },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true, sharedWith: people },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false, sharedWith: people },
    { name: "Test document 1", uploaded: "01/02/20", distributed: true, sharedWith: people },
    { name: "Test document 2", uploaded: "01/03/20", distributed: false, sharedWith: people },
    { name: "Test document 3", uploaded: "01/04/20", distributed: true, sharedWith: people },
    { name: "Test document 4", uploaded: "01/05/20", distributed: false, sharedWith: people }
]

export const Documents = () => {
    const [documentManagementModal, setDocumentManagementModal] = useState({active: false, id: null})
    const [documentUploadModal, setDocumentUploadModal] = useState(null)

    const openManagementModal = (id) => {
        setDocumentManagementModal({active: true, id})
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {documentUploadModal && <DocumentUploadModal closeModal={() => setDocumentUploadModal(null)}/>}
            {documentManagementModal.active && <DocumentManagementModal document={documents[documentManagementModal.id]} closeModal={() => setDocumentManagementModal({active: false, id: null})}/>}
            <DocumentTableHeader count={documents.length} openNewDocumentModal={setDocumentUploadModal}/>
            <DocumentTable documents={documents} documentManagementModal={openManagementModal}/>
        </div>
    )
}