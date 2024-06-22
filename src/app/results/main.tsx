"use client"

import SubmitBtn from "../_components/submitBtn"

export default function Main({chosen_bet, pdf_pass, bet, num, proceed, mcq, colours, balls, rewards}: {chosen_bet: number, pdf_pass: string, bet: number, num: number, proceed: () => void, mcq: boolean, colours: string[], balls: number[][], rewards: number[]}) {

    const Table = () => {
        return (
            <table>
                <tbody>
                    <tr>
                        <td></td>
                        {balls.map((ball, index) => (
                            <th colSpan={ball[0]} key={index}>{`${ball[1]} ball${ball[1] > 1 ? "s" : ""}`}</th>
                        ))}
                    </tr>
                    <tr>
                        <td></td>
                        {colours.map((colour, index) => (
                            <th key={index}>{colour}</th>
                            
                        ))}
                    </tr>
                    <tr>
                        <th>Rewards</th>
                        {rewards.map((reward, index) => (
                            <td key={index}>{`${reward}`}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        )
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-20 p-24 pt-16">
            <h1 className="text-3xl">Results</h1>
            <div className="flex flex-col gap-5 items-center">
                <p>The decision to be used for payment is: {chosen_bet}</p>
                <p>You can verify this using the following password on your PDF: {pdf_pass}</p>
                <Table />

                {mcq ? (
                    <p>Since the question was an MCQ, your bet will be carried out.</p>
                ) : (
                    <>
                        <p>Your price for selling the bet was: {bet}</p>
                        <p>The price the buyer is billing to buy at is: {num}</p>
                    </>
                )}

                
                {!mcq && num >= bet && (
                    <p>The buyer&apos;s price is greater than your price, and so your bet was sold. Congratulations!</p>
                )}
                {!mcq && num < bet && (
                    <p>The buyer&apos;s price is less than your price, and so you will now get to play the above bet.</p>
                )}

            </div>
            <form action={proceed}>
                <SubmitBtn text="Proceed" loadingText="Loading..." />
            </form>
        </main>
    )
}