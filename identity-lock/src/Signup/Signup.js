import { useState } from "react"
import { Login } from "./Login"
import { ProgressBar } from "./ProgressBar"
import {ProfilePhoto} from "./ProfilePhoto"

import { SIGNUP_STEP } from "./utils"

export const Signup = () => {
    const [step, setStep] = useState(SIGNUP_STEP.LOGIN)

    return (
        <>
            <div class="flex flex-col justify-between items-center h-screen">
                <div class="flex-grow items-center justify-center min-w-max">
                    {(step == SIGNUP_STEP.LOGIN) &&
                        <Login setNextStep={setStep} />}
                    {(step == SIGNUP_STEP.PHOTO &&
                    <ProfilePhoto />)}
                </div>
                <div class="pb-25%" />
            </div>

            <div class="fixed bottom-0 inset-x-0 white-800">
                <ProgressBar step={step} setStep={setStep} />
            </div>
        </>
    )
}