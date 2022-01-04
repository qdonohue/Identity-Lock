import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import Webcam from "react-webcam";
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { useParams, useHistory } from "react-router-dom";


import { ChevronRightIcon, ChevronLeftIcon, XCircleIcon, CheckIcon, XIcon } from "@heroicons/react/solid";
import Loader from "react-loader-spinner";

import useNetwork from "../Network/useNetwork";

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

const PDFHeader = ({ title, back, pageCount }) => {
    return (
        <div className="flex flex-col mx-10 mt-2 w-full">
            <div className="overflow-hidden rounded-lg bg-blue-800 flex flex-row justify-between h-20">
                <div className="bg-white p-1 ml-5 my-auto rounded-full"> <CheckIcon className="text-green-800 h-10 w-10" /> </div>
                <div className="flex flex-col place-items-center">
                    <div className="text-white text-2xl my-auto font-bold">{`Viewing ${title}`}</div>
                    <div className="text-white my-auto text-xl">{pageCount}</div>
                </div>
                <div />
                <button
                    type="button"
                    onClick={back}
                    className="bg-white-800 p-1 mr-5 my-auto rounded-full hover:bg-gray-800"
                >
                    <XCircleIcon className="h-10 w-10 text-white" aria-hidden="true" />
                </button>
            </div>
        </div>)
}


export const DocumentView = () => {
    const webcamRef = useRef(null);
    const { multipartFormPost, fileGet } = useNetwork()
    const { user } = useAuth0()
    const { id, title } = useParams()
    const history = useHistory();
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [accessGranted, setAccessGranted] = useState(true)
    const [pdf, setPdf] = useState(null)

    const [reply, setReply] = useState(null)

    const capture = useCallback(
        async () => {
            const imageSrc = webcamRef.current.getScreenshot();

            const blob = await (await fetch(imageSrc)).blob()
            const data = new FormData()
            data.append('image', blob)

            const resp = await multipartFormPost('/api/detect', data)
            setReply(resp.data)
            setAccessGranted(resp.data.Permitted)
        },
        [webcamRef]
    );

    useEffect(() => {
        const interval = setInterval(() => {
            capture()
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    useEffect(async () => {
        const reply = await fileGet('/api/getdocument', {id: id})
        setPdf(reply)
    }, [document])

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col justify-center">

            {accessGranted ?
                <div className="flex justify-center">

                    {(pageNumber > 1) ? <div className="m-auto" onClick={() => { setPageNumber(pageNumber - 1) }} ><ChevronLeftIcon className="w-20 h-20" /> </div> : <div className="m-auto"> </div>}

                    <div className="flex flex-col place-items-center">
                        <PDFHeader title={decodeURI(title)} back={() => {history.push('/documents')}} pageCount={`(page ${pageNumber} of ${numPages})`} />
                        {pdf ? <Document
                            className="border-2 border-grey"
                            file={pdf}
                            onLoadSuccess={onDocumentLoadSuccess}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document> 
                        : 
                        <div className="flex items-center justify-center m-20" ><Loader type="Circles" color="#1565c0" height={120} width={120} /></div>
                        }
                    </div>

                    {(pageNumber < numPages) ?
                        <div className="m-auto" onClick={() => { setPageNumber(pageNumber + 1) }} >
                            <ChevronRightIcon className="w-20 h-20" />
                        </div> : <div className="m-auto"> </div>}

                </div>
                : <div className="flex flex-col place-items-center m-10">
                    <div className="text-red-800 text-4xl text-center">VIOLATION DETECTED</div>
                    <XCircleIcon className="text-red-800 h-72 w-72" />
                    <div className="text-black text-2xl text-center">
                        {(reply.FaceCount != 1) &&
                            <span>There are {reply.FaceCount > 1 ? `too many faces detected (${reply.FaceCount})` : "no faces detected"} </span>
                        }
                        {(reply.FaceCount == 1) && <span>Failed to identify {user.name} (Match threshold of only {reply.Confidence * 100}%)</span>}
                    </div>
                    <div className="text-red text-l text-center">The document owner has been notified</div>
                    <button
                        type="button"
                        onClick={capture}
                        className="inline-flex items-center mt-20 w-30 px-2.5 py-1.5 border border-transparent text-s font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        I promise I'll be good
                    </button>
                </div>}

            <div className="absolute top-12 right-0">
                <Webcam
                    className="p-5"
                    audio={false}
                    mirrored={true}
                    height={200}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={254}
                    forceScreenshotSourceSize={true}
                    videoConstraints={videoConstraints}
                />
            </div>

        </div>

    );
}