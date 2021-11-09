
import { useAuth0 } from "@auth0/auth0-react"

import { LoginButton, LogoutButton } from "./Utility/signinhelper"

export const Home = () => {
    const {isAuthenticated, user} = useAuth0();
    
    return (
        <>
            <p> Super basic test going on here</p>
            <LoginButton />
            {isAuthenticated && <div>Hello {user.name}</div>}
            <LogoutButton />
        </>
    )
}