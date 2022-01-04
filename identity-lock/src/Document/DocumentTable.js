
const distributedBadge = (sent) => {
    return (sent ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Sent
    </span> : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Waiting
    </span>)
}

export const DocumentTable = ({documents, documentManagementModal}) => {

    return (
        <div className="flex-1 flex flex-col px-5 mx-10 w-full">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full overflow-x-scroll sm:px-6 lg:px-8">
                    <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-b-lg max-h-3/4">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Document Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Sent
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Uploaded By
                                    </th><th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Uploaded Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {documents.map((document, documentIdx) => (
                                    <tr key={documentIdx} className="bg-white hover:bg-gray-100 cursor-pointer" onClick={() => {console.log(documentIdx); documentManagementModal(documentIdx)}}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{document.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{distributedBadge(document.distributed)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.owner}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.uploaded}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}