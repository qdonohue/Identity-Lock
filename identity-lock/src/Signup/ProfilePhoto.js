import { useRef, useCallback } from "react";

import Webcam from "react-webcam";
import { SIGNUP_STEP } from "./utils";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

export const ProfilePhoto = ({handleImage}) => {
    const webcamRef = useRef(null);

    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            handleImage(imageSrc)
        },
        [webcamRef]
    );

    return (
        <div class="flex flex-col flex-grow justify-center bg-blue-800 items-center text-white rounded-lg border shadow-lg p-10 my-10 min-w-full">
            <div class="text-white font-bold text-2xl text-center">
                Lets get a photo to recognize you.
            </div>
            <Webcam
                class="p-5"
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
};