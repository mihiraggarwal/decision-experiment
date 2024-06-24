"use server";

import { getServerSession } from "next-auth";
import User from "../_models/User";

export async function saveToDB(amount: number) {
    const session = await getServerSession();    
    const password = session!.user.name;

    const user = await User.findOne({ password: password })
    user.amount_bet = amount
    user.total_amount = user.amount_iq + amount + 100
    await user.save()
}

export async function makeSeenBet() {
    const session = await getServerSession();
    const password = session!.user.name

    await User.findOneAndUpdate({ password: password }, { seenBet: true })
}

export async function fin(password: string) {
    await User.findOneAndUpdate({ password: password }, { fin: true })
}

export async function verify(password: string) {
    const user = await User.findOne({ password: password })
    if (user.seenBet) return false
    return true
}