import { useState } from "react";
import { useHistory } from "react-router";
import Loader from 'react-loader-spinner';
import { useAuth0 } from "@auth0/auth0-react";


import { Profile } from "./Profile";


export const FullProfile = ({ img, register }) => {
    const { user } = useAuth0()
    const [loading, setLoading] = useState(null)

    const history = useHistory()

    if (loading) {
        return <div className="flex items-center justify-center h-screen" ><Loader type="Circles" color="#00BFFF" height={120} width={120} /></div>;
    }

    return (
        <div className="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 w-100">

            <img src={img} alt="Profile Picture" className="w-36 h-36 rounded-full object-cover" />
            <Profile user={user} />
            <button
                onClick={async () => {
                    setLoading(true)
                    await register();
                    setLoading(false)
                    history.push('/home')
                }}
                type="button"
                className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Let's get started
            </button>

        </div>
    )
}