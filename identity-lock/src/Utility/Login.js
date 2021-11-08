import React from "react"

import { GoogleLogin } from 'react-google-login'

import useAuth from "../Network/useAuth"


// TODO: Re style, and pass token into network request to backend to recieve Auth token upon session verification

const Login = () => {
    const {backendLogin, loading, error} = useAuth()  

    return (
        <div onClick={() => backendLogin("quinndonohue", "ddod")}>
            <p>Click here plz</p>
        </div>
    )
}

export default Login