import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function LoginButton() {
    const {
        isAuthenticated,
        loginWithRedirect,
    } = useAuth0();

    return !isAuthenticated && (
        <button onClick={loginWithRedirect}>Log in</button>
    );
}

export function LogoutButton() {
    const {
        isAuthenticated,
        logout,
    } = useAuth0();

    return isAuthenticated && (
        <button onClick={() => {
            logout({ returnTo: window.location.origin });
        }}>Log out</button>
    );
}
