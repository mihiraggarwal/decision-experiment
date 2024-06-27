import { getServerSession } from "next-auth"
import User from "../_models/User"
import navigate from "../_actions/navigate"
import IQ from "./main"

export default async function AddQ() {
    const session = await getServerSession()
    const password = session?.user.name

    const user = await User.findOne({ password: password })

    if (user.seenIq == true) {
        await navigate("/results")
        return <></>
    }

    user.seenIq = true
    user.amount_iq = 0
    await user.save()
    
    return <IQ />
}