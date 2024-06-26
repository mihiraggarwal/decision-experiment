"use server";

import { getServerSession } from "next-auth";
import User from "../_models/User";
import Response from "../_models/Response";

export default async function emptyIq() {
    console.log("empty iq")

    const end_time = new Date();
    const start_time = new Date();
    start_time.setMinutes(end_time.getMinutes() - 10);

    const session = await getServerSession();
    const password = session?.user.name;

    const answers = [-1, -1, -1, -1, -1, -1, -1, -1]

    try {
        const user = await User.findOne({ password: password });
        const response = await Response.findOneAndUpdate({ session_id: user.id }, { iq: { start_time: start_time, end_time: end_time, response: answers } } );
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}