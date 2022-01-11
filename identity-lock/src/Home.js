
import { useAuth0 } from "@auth0/auth0-react"

import useNetwork from './Network/useNetwork'
import { Link, useHistory } from "react-router-dom";

import logo from './FullLogo.jpg'

export const Home = () => {
    const { isAuthenticated } = useAuth0();
    const history = useHistory()

    const { registered } = useNetwork();

    if (isAuthenticated && !registered) {
        history.push('/signup')
    }

    return (
        <div className="flex flex-col justify-start items-center">
            <h1 className="text-4xl my-10 underline text-grey-800">Welcome to Identity Lock!</h1>
            <div className="flex flex-row divide-x divide-grey-600">
                <div className="ml-5 pr-10">
                    <div className="text-2xl text-blue-800 underline mb-5 text-center"><Link to={'/documents'}>Documents</Link></div>
                    <p>The document tab allows you to upload and manage your documents, along with viewing documents shared with you.</p>
                </div>
                <div className="pl-10 pr-10">
                    <div className="text-2xl text-blue-800 underline mb-5 text-center"><Link to={'/contacts'}>Contacts</Link></div>
                    <p>Search for and manage your contacts - users who you can share documents with.</p>
                </div>
                <div className="pl-10 mr-5">
                    <div className="text-2xl text-blue-800 underline mb-5 text-center"><Link to={'/alerts'}>Alerts</Link></div>
                    <p>See information about access violations and manage permissions for users who commit violations.</p>
                </div>
            </div>
            <img
                className="lg:block w-auto m-auto mt-10"
                src={logo}
                alt="Identity Lock"
            />
        </div>
    )
}