import { getServerSession } from "next-auth";
import User from "../_models/User";

export default async function Fin() {

    const session = await getServerSession();

    const user = await User.findOne( {password: session!.user.name} )
    const upi = user.upi
    const iq_amount = user.amount_iq
    const total_amount = user.total_amount
    const bet_amount = total_amount - iq_amount - 100

    // remove session_id from response row

    return (
        <div className="flex min-h-screen flex-col gap-10 p-96 pt-16 items-center">
            <h1 className="text-3xl">Thank you!</h1>
            <div className="flex flex-col gap-3">
                <p>Your UPI ID is: {upi}</p>
                <p>Amount won by participating: 100</p>
                <p>Amount won from the IQ questions: {iq_amount}</p>
                <p>Amount won from selling/playing the bet: {bet_amount}</p>
                <p>The total amount we owe you is: {total_amount}</p>
                <p>We will pay you on the aforementioned UPI ID shortly.</p>
            </div>
        </div>
    )
}
