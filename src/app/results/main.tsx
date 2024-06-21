"use client"

import SubmitBtn from "../_components/submitBtn"

export default function Main({chosen_bet, pdf_pass, bet, num, proceed}: {chosen_bet: number, pdf_pass: string, bet: number, num: number, proceed: () => void}) {
    return (
        <main className="flex min-h-screen flex-col items-center gap-20 p-24 pt-16">
            <h1 className="text-3xl">Results</h1>
            <div className="flex flex-col gap-5 items-center">
                <h2 className="text-2xl">Your chosen bet is: {chosen_bet || 0}</h2>
                <h2 className="text-2xl">You can verify this using the following password on your PDF: {pdf_pass}</h2>
                <h2 className="text-2xl">The random number generated is: {num}</h2>
                <h2 className="text-2xl">Your price for selling the bet was: {bet}</h2>

                {num >= chosen_bet ? (
                    <h2 className="text-2xl">The random number is greater than the chosen bet, and so your bet was sold. Congratulations!</h2>
                ) : (
                    <h2 className="text-2xl">The random number is less than the chosen bet, and so your bet will now be carried out.</h2>
                )}

            </div>
            <form action={proceed}>
                <SubmitBtn text="Proceed" loadingText="Loading..." />
            </form>
        </main>
    )
}