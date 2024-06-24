"use server";

import { getServerSession } from "next-auth";
import dbConnect from "../_config/db";

import Response from "../_models/Response";
import navigate from "./navigate";

const TOTAL_QUESTIONS = 3

export async function submit_iq(values: {[key: string]: string | number | undefined | FormDataEntryValue | null}) {

    const id = values["id"]
    const start_time = new Date(values["start_time"] as string)

    const end_time = new Date()

    let answers: Number[] = []
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        if (values[`q${i+1}`] == null) {
            answers.push(-1)
        }
        else {
            answers.push(Number(values[`q${i+1}`]))
        }
    }
    
    const session = await getServerSession()
    const password = session?.user.name

    await dbConnect()

    const response = await Response.findOne({ session_id: id })
    if (response == null) {
        console.log("null response")
        return
    }
    else {
        if (response.iq == null || response.iq.length == 0) {
            response.iq = {
                start_time: start_time,
                end_time: end_time,
                response: answers
            }

            await response.save()
            await navigate("/results")
        }
        else {
            console.log("iq already submitted")
            return
        }
    }
}