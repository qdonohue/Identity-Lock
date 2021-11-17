import { useState } from "react"
import { Login } from "./Login"
import { ProgressBar } from "./ProgressBar"
import {ProfilePhoto} from "./ProfilePhoto"
import { FullProfile } from "./FullProfile"

import { SIGNUP_STEP } from "./utils"

export const Signup = () => {
    const [step, setStep] = useState(SIGNUP_STEP.LOGIN)
    const [img, setImg] = useState(null)

    console.log(`Current step is: ${step}`)

    return (
        <>
            <div class="flex flex-col justify-center items-center w-1/2 mx-auto mt-36 h-1/2">
                    {(step == SIGNUP_STEP.LOGIN) &&
                        <Login setNextStep={setStep} />}
                    {(step == SIGNUP_STEP.PHOTO &&
                    <ProfilePhoto setImg={setImg} setStep={setStep}/>)}
                    {/* {(step == SIGNUP_STEP.CONFIRM) &&
                    <FullProfile img={img} setStep={setStep} />} */}
            </div>

            <div class="fixed bottom-0 inset-x-0 white-800">
                <ProgressBar step={step} setStep={setStep} />
            </div>
        </>
    )
}