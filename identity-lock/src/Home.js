
import { useAuth0 } from "@auth0/auth0-react"

import { LoginButton, LogoutButton } from "./Utility/signinhelper"
import useNetwork from './Network/useNetwork'
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import logo from './FullLogo.jpg'

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
            <img
                className="lg:block w-auto m-auto"
                src={logo}
                alt="Identity Lock"
            />
        </>
    )
}