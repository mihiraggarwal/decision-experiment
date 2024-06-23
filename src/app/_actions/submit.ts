"use server";

import { getServerSession } from "next-auth";
import dbConnect from "../_config/db";

import Response from "../_models/Response";
import navigate from "./navigate";

const TOTAL_QUESTIONS = 4

export async function submit_iq(formData: FormData) {

    const id = formData.get("id")

    let answers: Number[] = []
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
        answers.push(Number(formData.get(`q${i+1}`)))
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
            response.iq = answers

            await response.save()
            await navigate("/results")
        }
        else {
            console.log("iq already submitted")
            return
        }
    }
}