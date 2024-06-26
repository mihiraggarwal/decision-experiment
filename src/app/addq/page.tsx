import { getServerSession } from "next-auth"
import User from "../_models/User"
import navigate from "../_actions/navigate"
import IQ from "./main"

export default async function AddQ() {
    const session = await getServerSession()
    const password = session?.user.name

    const user = await User.findOne({ password: password })

    if (user.seenBet == true) {
        await navigate("/results")
        return <></>
    }

    user.seenBet = true
    await user.save()
    
    return <IQ />
}