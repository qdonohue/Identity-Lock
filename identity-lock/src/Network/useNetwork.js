import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"

import { useAuth0 } from "@auth0/auth0-react"
import axios from 'axios'
import { useHistory } from "react-router"

const NetworkContext = createContext()

// Export the provider as we need to wrap the entire app with it
export const NetworkProvider = ({ children }) => {
    const { getAccessTokenSilently, getAccessTokenWithPopup, logout, isAuthenticated } = useAuth0();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [registered, setRegistered] = useState(false);

    function registrationNeeded(response) {
        if (response.data["UserNotFound"] == true) {
            history.push('/signup')
        }
    }

    // Hack for now --> it'll check if we are registered via backend middleware / forced redirect
    useEffect(async () => {
        const resp = await apiGet("/api/userexists")
        setRegistered(resp["Registered"])
    }, [isAuthenticated])

    async function apiPost(endpoint, payload) {
        setLoading(true)
        const token = await getToken()

        try {
            const response = await axios.post( 'http://localhost:8080'
 + endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });
            setLoading(false)
            if (registrationNeeded(response)) {
                logout()
                history.pushState('/signup')
                return
            }
            return response.data

        } catch (e) {
            if (e.response && e?.response?.status == 400) {
                registrationNeeded(e.response)
            }
            setLoading(false)
            console.error(e);
        }
    }

    async function multipartFormPost(endpoint, payload) {
        setLoading(true)

        const token = await getToken()

        try {
            const response = await axios.post( 'http://localhost:8080'
 + endpoint,
                payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            }
            )
            setLoading(false)
            return response
        } catch (e) {
            if (e.response && e?.response?.status == 400) {
                registrationNeeded(e.response)
            }
            setLoading(false)
            console.error(e);
        }
    }

    async function apiGet(endpoint, params = null) {
        setLoading(true)

        const token = await getToken()
        try {
            const response = await axios.get( 'http://localhost:8080'
 + endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: params
            });
            setLoading(false)
            return response.data

        } catch (e) {
            if (e.response && e?.response?.status == 400) {
                registrationNeeded(e.response)
            }
            setLoading(false)
            console.error(e);
        }
    }

    async function fileGet(endpoint, params) {
        setLoading(true)

        const token = await getToken()

        try {
            const response = await axios.get( 'http://localhost:8080'
 + endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: 'blob',
                params: params
            });
            setLoading(false)
            return response.data

        } catch (e) {
            if (e.response && e?.response?.status == 400) {
                registrationNeeded(e.response)
            }
            setLoading(false)
            console.error(e);
        }

    }

    async function getToken() {
        let token;
        setLoading(true)
        try {
            token = await getAccessTokenSilently({
                audience: 'identity-lock',
            });
        } catch (e) {
            token = await getAccessTokenWithPopup({
                audience: 'identity-lock',
            })
        }
        setLoading(false)
        return token;
    }

    // Re-render on change in loading, error, or access token state
    const memoedValue = useMemo(
        () => ({
            loading,
            apiPost,
            multipartFormPost,
            apiGet,
            fileGet,
            getToken,
            registered,
            setRegistered,
        }),
        [loading, registered]
    );

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <NetworkContext.Provider value={memoedValue}>
            {children}
        </NetworkContext.Provider>
    );
}

// We only want to use the hook directly and never the context component.
export default function useNetwork() {
    return useContext(NetworkContext);
}