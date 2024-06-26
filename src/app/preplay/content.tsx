"use client"

import { useEffect, useState } from "react"
import navigate from "../_actions/navigate"

export default function Page ({total_bets}: {total_bets: number}) {
    const [disableDownload, setDisableDownload] = useState(true)
    const [disableNext, setDisableNext] = useState(true)
    const [loading, setLoading] = useState(false)

    console.log(total_bets)
    useEffect(() => {
        if (total_bets > 0) setDisableDownload(false)
    }, [total_bets])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between gap-10 p-24 pt-16">
            <h1 className="text-3xl">Randomization</h1>
            <div className="flex flex-col gap-8 items-center">

                <p>You will be asked to make a series of decisions, each of which will be to state the lowest price at which you would be willing to sell a bet.</p>

                <ul className="list-disc list-inside">
                    <li>One randomly chosen decision will be used to determine your payment as per the previously explained protocol</li>
                    <li>This choice will be made now and provided to you in a password-protected PDF that you can download by clicking the button below</li>
                    <li>Note that the password for the PDF is <span className = "font-bold">different</span> from the password you used to enter the experiment</li>
                    <li>You will receive the password for the PDF at the <span className = "font-bold">end of the experiment</span>, and will not know which decision is used for payment until then.</li>
                    <li>Therefore, you should make every decision as if it might be used to determine your payment</li>
                </ul>

                {!disableDownload &&
                    <a href="/api/file">
                        <button type="submit" className="border border-black rounded-md py-2 px-5" onClick={() => {setDisableNext(false)}}>Download file</button>
                    </a>
                }

                {!disableNext &&
                    <div className="flex flex-col items-center gap-5">
                        <div>Click the button below to start the experiment. <span className="text-red-600">Make sure you have the above file downloaded first!</span></div>
                        <button disabled={loading} onClick={async () => {
                            setLoading(true)
                            await navigate("/play")
                        }}>
                            <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Loading..." : "Next"}</div>
                        </button>
                    </div>
                }

            </div>        

            <div></div>
        </main>
    )
}