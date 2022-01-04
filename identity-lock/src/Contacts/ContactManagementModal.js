
import useNetwork from "../Network/useNetwork"

import { UserAddIcon } from "@heroicons/react/solid"
import { CustomModal } from "../Components/CustomModal";


export const ContactManagementModal = ({ contact, closeModal }) => {
    const { apiPost } = useNetwork()

    return (
        <CustomModal open={true} display={closeModal}>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mx-auto">{contact.name}</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.email}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{contact.status ? "Current Contact" : "Unadded"}</dd>
                        </div>
                        <div className="flex justify-center items-center align-center">
                            <button
                                onClick={() => { console.log('clicked')}}
                                type="button"
                                className="inline-flex place-self-auto px-20 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <UserAddIcon className="flex-shrink-0 h-5 w-5 text-white-400 mr-3" />
                                <div>
                                    Add Contact
                                </div>
                            </button>
                        </div>
                    </dl>
                </div>
            </div>
        </CustomModal>
    )
}