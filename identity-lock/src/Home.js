import Login from "./Utility/Login"
import Logout from "./Utility/Logout"

export const Home = () => {
    return (
        <>
            <h3>
                Welcome to Identity-Lock
            </h3>
            <p> Identity lock is a secure document browser, that leverages computer vision to ensure that only authorized users are able to view a given document.</p>
            <Login />
            <Logout />
        </>
    )
}