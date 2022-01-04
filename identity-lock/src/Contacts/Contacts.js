import { useEffect, useState } from "react"

import { useHistory } from "react-router-dom"

import useNetwork from "../Network/useNetwork"
import { ContactTable } from "./ContactTable"

import { ContactTableHeader } from "./ContactTableHeader"


/* 
Contact format:
Name
Email
Status
*/

const demoContacts = [
    {name: "Quinn", email: "quinndonohue@gmail.com", status: false},
    {name: "Will", email: "Fake@gmail.com", status: true},
]

export const Contacts = () => {
    const { apiGet } = useNetwork()
    // const [contacts, setContacts] = useState([])
    const [contacts, setContacts] = useState(demoContacts)
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
            <ContactTable contacts={contacts} contactDetailsModal={openDetailModal} />
        </div>
    )
}