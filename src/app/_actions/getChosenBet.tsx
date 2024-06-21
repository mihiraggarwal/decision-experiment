import { getServerSession } from "next-auth";
import User, { Users } from "../_models/User";
import Response from "../_models/Response"

import { cp1_bet1, cp1_bet2, cp1_bet3, cp1_bet4, cp2_bet1, cp2_bet2, cp2_bet3, cp2_bet4, cp3_bet1, cp3_bet2, cp4_bet1, cp4_bet2, cp4_bet3 } from "../_assets/bets";

export default async function getChosenBet() {
    const session = await getServerSession();
    const user = await User.findOne({ password: session?.user.name })

    const chosen_bet = user.chosen_bet || 2
    const pdf_pass = user.pdf_pass
    const order = user.order
    const price = user.price

    const answer = await Response.findOne({ session_id: user.id })
    const response = answer.response

    let c = 0
    let bet;
    const challenge: {cp?: Number, part?: Number, bet?: Number} = {}

    for (let i = 0; i < response.length; i++) {
        const len = response[i].question_index.bets_order.length
        if (c + len < chosen_bet) {
            c += len
        } 
        else {
            const index = chosen_bet - c - 1
            bet = response[i].answer[index]
            challenge.cp = order[i].cp
            challenge.part = order[i].part
            challenge.bet = order[i].bets_order[index]
            break;
        }
    }

    let rewards: number[] = []
    switch (challenge.cp) {
        case 1:
            switch (challenge.bet) {
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
            switch (challenge.bet) {
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
            switch (challenge.bet) {
                case 1:
                    rewards = cp3_bet1
                    break;
                case 2:
                    rewards = cp3_bet2
                    break;
            }
            break;
        case 4:
            switch (challenge.bet) {
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

    return {
        chosen_bet,
        pdf_pass,
        bet,
        challenge,
        rewards,
        price
    }
}