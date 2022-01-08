import { useEffect, useState } from "react"

import useNetwork from "../Network/useNetwork"
import { DocumentTableHeader } from "./DocumentTableHeader"
import { DocumentManagementModal } from "./DocumentManagementModal"
import { DocumentUploadModal } from "./DocumentUploadModal"
import { useHistory } from "react-router-dom"
import { AlertTableHeader } from "./AlertTableHeader"
import { AlertTable } from "./AlertTable"
import { AlertManagementModal } from "./AlertManagementModal"

export const Alerts = () => {
    const { apiGet } = useNetwork();
    const history = useHistory();
    const [alerts, setAlerts] = useState([])
    const [alertManagementModal, setAlertManagementModal] = useState(null)
    // const [documentUploadModal, setUploadModal] = useState(null)
    
    useEffect(async () => {
        const alertList = await apiGet("/api/getalerts")
        setAlerts(alertList ? alertList : [])
    }, [alertManagementModal])

    const openManagementModal = (id) => {
        setAlertManagementModal(id)
    }
    
    const viewDoc = (document) => {
        history.push('/viewdocument/' + document.id + '/' + encodeURI(document.name))
    }

    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {(alertManagementModal || alertManagementModal == 0) && <AlertManagementModal />}
            <AlertTableHeader count={alerts.length} />
            <AlertTable alerts={alerts} />
            <DocumentTable documents={documents} documentManagementModal={openManagementModal} />
        </div>
    )
}