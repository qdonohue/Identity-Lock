import { useEffect, useState } from "react"

import Loader from "react-loader-spinner";
import { UserRemoveIcon, CloudDownloadIcon, DocumentRemoveIcon } from "@heroicons/react/outline";
import { CustomModal } from "../Components/CustomModal";
import useNetwork from "../Network/useNetwork";

const SharedWithList = ({ people, owner, removeContact }) => {
    if (!people) {
        return (
            <div className="col-span-3"> You haven't shared this document with anyone yet.</div>
        )
    }
    return (
        <ul role="list" className="divide-y divide-gray-200 h-72 overflow-y-auto col-span-2">
            {people.map((person) => (
                <li key={person.email} className="py-4 flex">
                    <div className="flex-1 flex">
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.email}</p>
                        </div>

                    </div>
                    {owner && <button
                        type="button"
                        onClick={() => removeContact(person.id)}
                        className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-blue-200"
                    >
                        <UserRemoveIcon className="h-6 text-red-500 " />
                    </button>}
                </li>
            ))}
        </ul>
    )
}


export const DocumentManagementModal = ({ documentID, viewDocument, closeModal }) => {
    const { apiGet } = useNetwork()
    const [document, setDocument] = useState(null)
    const [loading, setLoading] = useState(false)
    const [forceReload, setForceReload] = useState(false)

    useEffect(async () => {
        setLoading(true)
        const resp = await apiGet('/api/getdocumentinfo', { id: documentID })

        if (resp) {
            setDocument(resp)
        }

        setLoading(false)
    }, [forceReload])

    const deleteDocument = async () => {
        await apiGet('/api/deletedocument', { id: document.id })
        closeModal()
    }

    const removeContact = async (id) => {
        await apiGet('/api/removeviewer', { contact_id: id, document_id: document.id })
        setForceReload(!forceReload)
    }

    return (
        <CustomModal open={true} display={closeModal}>
            {loading || !document ? <div className="flex items-center justify-center m-20" ><Loader type="Circles" color="#1565c0" height={120} width={120} /></div> : 
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{document.owner ? "Document Information" : `Shared by ${document.author}`}</h3>
                        {document.owner && <button
                            type="button"
                            onClick={deleteDocument}
                            className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-blue-200"
                        >
                            <DocumentRemoveIcon className="h-10 w-10 text-red-500" aria-hidden="true" />
                        </button>}
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.name}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Uploaded date</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.uploaded}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">Shared with {document?.approved?.length ? document.approved.length : 0} </dt>
                                <SharedWithList people={document.approved} removeContact={removeContact} owner={document.owner} className="col-span-2" />
                            </div>
                            <div className="flex justify-center items-center align-center">
                                <button
                                    onClick={() => { viewDocument(document) }}
                                    type="button"
                                    className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <CloudDownloadIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                    <div>
                                        View Document
                                    </div>
                                </button>
                            </div>
                        </dl>
                    </div>
                </div>}
        </CustomModal>
    )

}