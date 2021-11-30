import Webcam from "react-webcam";
import useNetwork from "../Network/useNetwork";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const TestResults = ({reply, name}) => {
    console.log(reply)
    if (reply.Permitted) {
        return (
            <div> We identified {name} alone in the image with {reply.Confidence * 100}% confidence </div>
        )
    } else if (reply.FaceCount != "1") {
        return (
            <div> Access denied: there are {reply.FaceCount > 1 ? `too many faces detected (${reply.FaceCount})` : "no faces detected"}</div>
        )
    } else {
        return (
            <div> Sorry we didn't find {name} in the image ({reply.Confidence * 100}% is less than 50%) </div>
        )
    }

}


export const FaceVerificationDemo = () => {
    const {user} = useAuth0();

    const webcamRef = useRef(null);
    const { multipartFormPost } = useNetwork()
    const [reply, setReply] = useState(null)

    const capture = useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();

            const blob = await (await fetch(imageSrc)).blob()
            const data = new FormData()
            data.append('image', blob)

            const resp = await multipartFormPost('/api/detect', data)
            console.log(resp)
            setReply(resp.data)
        },
        [webcamRef]
    );

    return (
        <div className="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 min-w-full">
            <div className="text-white font-bold text-2xl text-center">
                Face recognition functionality demo
            </div>
            {reply && <TestResults name={user.name} reply={reply} />}
            <Webcam
                className="p-5"
                audio={false}
                mirrored={true}
                height={720}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
            />
            <button
                type="button"
                onClick={capture}
                className="inline-flex items-center w-30 px-2.5 py-1.5 border border-transparent text-s font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Am I allowed access?
            </button>
        </div>
    );


}