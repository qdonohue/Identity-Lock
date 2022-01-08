import { useEffect, useState } from "react"

import Loader from "react-loader-spinner";
import Select from 'react-select'
import { Link } from "react-router-dom";
import { CloudDownloadIcon, DocumentRemoveIcon } from "@heroicons/react/outline";
import { CustomModal } from "../Components/CustomModal";
import useNetwork from "../Network/useNetwork";

export const AlertManagementModal = () => {
   
    return (
        <CustomModal open={true} display={close}>
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
                                {document.owner ?
                                    (contacts.length ?
                                        <div className="flex flex-col col-span-3">
                                            <div className="col-span-3 text-sm font-medium text-gray-500 text-center mb-2">Approved Viewers</div>
                                            <Select className="col-span-3" placeholder={"Select Contacts to add to document"} defaultValue={currentViewers} isMulti={true} onChange={(val) => { setApprovedList(val); !editOccured && setEditOccured(true) }} options={contacts} />
                                            {editOccured && <div className="col-span-3 text-center text-red-500 italic text-xs mt-2">Changes saved automatically</div>}
                                        </div>
                                        : <div className="text-grey-700 text-center col-span-3">Find contacts to add in the <Link className="text-blue-600" to={"/contacts"}>Contacts</Link> tab</div>) : <div className="col-span-3">{`Only the document owner is allowed to see and modify approved viewers`}</div>}
                            </div>
                            <div className="flex justify-center items-center align-center">
                                <button
                                    onClick={() => { manageUpdatedContacts(); viewDocument(document) }}
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