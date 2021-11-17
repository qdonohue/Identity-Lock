import { useState } from "react"
import { Login } from "./Login"
import { ProgressBar } from "./ProgressBar"

import { SIGNUP_STEP } from "./utils"

export const Signup = () => {
    const [step, setStep] = useState(SIGNUP_STEP.LOGIN)

    return (
        <div class="flex flex-col justify-between items-center h-screen">
            <div class="flex-grow items-center justify-center min-w-max">
                {(step == SIGNUP_STEP.LOGIN) &&
                    <Login setNextStep={setStep}/>}
            </div>
            <div class="fixed bottom-0 inset-x-0">
                <ProgressBar step={step} setStep={setStep} />
            </div>
        </div>
    )
}