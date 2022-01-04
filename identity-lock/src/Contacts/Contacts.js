import { useEffect, useState } from "react"

import { useHistory } from "react-router-dom"

import useNetwork from "../Network/useNetwork"

import { ContactTableHeader } from "./ContactTableHeader"



export const Contacts = () => {
    const { apiGet } = useNetwork()
    const [contacts, setContacts] = useState([])
    const [contactDetailsModal, setContactDetailsModal] = useState()

    // useEffect(async () => {
    //     const contactList = await apiGet("/api/getcontacts")
    //     setContacts(contactList ? contactList : [])
    // })

    const openDetailModal = (id) => {
        setContactDetailsModal(id)
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            <ContactTableHeader count={contacts.length} />
            {/* <DocumentTable documents={documents} documentManagementModal={openManagementModal} /> */}
        </div>
    )
}