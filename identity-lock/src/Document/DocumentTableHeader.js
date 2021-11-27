import { DocumentAddIcon } from "@heroicons/react/outline"


export const DocumentTableHeader = ({count, openNewDocumentModal}) => {

    return (
        <div className="flex flex-col px-5 mx-10 w-full mt-2">
            <div className="overflow-hidden rounded-t-lg bg-blue-800 flex flex-row justify-between h-20">
                <div className="text-white text-2xl text-left ml-5 my-auto font-bold">{`Uploaded Documents (${count})`}</div>
                <button
                    type="button"
                    onClick={() => openNewDocumentModal(true)}
                    className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-gray-800"
                >
                    <DocumentAddIcon className="h-10 w-10 text-white" aria-hidden="true" />
                </button>
            </div>
        </div>
    )
}