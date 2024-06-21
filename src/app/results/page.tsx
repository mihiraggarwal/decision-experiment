import Main from "./main"

import { getServerSession } from "next-auth";
import User from "../_models/User";
import Response from "../_models/Response";
import dbConnect from "../_config/db";
import navigate from "../_actions/navigate";

const getChosenBet = async () => {
    const session = await getServerSession();
    const user = await User.findOne({ password: session?.user.name })

    const chosen_bet = user.chosen_bet
    const pdf_pass = user.pdf_pass

    const answer = await Response.findOne({ session_id: user.id })
    const response = answer.response

    let c = 0
    let bet;

    for (let i of response) {
        const len = i.question_index.bets_order.length
        if (c + len < chosen_bet) {
            c += len
        } 
        else {
            const index = chosen_bet - c - 1
            bet = i.answer[index]
            break;
        }
    }

    return {
        chosen_bet,
        pdf_pass,
        bet
    }
}

const genRandom = () => {
    return Math.floor(Math.random() * 100)
}

export default async function Results() {

    await dbConnect()

    const { chosen_bet, pdf_pass, bet } = await getChosenBet()
    const num = genRandom()

    const proceed = async () => {
        "use server"
        if (num > bet) {
            await navigate("/fin")
        }
        else {
            await navigate("/bet")
        }
    }

    return (
        <Main chosen_bet={chosen_bet} pdf_pass={pdf_pass} bet={bet} num={num} proceed={proceed} />
    )
}