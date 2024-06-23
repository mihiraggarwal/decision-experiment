"use client"

import { useSession } from "next-auth/react"
import Input from "../_components/input"
import { submit_iq } from "../_actions/submit"
import SubmitBtn from "../_components/submitBtn"
import Radio from "../_components/radio"

export default function IQ() {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const Question = ({num, text, placeholder}: {num: number, text: string, placeholder: string}) => {
        return (
            <div className="flex flex-col gap-2 items-center w-full">
                <p>{text}</p>
                <Input type="number" placeholder={placeholder} name={`q${num}`} />
            </div>
        )
    }
    
    return (
        <main className="flex min-h-screen flex-col gap-20 p-48 pt-16 items-center">
            <h1 className="text-3xl">IQ Questions</h1>
            <form className="flex flex-col gap-20 items-center" action={submit_iq}>
                <div className="flex flex-col gap-10">
                    <input type="hidden" name="id" value={session_id} />
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-left w-full">In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?</p>
                        <Input type="number" placeholder="Number of days" name="q1" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-left w-full">Jerry received both the 15th highest and the 15th lowest mark in the class. How many students are in the class?</p>
                        <Input type="number" placeholder="Number of students" name="q2" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-left w-full">A man buys a pig for $60, sells it for $70, buys it back for $80, and sells it finally for $90. How much has he made?</p>
                        <Input type="number" placeholder="Number of dollars" name="q3" />
                    </div>
                    <div className="flex flex-col gap-2 items-center">
                        <p className="text-left w-full">Simon decided to invest $8,000 in the stock market one day early in 2008. Six months after he invested, on July 17, the stocks he had purchased were down 50%. Fortunately for Simon, from July 17 to October 17, the stocks he had purchased went up 75%. At this point, Simon has:</p>
                        <div className="flex flex-row gap-3">
                            <Radio value={0} name="q4" label="broken even in the stock market" />
                            <Radio value={1} name="q4" label="is ahead of where he began" />
                            <Radio value={2} name="q4" label="has lost money" />
                        </div>
                    </div>
                </div>
                <SubmitBtn />
            </form>
        </main>
    )
}