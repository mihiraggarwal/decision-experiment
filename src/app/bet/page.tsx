import { getServerSession } from "next-auth";
import dbConnect from "../_config/db";
import User from "../_models/User";
import getChosenBet from "../_actions/getChosenBet";
import Main from "./main";
import navigate from "../_actions/navigate";

const RANDOMIZATION_SERVER_URL = process.env.RANDOMIZATION_SERVER_URL!

export default async function Bet() {
    await dbConnect()

    const session = await getServerSession()
    const user = await User.findOne({ password: session!.user.name })
    console.log(user)
    if (user.amount) await navigate("/fin")

    const { challenge, rewards } = await getChosenBet()
    let c = 0;

    console.log(challenge)

    let colours: String[] = []
    switch (challenge.cp) {
        case 1:
            colours = ["Purple", "White", "Red", "Yellow", "Blue", "Green"]
            break;
        case 2:
            colours = ["Blue", "Yellow", "Pink", "Orange"]
            break;
        case 3:
            colours = ["Chosen Colour", "Other Colours"]
            break;
        case 4:
            switch (challenge.bet) {
                case 1:
                case 2:
                    colours = ["Green", "Red", "Purple"]
                    break;
                case 3:
                    colours = ["Yellow", "Cyan"]
                    break;
            }
    }

    return (
        <Main colours={colours} rewards={rewards} cp={challenge.cp!} bet={challenge.bet!} server_url={RANDOMIZATION_SERVER_URL} />
    )
}