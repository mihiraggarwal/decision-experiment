import { getServerSession } from "next-auth";
import User from "../_models/User";

export default async function Fin() {

    const session = await getServerSession();

    const user = await User.findOne( {password: session!.user.name} )
    const upi = user.upi
    const amount = user.amount

    // remove session_id from response row

    return (
        <div className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
            <h1 className="text-3xl">Thank you!</h1>
            <p>Your UPI ID is: {upi}</p>
            <p>The total amount we owe you is: {amount}</p>
            <p>We will reach out to you for the payments shortly.</p>
        </div>
    )
}
