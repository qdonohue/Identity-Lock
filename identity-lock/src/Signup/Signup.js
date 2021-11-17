import { useState } from "react"
import { ProgressBar } from "./ProgressBar"

import { SIGNUP_STEP } from "./utils"

export const Signup = () => {
    const [step, setStep] = useState(SIGNUP_STEP.LOGIN)

    const dummy = () => {
        if (step < SIGNUP_STEP.CONFIRM) {
            setStep(step + 1)
        } else {
            setStep(SIGNUP_STEP.LOGIN)
        }
    }

    console.log(`Current step: ${step}`)
    return (
        <div>
            <div onClick={dummy}>Click here plz</div>
            <ProgressBar step={step} setStep={setStep} />
        </div>
    )
}