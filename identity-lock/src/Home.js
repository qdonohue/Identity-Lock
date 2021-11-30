
import { useAuth0 } from "@auth0/auth0-react"

import { LoginButton, LogoutButton } from "./Utility/signinhelper"
import useNetwork from './Network/useNetwork'
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

export const Home = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const history = useHistory()

    const { registered, apiGet } = useNetwork();
    const [token, setToken] = useState(null)
    async function network() {
        console.log(await apiGet('/ping'))
    }

    if (isAuthenticated && !registered) {
        history.push('/signup')
    }

    return (
        <>
            <p> Super basic test going on here</p>
            <LoginButton />
            {isAuthenticated && <div>Hello {user.name} with token {token && token}</div>}
            <Link to="/document/12345">
                <div>Click here to see document 12345!</div>
            </Link>
            {<><div>networkResponse</div> <button onClick={() => network()}>API request</button></>}
            <LogoutButton />
        </>
    )
}