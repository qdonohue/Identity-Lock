
export const AlertTable = ({alerts, alertManagementModal}) => {

    // Need: 
    // ID
    // documentname
    // Violation date
    // Violation count
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
                                        Violator's name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Violation Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Violation Count
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {documents.map((alert, alertIdx) => (
                                    <tr key={alertIdx} className="bg-white hover:bg-gray-100 cursor-pointer" onClick={() => {alertManagementModal(alert.id)}}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{alert.documentname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.violatorname}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{alert.count}</td>
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