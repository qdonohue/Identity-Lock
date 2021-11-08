import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useMemo,
    useState,
  } from "react"

  import { useHistory, useLocation } from "react-router-dom"
  import axios from 'axios'

  import * as NETWORK from "./networkConst"
  
  const AuthContext = createContext()
  
  // Export the provider as we need to wrap the entire app with it
  export const AuthProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const location = useLocation();
  
    // If we change page, reset the error state.
    useEffect(() => {
      if (error) setError(null);
    }, [location.pathname]);

    async function backendLogin(username, password) {
      setLoading(true);
      try {
        let {data, status} = await axios.post(process.env.REACT_APP_BACKEND_URL + '/token-auth/', {"username": username, "password": password}
        )
        if (status == 200) {
          setAccessToken(data.token)
          setUser(username)
          history.push('/')
        } else if (status == 400) {
          return NETWORK.LOGIN_FAILURE
        }
        setLoading(false)
      } catch (e) {
        console.log(e)
        return NETWORK.LOGIN_ERROR
      }
    }

    async function protectedPost(endpoint, payload) {
      if (!accessToken) {
        setError(NETWORK.UNAUTHENTICATED)
      } else {
        return await axios.post(process.env.REACT_APP_BACKEND_URL + endpoint, payload, {headers: {
          'Authorization': `Token ${accessToken}`
        }})
      }
    }
  
    // Re-render on change in loading, error, or access token state
    const memoedValue = useMemo(
      () => ({
        loading,
        error,
        accessToken,
        backendLogin,
        protectedPost
      }),
      [accessToken, user, loading, error]
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
  export default function useAuth() {
    return useContext(AuthContext);
  }