import Main from "./main"

import { getServerSession } from "next-auth";
import User from "../_models/User";
import Response from "../_models/Response";
import dbConnect from "../_config/db";
import navigate from "../_actions/navigate";

import getChosenBet from "../_actions/getChosenBet";
import { saveToDB } from "../bet/play";
import details from "../_actions/getTableDetails";

import { cp1_bet1, cp1_bet2, cp1_bet3, cp1_bet4, cp2_bet1, cp2_bet2, cp2_bet3, cp2_bet4, cp3_bet1, cp3_bet2, cp4_bet1, cp4_bet2, cp4_bet3 } from "../_assets/bets";

const RANDOMIZATION_SERVER_URL = process.env.RANDOMIZATION_SERVER_URL!

const savePrice = async (num: number) => {
    "use server"
    const session = await getServerSession()
    await User.findOneAndUpdate({ password: session?.user.name }, { price: num })
}

const checkForPrice = async() => {
    "use server"
    const session = await getServerSession();
    const user = await User.findOne({ password: session?.user.name })

    const price = user.price
    if (price != null) return price
    return -1
}

export default async function Results() {

    await dbConnect()

    const session = await getServerSession();
    const user = await User.findOne({ password: session?.user.name })

    const chosen_bet = user.chosen_bet
    const pdf_pass = user.pdf_pass
    const order = user.order

    const answer = await Response.findOne({ session_id: user.id })
    const response = answer.response

    const all_colours = []
    const all_balls = []
    const all_rewards = []
    const all_responses = []

    for (let i = 0; i < order.length; i++) {
        for (let j = 0; j < order[i].bets_order.length; j++) {
            const { colours, balls } = await details({cp: order[i].cp, part: order[i].part, bet: order[i].bets_order[j]})
            all_colours.push(colours)
            all_balls.push(balls)
            all_responses.push(response[i].answer[j])

            let rewards: number[] = []

            switch (order[i].cp) {
                case 1:
                    switch (order[i].bets_order[j]) {
                        case 1:
                            rewards = cp1_bet1
                            break;
                        case 2:
                            rewards = cp1_bet2
                            break;
                        case 3:
                            rewards = cp1_bet3
                            break;
                        case 4:
                            rewards = cp1_bet4
                            break;
                    }
                    break;
                case 2:
                    switch (order[i].bets_order[j]) {
                        case 1:
                            rewards = cp2_bet1
                            break;
                        case 2:
                            rewards = cp2_bet2
                            break;
                        case 3:
                            rewards = cp2_bet3
                            break;
                        case 4:
                            rewards = cp2_bet4
                            break;
                    }
                    break;
                case 3:
                    switch (order[i].bets_order[j]) {
                        case 1:
                            rewards = cp3_bet1
                            break;
                        case 2:
                            rewards = cp3_bet2
                            break;
                    }
                    break;
                case 4:
                    switch (order[i].bets_order[j]) {
                        case 1:
                            rewards = cp4_bet1
                            break;
                        case 2:
                            rewards = cp4_bet2
                            break;
                        case 3:
                            rewards = cp4_bet3
                            break;
                    }
                    break;
            }
            all_rewards.push(rewards)
        }
    }

    const { bet, challenge, rewards } = await getChosenBet()
    console.log(session?.user.name, bet, challenge, rewards)

    const mcq = Number(challenge.part!) >= 6

    const proceed = async () => {
        "use server"

        const user = await User.findOne({ password: session?.user.name })
        const num = user.price

        console.log(session?.user.name, num, bet)

        if (num >= bet) {
            const user = await User.findOne({ password: session?.user.name })
            const id = user.id

            user.fin = true
            user.amount_bet = num
            user.total_amount = user.amount_iq + num + 100
            await user.save()

            await Response.findOneAndUpdate({ session_id: id }, { fin: true })
            await navigate("/fin")
        }
        else {
            await navigate("/bet")
        }
    }

    return (
        <Main chosen_bet={chosen_bet} pdf_pass={pdf_pass} bet={bet} proceed={proceed} mcq={mcq} rewards={rewards} all_colours={all_colours} all_balls={all_balls} all_rewards={all_rewards} all_responses={all_responses} server_url={RANDOMIZATION_SERVER_URL} save_price={savePrice} check_price={checkForPrice} />
    )
}