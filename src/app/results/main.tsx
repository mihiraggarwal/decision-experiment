"use client"

import { useState } from "react"
import SubmitBtn from "../_components/submitBtn"

export default function Main({chosen_bet, pdf_pass, bet, proceed, mcq, rewards, all_colours, all_balls, all_rewards, all_responses, server_url, save_price, check_price}: {chosen_bet: number, pdf_pass: string, bet: number, proceed: () => void, mcq: boolean, rewards: number[], all_colours: string[][], all_balls: number[][][], all_rewards: number[][], all_responses: number[], server_url: string, save_price: (num: number) => void, check_price: () => Promise<any>}) {

    const [loading, setLoading] = useState(false)
    const [further, setFurther] = useState(false)
    const [num, setNum] = useState(0)
    const [disable, setDisable] = useState(false)
    const [position, setPosition] = useState(0)

    const Table = ({num}: {num: number}) => {
        return (
            <table>
                <tbody>
                    <tr>
                        <td></td>
                        {all_balls[num].map((ball, index) => (
                            <th colSpan={ball[0]} key={index}>{`${ball[1]} ball${ball[1] > 1 ? "s" : ""}`}</th>
                        ))}
                    </tr>
                    <tr>
                        <td></td>
                        {all_colours[num].map((colour, index) => (
                            <th key={index}>{colour}</th>
                            
                        ))}
                    </tr>
                    <tr>
                        <th>Bet {num+1}</th>
                        {all_rewards[num].map((reward, index) => (
                            <td key={index}>{`${reward}`}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        )
    }

    const genRandom = async (rewards: number[]) => {
        setLoading(true)
        setDisable(true)
        const f = await check_price()
        if (f == -1) {
        
            const res = await fetch(`${server_url}/price`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    rewards: rewards
                })
            })
            const body = await res.json()
            await save_price(body.price)
            setNum(body.price)
        } else {
            setNum(f)
        }
        setLoading(false)
        setFurther(true)
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-20 p-24 pt-16">
            <h1 className="text-3xl">Payments</h1>
            {position == 0 && (
                <div className="flex flex-col gap-14 items-center">
                    <p>We will now determine your payment based on your responses to the choice problems earlier. Here is a list of all the bets that you evaluated during the experiment.</p>

                    <div className="flex flex-col gap-14 items-start w-full">
                        {all_rewards.map((balls, index) => (
                            <div className="flex flex-col gap-5" key={index}>
                                <Table num={index} key={index} />
                                <p>Your selling price for this bet was: {all_responses[index]}</p>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => {
                        setLoading(true)
                        setDisable(true)
                        setPosition(1)
                        setDisable(false)
                        setLoading(false)
                    }} className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-300" : "bg-white"}`} disabled={disable}>{loading ? "Loading..." : "Proceed"}</button>
                </div>
            )}

            {position == 1 && (
                <>
                    <div className="flex flex-col gap-14">
                        <div className="flex flex-col gap-3 items-start">
                            <p>Bet {chosen_bet} was chosen to be used for payment before you encountered these decision problems.</p>
                                
                            <p>You can verify this using the following password on your PDF: <span className="font-bold">{pdf_pass}</span>.</p>
                            
                            <Table num={chosen_bet-1} />
                            <p>Your selling price for the corresponding bet was {bet}.</p>
                            <p>A buying price will now be generated at random to determine whether your bet will be sold</p>
                
                            <button onClick={() => genRandom(rewards)} className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-300" : "bg-white"}`} disabled={disable}>{loading ? "Loading..." : "Generate"}</button>

                            {further && (
                                <>
                                    {mcq ? (
                                        <p>Since the question was an MCQ, your bet will be carried out.</p>
                                    ) : (
                                        <>
                                            <p>The buying price generated is {num}</p>
                                        </>
                                    )}

                                    {!mcq && num >= bet && (
                                        <p>Congratulations! Your bet was sold for INR {num}.</p>
                                    )}
                                    {!mcq && num < bet && (
                                        <p>The generated buying price is lower than your selling price. Your bet was not sold. You can now play the bet to determine your rewards.</p>
                                    )}

                                    <form action={proceed} className="flex flex-col items-center w-full">
                                        <SubmitBtn text="Proceed" loadingText="Loading..." />
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </main>
    )
}