import { useEffect, useState } from "react"

import { useHistory } from "react-router-dom"

import useNetwork from "../Network/useNetwork"
import { ContactManagementModal } from "./ContactManagementModal"
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
    const [contacts, setContacts] = useState([])
    const [searchString, setSearchString] = useState(null)
    // const [contacts, setContacts] = useState(demoContacts)
    const [contactDetailsModal, setContactDetailsModal] = useState(null)

    // useEffect(async () => {
    //     const contactList = await apiGet("/api/getcontacts")
    //     setContacts(contactList ? contactList : [])
    // })

    useEffect(async () => {
        let contactList;
        if (searchString) {
            contactList = await apiGet('/api/searchallcontacts', {searchString})
        } else {
            contactList = await apiGet('/api/getcontacts')
        }
        setContacts(contactList ? contactList : [])
    }, [searchString])

    const openDetailModal = (id) => {
        setContactDetailsModal(id)
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {(contactDetailsModal==0 || contactDetailsModal) && <ContactManagementModal contact={contacts[contactDetailsModal]} closeModal={() => setContactDetailsModal(null)}/>}
            <ContactTableHeader count={contacts.length} search={setSearchString}/>
            <ContactTable contacts={contacts} contactDetailsModal={openDetailModal} />
        </div>
    )
}