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
            <div className="flex flex-col gap-20 items-center">

                <p>You will be asked to make a series of decisions, each of which will be to evaluate a bet by stating the lowest amount at which you would be willing to sell it, as mentioned in the instructions before. One of these decisions will now be randomly chosen to determine your payments using the previously explained protocol at the end of the experiment. This choice will be provided to you in a password-protected PDF that you can download by clicking the button below. You will receive the password and be able to view this choice only <span className="font-bold">at the end</span> of the experiment, so it is encouraged that you answer every question as if it is being used for payment.</p>

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