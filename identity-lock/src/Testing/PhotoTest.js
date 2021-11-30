import Webcam from "react-webcam";
import useNetwork from "../Network/useNetwork";

import { useCallback, useRef, useState } from "react";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};



export const PhotoTest = () => {
    const webcamRef = useRef(null);
    const { multipartFormPost } = useNetwork()
    const [userCount, setUserCount] = useState(null)

    const capture = useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();

            const blob = await (await fetch(imageSrc)).blob()
            const data = new FormData()
            data.append('image', blob)

            const resp = await multipartFormPost('/api/detect', data)
            console.log(resp)
            setUserCount(resp.FaceCount)
        },
        [webcamRef]
    );

    return (
        <div className="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 min-w-full">
            <div className="text-white font-bold text-2xl text-center">
                PHOTO TEST
            </div>
            {userCount && <div className="text-white font-bold text-l text-center">
                There are {userCount} people in the image.
            </div>}
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
                Looks good!
            </button>
        </div>
    );


}