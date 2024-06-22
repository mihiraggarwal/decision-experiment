"use client";

import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { fin, saveToDB, verify } from "./play";
import navigate from "../_actions/navigate";

export default function Main({colours, rewards, cp, bet, server_url}: {colours: String[], rewards: Number[], cp: Number, bet: Number, server_url: String}) {

    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [follow, setFollow] = useState(false)
    const [data, setData] = useState<{draw_colour?: String, bet?: Number}>({})

    const { data: session } = useSession()

    const play = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        setDisabled(true)
        
        const formData = new FormData(event.currentTarget)
        const guess = formData.get("guess")
        
        console.log(guess)
        
        const f = await verify(session!.user.name)
        if (!f) await navigate("/fin")

        const rawBody: {cp: Number, bet: Number, guess: String } = {
            cp: cp,
            bet: bet,
            guess: ""
        }

        if (guess) rawBody.guess = String(guess)
        else if (cp === 3) {
            alert("Please select a colour")
            setLoading(false)
            setDisabled(false)
            return
        }

        const res = await fetch(`${server_url}/bet`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(rawBody)
        })

        // evaluate iq results and report those too
        
        console.log(res)
        const body = await res.json()
        console.log(body)

        const participation_prize = 100

        const amt_won = body.bet + participation_prize

        await saveToDB(amt_won)

        setData(body)
        setFollow(true)
        setLoading(false)
    }

    const proceed = async () => {
        setLoading2(true)
        const password = session!.user.name

        await fin(password)
        await navigate("/fin")
    }

    const Table = ({type}: {type: string}) => {
        if (type === "colours") {
            return (
                <tr>
                    <td></td>
                    {colours.map((colour, index) => (
                        <th key={index}>{colour}</th>
                        
                    ))}
                </tr>
            )
        }
        else if (type === "rewards") {
            return (
                <tr>
                    <th>Rewards</th>
                    {rewards.map((reward, index) => (
                        <td key={index}>{`${reward}`}</td>
                        
                    ))}
                </tr>
            )
        
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-20 p-24 pt-16">
            <h1 className="text-3xl">Bet</h1>
            <div className="flex flex-col gap-5 items-center">
                <p>Your chosen bet:</p>
                <table>
                    <tbody>
                        <Table type="colours" />
                        <Table type="rewards" />
                    </tbody>
                </table>

                <form onSubmit={play}>
                    <div className="flex flex-col gap-10">
                        {cp === 3 && (
                            <select name="guess">
                                <option value="Select" selected disabled>Choose a colour:</option>
                                <option value="Pink">Pink</option>
                                <option value="Orange">Orange</option>
                                <option value="Purple">Purple</option>
                                <option value="Green">Green</option>
                                <option value="Red">Red</option>
                                <option value="Black">Black</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Blue">Blue</option>
                            </select>
                        )}
                        <button type="submit" disabled={disabled}>
                            <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Loading..." : "Play"}</div>
                        </button>
                    </div>
                </form>

                {loading && (
                    <p>Drawing a colour from the urn...</p>
                )}

                {follow && (
                    <>
                        <p>Drawn colour: {data.draw_colour}</p>
                        <p>Amount won from the bet: {`${data.bet}`}</p>
                        <form onSubmit={proceed}>
                            <button type="submit" disabled={loading}>
                                <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading2 ? "Loading..." : "Proceed"}</div>
                            </button>
                        </form>
                    </>
                )}

            </div>
            
        </main>
    )
}