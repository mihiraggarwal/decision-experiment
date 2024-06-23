import { getServerSession } from "next-auth";
import dbConnect from "../_config/db";
import User from "../_models/User";
import getChosenBet from "../_actions/getChosenBet";
import Main from "./main";
import navigate from "../_actions/navigate";
import details from "../_actions/getTableDetails";

const RANDOMIZATION_SERVER_URL = process.env.RANDOMIZATION_SERVER_URL!

export default async function Bet() {
    await dbConnect()

    const session = await getServerSession()
    const user = await User.findOne({ password: session!.user.name })
    console.log(user)
    if (user.seenBet == true) await navigate("/fin")

    const { challenge, rewards } = await getChosenBet()
    let c = 0;

    console.log(challenge)

    const { colours, balls } = await details(challenge)

    return (
        <Main colours={colours} rewards={rewards} balls={balls} cp={challenge.cp!} bet={challenge.bet!} server_url={RANDOMIZATION_SERVER_URL} />
    )
}