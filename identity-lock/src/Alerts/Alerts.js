import { useEffect, useState } from "react"

import useNetwork from "../Network/useNetwork"
import { AlertTableHeader } from "./AlertTableHeader"
import { AlertTable } from "./AlertTable"
import { AlertManagementModal } from "./AlertManagementModal"

export const Alerts = () => {
    const { apiGet } = useNetwork();
    const [alerts, setAlerts] = useState([])
    const [alertManagementModal, setAlertManagementModal] = useState(null)
    
    useEffect(async () => {
        const alertList = await apiGet("/api/getalerts")
        setAlerts(alertList ? alertList : [])
    }, [alertManagementModal])

    const openManagementModal = (id) => {
        console.log("Open request w/ id: " + id)
        setAlertManagementModal(id)
    }


    return (
        <div className="flex flex-col align-center items-center justify-start max-h-screen">
            {(alertManagementModal || alertManagementModal == 0) && <AlertManagementModal id={alertManagementModal} closeModal={() => setAlertManagementModal(null)}/>}
            <AlertTableHeader count={alerts.length} />
            <AlertTable alerts={alerts} alertManagementModal={openManagementModal}/>
        </div>
    )
}