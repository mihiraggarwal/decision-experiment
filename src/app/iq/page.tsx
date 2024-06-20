"use client"

import { useSession } from "next-auth/react"
import Input from "../_components/input"
import submit_iq from "../_actions/submit_iq"

export default function IQ() {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const Question = ({num}: {num: number}) => {
        return (
            <div className="flex flex-col gap-2">
                <p>What is the capital of France?</p>
                <Input type="number" placeholder="Antananarivo" name={`q${num}`} />
            </div>
        )
    }
    
    return (
        <main className="flex min-h-screen flex-col items-center gap-20 p-24 pt-16">
            <h1 className="text-3xl">IQ Questions</h1>
            <form className="flex flex-col gap-20 items-center" action={submit_iq}>
                <div className="flex flex-col gap-10 items-center">
                    <input type="hidden" name="id" value={session_id} />
                    <Question num={1}/>
                    <Question num={2}/>
                    <Question num={3}/>
                    <Question num={4}/>
                </div>
                <button type="submit">
                    <div className="border border-black rounded-md py-2 px-5">Submit</div>
                </button>
            </form>
        </main>
    )
}