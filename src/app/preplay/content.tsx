"use client"

import { useEffect, useState } from "react"
import navigate from "../_actions/navigate"

export default function Page ({total_bets}: {total_bets: number}) {
    const [disableDownload, setDisableDownload] = useState(true)
    const [disableNext, setDisableNext] = useState(true)

    console.log(total_bets)
    useEffect(() => {
        if (total_bets > 0) setDisableDownload(false)
    }, [total_bets])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between gap-10 p-24 pt-16">
            <h1 className="text-3xl">Randomization</h1>
            <div className="flex flex-col gap-20 items-center">

                {!disableDownload &&
                    <a href="/api/file">
                        <button type="submit" className="border border-black rounded-md py-2 px-5" onClick={() => {setDisableNext(false)}}>Download file</button>
                    </a>
                }


                {!disableNext &&
                    <div className="flex flex-col items-center gap-5">
                        <div>Click the button below to start the experiment. <span className="text-red-600">Make sure you have the above file downloaded first!</span></div>
                        <button onClick={async () => await navigate("/play")}>
                            <div className="border border-black rounded-md py-2 px-5">Next</div>
                        </button>
                    </div>
                }

            </div>        

            <div></div>
        </main>
    )
}