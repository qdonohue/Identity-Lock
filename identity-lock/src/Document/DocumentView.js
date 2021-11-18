import { useParams } from "react-router"

export const DocumentView = () => {
    const {documentID} = useParams()

    return (
        <div>
            Hello! You are viewing document with ID {documentID}
        </div>
    )

}