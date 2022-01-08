import { useEffect, useState } from "react"

import Loader from "react-loader-spinner";
import { UserRemoveIcon, XIcon } from "@heroicons/react/outline";
import { CustomModal } from "../Components/CustomModal";
import useNetwork from "../Network/useNetwork";

export const AlertManagementModal = ({ id, closeModal }) => {
    const { apiGet } = useNetwork()
    const [alert, setAlert] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(async () => {
        setLoading(true)
        let resp = await apiGet('/api/getalert', { id })

        if (resp) {
            setAlert(resp)
        }

        setLoading(false)
    }, [])

    const removeAccess = async () => {
        await apiGet('/api/removeviewer', { alertID: id })
        await deleteAlert()
        closeModal()
    }

    const deleteAlert = async () => {
        await apiGet('/api/deletealert', { id })
        closeModal()
    }

    return (
        <CustomModal open={true} display={closeModal}>
            {loading || !alert ? <div className="flex items-center justify-center m-20" ><Loader type="Circles" color="#1565c0" height={120} width={120} /></div> :
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 flex items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mx-auto">{`Violation by ${alert.violatorname}`}</h3>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium col-span-2 text-gray-500 mx-auto ">Document Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2  mx-auto">{alert.documentname}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 col-span-2 mx-auto">Violator Name</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mx-auto">{alert.violatorname}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 col-span-2 mx-auto">Most Recent Violation</dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mx-auto">{alert.date}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
                                <div className="text-red-700 italic text-center col-span-3">{`${alert.violatorname} has been responsible for ${alert.count} access violations on ${alert.documentname}`}</div>
                            </div>
                            <div className="flex justify-center items-center align-center">
                                <button
                                    onClick={removeAccess}
                                    type="button"
                                    className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <UserRemoveIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3 my-auto" />
                                    <div className="my-auto">
                                        {`Remove ${alert.violatorname} from ${alert.documentname}`}
                                    </div>
                                </button>
                            </div>
                            <div className="flex justify-center items-center align-center">
                                <button
                                    onClick={deleteAlert}
                                    type="button"
                                    className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <XIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                    <div>
                                        Dismiss Alert
                                    </div>
                                </button>
                            </div>
                        </dl>
                    </div>
                </div>}
        </CustomModal>
    )

}