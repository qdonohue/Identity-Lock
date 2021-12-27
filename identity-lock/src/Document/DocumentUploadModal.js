import { useEffect, useState } from "react"
import AsyncSelect from 'react-select/async';

import { DocumentAddIcon, CheckCircleIcon, EmojiSadIcon } from "@heroicons/react/outline"
import Loader from "react-loader-spinner";
import { ContactSelect } from "../Components/ContactSelect"
import { CustomModal } from "../Components/CustomModal"
import { UploadFile } from "../Components/UploadFile"
import useNetwork from "../Network/useNetwork";

const ReplyHandler = ({ reply, reset, close }) => {
    return (
        <div className="m-20">
            {reply ?
                <div className="flex flex-col place-items-center">
                    <CheckCircleIcon className="text-green-800 h-40 w-40" />
                    <p>Document uploaded succesfully!</p>
                    <button className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={close}>
                        Continue
                    </button>
                </div> :
                <div className="flex flex-col place-items-center">
                    <EmojiSadIcon className="text-red-800 h-40 w-40" />
                    <p>Something went wrong.</p>
                    <button className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={reset}>
                        Start again
                    </button>
                </div>}
        </div>
    )
}


export const DocumentUploadModal = ({ closeModal, uploadDocument }) => {
    const { multipartFormPost } = useNetwork()
    const [documentName, setDocumentName] = useState(null)
    const [sharedList, setSharedList] = useState(null)
    const [document, setDocument] = useState(null)
    const [readyForSubmit, setReadyForSubmit] = useState(false)
    const [replyLoading, setReplyLoading] = useState(false)
    // const [reply, setReply] = useState(false)
    const [reply, setReply] = useState(false)

    useEffect(() => {
        const ready = !!(documentName && document)
        console.log(document)
        setReadyForSubmit(ready)
    }, [documentName, document])

    const submit = async () => {
        const data = new FormData()
        data.append('document', document)
        data.append('title', documentName)
        data.append('contacts', sharedList)
        setReplyLoading(true)
        const resp = await multipartFormPost('/api/upload', data)
        setReply(resp.data.success)
        setReplyLoading(false)
    }

    const reset = () => {
        setDocumentName(null)
        setSharedList(null)
        setDocument(null)
        setReply(false)
    }

    const loadOptions = async (val) => {
        return [
            { value: 'Calvin Hawkins', label: 'Calvin Hawkins' },
            { value: "Kristen Ramos", label: "Kristen Ramos" },
            { value: "Ted Fox", label: "Ted Fox" },
            { value: "Will Donohue", label: "Will Donohue" },
            { value: "Scott Donohue", label: "Scott Donohue" },
        ]
    }


    return (
        <CustomModal open={true} display={closeModal}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Document Information</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    {replyLoading ? <div className="flex items-center justify-center m-20" ><Loader type="Circles" color="#1565c0" height={120} width={120} /></div> : reply ? <ReplyHandler reply={reply} reset={reset} close={closeModal} /> : <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Name</dt>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    className="block max-w-lg w-full py-1 border-black border shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    onInput={(evt) => { setDocumentName(evt.target.value) }}
                                />
                            </div>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid grid-cols-3 sm:gap-4 sm:px-6">
                            <AsyncSelect className="w-96"
                                isMulti
                                cacheOptions
                                defaultOptions
                                loadOptions={loadOptions}
                                onChange={(val) => setSharedList(val)}
                            />
                        </div>
                        <UploadFile setDocument={setDocument} document={document} />
                        <div className="flex flex-col justify-start items-center">
                            <div className="flex justify-center items-center align-center">
                                <button
                                    onClick={submit}
                                    disabled={!readyForSubmit}
                                    type="button"
                                    className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <DocumentAddIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3 my-auto" />
                                    <div>
                                        Save Document
                                    </div>
                                </button>
                            </div>
                            {!readyForSubmit && <div className="text-red-600 text-xs mb-5">Complete all fields to submit</div>}
                        </div>
                    </dl>}
                </div>
            </div>
        </CustomModal>
    )
}