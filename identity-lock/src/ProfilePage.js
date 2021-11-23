import { useAuth0 } from "@auth0/auth0-react"

import { Profile } from "./Signup/Profile" 

export const ProfilePage = () => {
    const {user} = useAuth0()

    return (
        <div className="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 w-1/5 mx-auto">
            <img src={user.picture} alt="Profile Picture" className="w-36 h-36 rounded-full object-cover" />
            <Profile user={user} />
        </div>
    )
}