import { getServerSession } from "next-auth";
import User from "../_models/User";
import dbConnect from "../_config/db";

export default async function Fin() {

    const session = await getServerSession();
    
    let user, upi, iq_amount, total_amount, bet_amount;

    if (session) {
        await dbConnect()
        user = await User.findOne( {password: session?.user.name} )
        upi = user.upi
        iq_amount = user.amount_iq
        total_amount = user.total_amount
        bet_amount = user.amount_bet
    }

    // remove session_id from response row

    return (
        <div className="flex min-h-screen flex-col gap-10 p-96 pt-16 items-center">
            <h1 className="text-3xl">Thank you!</h1>
            <div className="flex flex-col gap-3">
                <p>Your UPI ID is: {upi}</p>
                <p>Amount won by participating: 100</p>
                <p>Amount won from the IQ questions: {iq_amount}</p>
                <p>Amount won from selling/playing the bet: {bet_amount}</p>
                <p>The total amount you won: {total_amount}</p>
                <p>You will receive this amount on the aforementioned UPI ID shortly. In case there is an error in the UPI ID displayed, note the displayed ID, and email us at decisions.experiments@ashoka.edu.in with the wrongly displayed UPI ID, and your correct one. In case you have any other queries or concerns, please feel free to reach out to us on the same email address.</p>
            </div>
        </div>
    )
}
