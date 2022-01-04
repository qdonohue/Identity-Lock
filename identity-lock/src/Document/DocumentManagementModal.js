import { UserRemoveIcon, CloudDownloadIcon, DocumentRemoveIcon } from "@heroicons/react/outline";
import { CustomModal } from "../Components/CustomModal";

const SharedWithList = ({ people }) => {
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
                        <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.email}</p>
                        </div>

                    </div>
                    <button
                        type="button"
                        onClick={console.log(`remove person ${person.email}`)}
                        className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-blue-200"
                    >
                        <UserRemoveIcon className="h-6 text-red-500 " />
                    </button>
                </li>
            ))}
        </ul>
    )
}


export const DocumentManagementModal = ({ document, viewDocument, closeModal }) => {

    return (
        <CustomModal open={true} display={closeModal}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Document Information</h3>
                    <button
                        type="button"
                        onClick={console.log('delete')}
                        className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-blue-200"
                    >
                        <DocumentRemoveIcon className="h-10 w-10 text-red-500" aria-hidden="true" />
                    </button>
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
                            <dt className="text-sm font-medium text-gray-500">Shared with {document?.sharedWith?.length ? document.sharedWith.length : 0 } </dt>
                            <SharedWithList people={document.sharedWith} className="col-span-2" />
                        </div>
                        <div className="flex justify-center items-center align-center">
                            <button
                                onClick={() => {viewDocument(document.id)}}
                                type="button"
                                className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <CloudDownloadIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                <div>
                                    View Document
                                </div>
                            </button>
                        </div>
                        <div className="flex justify-center items-center align-center">
                            <button
                                onClick={console.log("hi")}
                                type="button"
                                className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <CloudDownloadIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                <div>
                                    Download
                                </div>
                            </button>
                        </div>
                    </dl>
                </div>
            </div>
        </CustomModal>
    )

}