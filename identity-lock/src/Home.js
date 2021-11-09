
import { useAuth0 } from "@auth0/auth0-react"

import { LoginButton, LogoutButton } from "./Utility/signinhelper"
import useNetwork from './Network/useNetwork'
import { useState } from "react";

export const Home = () => {
    const { isAuthenticated, user } = useAuth0();
    const { loading, error, apiPost } = useNetwork();
    const [networkResponse, setNetworkResponse] = useState()


    async function requestSecretRoute() {
        let response = await apiPost('/api/private', {})
        console.log(response)
    }

    if (loading) {
        return (
            <div>Loading...</div>
        )
    }

    if (error) {
        return (
            <><div> OH NO - ERROR: {error}</div> </>
        )
    }

    return (
        <>
            <p> Super basic test going on here</p>
            <LoginButton />
            {isAuthenticated && <div>Hello {user.name}</div>}

            {<><div>networkResponse</div> <button onClick={requestSecretRoute}>API request</button></>}
            <LogoutButton />
        </>
    )
}