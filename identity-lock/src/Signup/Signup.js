import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react";


import { Login } from "./Login"
import { ProgressBar } from "./ProgressBar"
import { ProfilePhoto } from "./ProfilePhoto"
import { FullProfile } from "./FullProfile"
import { SIGNUP_STEP } from "./utils"
import useNetwork from "../Network/useNetwork"
import { useHistory } from "react-router";

export const Signup = () => {
    const [step, setStep] = useState(SIGNUP_STEP.LOGIN)
    const [img, setImg] = useState(null)

    const { user } = useAuth0()
    const {multipartFormPost, registered, setRegistered} = useNetwork()
    const history = useHistory()

    if (registered) {
        history.push('/')
    }

    const registerUser = async () => {

        if (!img) {
            console.error('User registration tried without a photo')
        }

        const blob = await (await fetch(img)).blob()
        const data = new FormData()
        data.append('image', blob)
        data.append('name', user.name)
        data.append('email', user.email)

        const resp = await multipartFormPost('/api/register', data)
        console.log(resp)
        if (resp.status == 201) {
            console.log('trigger register')
            setRegistered(true)
        }
        return
    }

    const handleImage = (img) => {
        setImg(img)
        setStep(SIGNUP_STEP.CONFIRM)
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center w-1/2 mx-auto mt-36 h-1/2">
                {(step == SIGNUP_STEP.LOGIN) &&
                    <Login setNextStep={setStep} />}
                {(step == SIGNUP_STEP.PHOTO &&
                    <ProfilePhoto handleImage={handleImage} />)}
                {(step == SIGNUP_STEP.CONFIRM) &&
                    <FullProfile img={img} setStep={setStep} register={registerUser}/>}
            </div>

            <div className="fixed bottom-0 inset-x-0 white-800">
                <ProgressBar step={step} setStep={setStep} />
            </div>
        </>
    )
}