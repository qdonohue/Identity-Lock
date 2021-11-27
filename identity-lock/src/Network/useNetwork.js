import React, {
    createContext,
    useContext,
    useMemo,
    useState,
} from "react"

import { useAuth0 } from "@auth0/auth0-react"
import axios from 'axios'

const NetworkContext = createContext()

// Export the provider as we need to wrap the entire app with it
export const NetworkProvider = ({ children }) => {
    const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function apiPost(endpoint, payload) {
        console.log("Making network request")
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

        console.log(token)

        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL + endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            let resp = await response.data()
            setLoading(false)
            return resp

        } catch (e) {
            setLoading(false)
            console.error(e);
        }
    }

    async function apiGet(endpoint) {
        console.log("Making get network request")
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

        console.log(token)

        try {
            const response = await axios.get(process.env.REACT_APP_BACKEND_URL + endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            let resp = await response.data()
            setLoading(false)
            return resp

        } catch (e) {
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
        console.log(token)
        setLoading(false)
        return token;
    }

    // Re-render on change in loading, error, or access token state
    const memoedValue = useMemo(
        () => ({
            loading,
            error,
            apiPost,
            apiGet,
            getToken,
        }),
        [loading, error]
    );

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <NetworkContext.Provider value={memoedValue}>
            {children}
        </NetworkContext.Provider>
    );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useNetwork() {
    return useContext(NetworkContext);
}