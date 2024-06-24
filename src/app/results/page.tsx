import Main from "./main"

import { getServerSession } from "next-auth";
import User from "../_models/User";
import dbConnect from "../_config/db";
import navigate from "../_actions/navigate";

import getChosenBet from "../_actions/getChosenBet";
import { saveToDB } from "../bet/play";
import details from "../_actions/getTableDetails";

const RANDOMIZATION_SERVER_URL = process.env.RANDOMIZATION_SERVER_URL!

const genRandom = async (rewards: number[]) => {
    const res = await fetch(`${RANDOMIZATION_SERVER_URL}/price`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            rewards: rewards
        })
    })
    const body = await res.json()
    return body.price
}

const savePrice = async (num: number) => {
    const session = await getServerSession()
    await User.findOneAndUpdate({ password: session?.user.name }, { price: num })
}

export default async function Results() {

    await dbConnect()

    const { chosen_bet, pdf_pass, bet, challenge, rewards, price } = await getChosenBet()

    const mcq = Number(challenge.part!) >= 6
    
    let num;
    if (mcq) num = -1
    else {
        if (!price) {
            num = await genRandom(rewards)
            await savePrice(num)
        }
        else {
            num = price
        }
    }

    const { colours, balls } = await details(challenge)

    const session = await getServerSession()

    const proceed = async () => {
        "use server"
        if (num >= bet) {
            await User.findOneAndUpdate({ password: session?.user.name }, { fin: true, amount_bet: num, $inc : { total_amount: num } })
            await navigate("/fin")
        }
        else {
            await navigate("/bet")
        }
    }

    return (
        <Main chosen_bet={chosen_bet} pdf_pass={pdf_pass} bet={bet} num={num} proceed={proceed} mcq={mcq} colours={colours} balls={balls} rewards={rewards} />
    )
}