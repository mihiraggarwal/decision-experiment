"use server";

import { getServerSession } from "next-auth";
import dbConnect from "../_config/db";

import Response from "../_models/Response";
import navigate from "./navigate";
import Question from "../_models/Question";
import User from "../_models/User";

const TOTAL_QUESTIONS = 8

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

            const iq = await Question.findOne({ type: "iq" })
            const iq_answers = iq.iq_answers

            const len = answers.length

            const randomIndexes: number[] = [];
            while (randomIndexes.length < 3) {
                const randomIndex = Math.floor(Math.random() * len);
                if (!randomIndexes.includes(randomIndex)) {
                    randomIndexes.push(randomIndex);
                }
            }

            let iq_amount = 0
            for (let i = 0; i < 3; i++) {
                if (answers[randomIndexes[i]] == iq_answers[randomIndexes[i]]) {
                    iq_amount += 50
                }
            }

            await User.findOneAndUpdate({ password: password }, { amount_iq: iq_amount, total_amount: iq_amount + 100 })
            await navigate("/results")
        }
        else {
            console.log("iq already submitted")
            return
        }
    }
}

export async function submit_training_1(formData: FormData) {

    await dbConnect()

    const total_questions = 3;
    const options = 4;

    const response = []
    for (let i = 1; i <= total_questions; i++) {
        for (let j = 1; j <= options; j++) {
            const k = formData.get(`q${i}_${j}`)
            if (k != null) response.push(formData.get(`q${i}_${j}`))
            else response.push(0)
        }
    }

    const doc = await Question.findOne({ type: "training", index: 1 })
    const answer = doc.answer

    for (let i = 0; i < (total_questions * options); i++) {
        if (response[i] != answer[i]) {
            return false
        }
    }
    return true
}