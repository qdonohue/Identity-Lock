import React from "react"

import { GoogleLogout } from 'react-google-login'

const clientId = '149912625748-pahhkhroe361ipc4cpgqu0ddce5jc7li.apps.googleusercontent.com'


const Logout = () => {
    const onSuccess = (res) => {
        console.log(`Logout Success for user: ${res}`)
        console.log(res)
    }

    return (
        <div>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout