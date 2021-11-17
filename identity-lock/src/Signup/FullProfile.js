import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router";

import { Profile } from "./Profile";
import { SIGNUP_STEP } from "./utils";


export const FullProfile = ({img, setStep }) => {

    const {user} = useAuth0()

    const history = useHistory()

    return (
        <div class="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 w-100">

            <img src={img} alt="Profile Picture" class="w-36 h-36 rounded-full object-cover" />
            <Profile user={user} />
            <button
                onClick={() => { history.push('/home') }}
                type="button"
                className="inline-flex items-center px-6 py-3 m-6 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Let's get started
            </button>
            {/* <button
                type="button"
                onClick={setStep(SIGNUP_STEP.LOGIN)}
                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                I want to make changes.
            </button> */}

        </div>
    )
}