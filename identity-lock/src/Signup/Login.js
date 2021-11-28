
import { useAuth0 } from "@auth0/auth0-react"
import { useHistory } from "react-router"

import { Profile } from "./Profile"
import { SIGNUP_STEP } from "./utils"

export const Login = ({ setNextStep }) => {
    const { isAuthenticated, user, loginWithPopup, logout } = useAuth0()
    const history = useHistory()


    if (!isAuthenticated) {
        return (
            <div className="flex justify-top bg-gray-800 items-center flex-col text-white font-bold rounded-lg border shadow-lg p-10 h-96">
                <div className="text-center font-bold text-2xl">
                    Welcome to Identity Lock!
                </div>
                <div className="text-center font-bold text-l">
                    To get started, connect a Google or Auth0 account.
                </div> 
                <button
                    onClick={loginWithPopup}
                    type="button"
                    className="inline-flex items-center px-20 py-3 mt-20 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Connect
                </button>
            </div>

        )
    }

    return (
        <div className="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 w-100">

            <img src={user.picture} alt="Profile Picture" className="w-36 h-36 rounded-full object-cover" />
            <div className="text-center font-bold text-2xl ">
                Hello {user.given_name}
            </div>
            <div className="text-center text-base">Let's get going!</div>
            <Profile user={user} />
            <button
                onClick={() => {setNextStep(SIGNUP_STEP.PHOTO)}}
                type="button"
                className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Yes!
            </button>
            <button
                type="button"
                onClick={logout}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                I want to use a different account.
            </button>

        </div>
    )

}