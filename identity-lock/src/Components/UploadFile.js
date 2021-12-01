import { DocumentRemoveIcon } from "@heroicons/react/solid"

export const UploadFile = ({ setDocument, document }) => {

    const uploadHandler = (event) => {
        console.log(event)
        setDocument(event.target.files[0])
    }

    const removeHandler = () => {
        setDocument(null)
    }

    return (<div className="flex justify-center items-center align-center">
        <div className="mt-1 sm:mt-0 sm:col-span-2">
            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md my-5">
                <div className="space-y-1 text-center">
                    {document ?
                        <>
                            <div className={"text-xl"}> {document.name} </div>
                            <div className={"text-xs"}> {document.size} bytes</div>
                            <div className={"text-xs"}> {document.lastModifiedDate.toLocaleDateString()}</div>
                            <button
                                onClick={removeHandler}
                                type="button"
                                className="inline-flex p-1 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-bla bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <DocumentRemoveIcon className="flex-1 h-5 w-5 text-white-400 mr-1 my-auto" />
                                <div>
                                    Remove Document
                                </div>
                            </button>

                        </>
                        :
                    <>
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={uploadHandler} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF</p>
                    </>}
                </div>
            </div>
        </div>
    </div>)
}