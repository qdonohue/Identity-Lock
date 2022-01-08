import { useEffect, useState } from "react"

import { useHistory } from "react-router-dom"

import useNetwork from "../Network/useNetwork"
import { ContactManagementModal } from "./ContactManagementModal"
import { ContactTable } from "./ContactTable"

import { ContactTableHeader } from "./ContactTableHeader"

export const Contacts = () => {
    const { apiGet } = useNetwork()
    const [contacts, setContacts] = useState([])
    const [searchString, setSearchString] = useState(null)
    const [contactDetailsModal, setContactDetailsModal] = useState(null)

    useEffect(async () => {
        let contactList;
        if (searchString) {
            contactList = await apiGet('/api/searchallcontacts', { searchString })
        } else {
            contactList = await apiGet('/api/getcontacts')
        }
        setContacts(contactList ? contactList : [])
    }, [searchString, contactDetailsModal])
    
    const openDetailModal = (id) => {
        setContactDetailsModal(id)
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {contactDetailsModal && <ContactManagementModal id={contactDetailsModal} closeModal={() => setContactDetailsModal(null)} />}
            <ContactTableHeader count={contacts.length} search={setSearchString} />
            <ContactTable contacts={contacts} contactDetailsModal={openDetailModal} />
        </div>
    )
}