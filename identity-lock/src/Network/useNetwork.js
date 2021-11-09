import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"

import { useAuth0 } from "@auth0/auth0-react"
import axios from 'axios'

const NetworkContext = createContext()

// Export the provider as we need to wrap the entire app with it
export const NetworkProvider = ({ children }) => {
    const { getAccessTokenSilently } = useAuth0();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function apiPost(endpoint, payload) {
        {
            try {
                setLoading(true)
                const token = await getAccessTokenSilently({
                    audience: 'identity-lock',
                });
                const response = await axios.post(process.env.REACT_APP_BACKEND_URL + endpoint, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                resp = await response.data()
                setLoading(false)
                return resp
                
            } catch (e) {
                console.error(e);
                setError(e)
                setLoading(false)
            }
        }
    }

    // Re-render on change in loading, error, or access token state
    const memoedValue = useMemo(
        () => ({
            loading,
            error,
            apiPost,
        }),
        [loading, error]
    );

    // We only want to render the underlying app after we
    // assert for the presence of a current user.
    return (
        <AuthContext.Provider value={memoedValue}>
            {children}
        </AuthContext.Provider>
    );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useNetwork() {
    return useContext(NetworkContext);
}