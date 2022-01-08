import { useEffect, useState } from "react";

import Loader from "react-loader-spinner";
import { UserAddIcon } from "@heroicons/react/solid"
import { UserRemoveIcon } from "@heroicons/react/outline";

import { CustomModal } from "../Components/CustomModal";
import useNetwork from "../Network/useNetwork";


export const ContactManagementModal = ({ id, closeModal }) => {
    const { apiGet } = useNetwork()

    const [loading, setLoading] = useState(false)
    const [contact, setContact] = useState(null)
    const [reloadTrigger, setReloadTrigger] = useState(false)

    useEffect(async () => {
        setLoading(true)
        const resp = await apiGet('/api/getcontact', { id: id })
        console.log(resp)
        setContact(resp)
        setLoading(false)
    }, [reloadTrigger])

    const contactAction = async () => {
        setLoading(true)
        if (contact.currentContact) {
            await apiGet('/api/removecontact', { id })
        } else {
            await apiGet('/api/addcontact', { id })
        }
        setReloadTrigger(!reloadTrigger)
    }

    return (
        <CustomModal open={true} display={closeModal}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {loading ? <div className="flex items-center justify-center m-20" ><Loader type="Circles" color="#1565c0" height={120} width={120} /></div> :
                    <><div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mx-auto">{contact?.name}</h3>
                    </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="sm:divide-y sm:divide-gray-200">
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact?.email}</dd>
                                </div>
                                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact?.currentContact ? "Current Contact" : "Unadded"}</dd>
                                </div>
                                <div className="flex justify-center items-center align-center">
                                    <button
                                        onClick={contactAction}
                                        type="button"
                                        className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        {contact?.currentContact ?
                                            <><UserRemoveIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                                <div>
                                                    Remove Contact
                                                </div></>
                                            :
                                            <><UserAddIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                                <div>
                                                    Add Contact
                                                </div></>}
                                    </button>
                                </div>
                            </dl>
                        </div></>}
            </div>
        </CustomModal>
    )
}