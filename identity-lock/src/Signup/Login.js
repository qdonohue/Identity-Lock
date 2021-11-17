
import { useAuth0 } from "@auth0/auth0-react"
import { useHistory } from "react-router"

import { Profile } from "./Profile"
import { SIGNUP_STEP } from "./utils"

export const Login = ({ setNextStep }) => {
    const { isAuthenticated, user, loginWithPopup, logout } = useAuth0()
    const history = useHistory()


    if (!isAuthenticated) {
        return (
            <div class="flex-grow justify-center bg-indigo-800 items-center text-white font-bold rounded-lg border shadow-lg p-10 min-w-full">
                <h1 className="text-center">
                    Welcome to Identity Lock!
                </h1>
                <button
                    onClick={loginWithPopup}
                    type="button"
                    className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Log in
                </button>
            </div>

        )
    }

    return (
        <div class="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 min-w-full">

            <img src={user.picture} alt="Profile Picture" class="w-36 h-36 rounded-full object-cover" />
            <div className="text-center font-bold text-2xl ">
                Hello {user.given_name}!
            </div>
            <div className="text-center text-base">Does this look right to you?</div>
            <Profile user={user} />
            <button
                onClick={() => {setNextStep(SIGNUP_STEP.PHOTO); history.push('/signup')}}
                type="button"
                className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Yes!
            </button>
            <button
                type="button"
                onClick={logout}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                I want to use a different account.
            </button>

        </div>
    )

}