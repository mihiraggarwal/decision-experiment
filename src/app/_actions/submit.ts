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
        if (response.iq == null || response.iq.response.length == 0) {
            response.iq = {
                start_time: start_time,
                end_time: end_time,
                response: answers
            }

            console.log(response)
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

            console.log(password, iq_amount)

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

    const status = {
        correct: true,
        response: ""
    }

    const wrong = []

    for (let i = 0; i < total_questions; i++) {
        let error = false
        for (let j = 0; j < options; j++) {
            if (response[(options*i)+j] != answer[(options*i)+j]) {
                status.correct = false
                if (!error) {
                    error = true
                    wrong.push((i + 1).toString())
                }
            }
        }
    }

    if (!status.correct) {
        const ques = wrong.join(", ")
        status.response = `Your answers to ${ques.length > 1 ? "questions" : "question"} ${ques} are incorrect. To help with your understanding during the experimental tasks, please try again.`
    }
    return status
}

export const submit_training_2 = async (formData: FormData) => {

    await dbConnect()

    const q_responses = [formData.get("q1"), formData.get("q2")]

    const doc = await Question.findOne({ type: "training", index: 2 })
    const answer = doc.answer

    const status = {
        correct: true,
        response: ""
    }

    const wrong = []

    for (let i = 0; i < 2; i++) {
        if (q_responses[i] != answer[i]) {
            status.correct = false
            wrong.push((i + 1).toString())
        }
    }

    if (!status.correct) {
        const ques = wrong.join(", ")
        status.response = `Your answers to ${ques.length > 1 ? "questions" : "question"} ${ques} are incorrect. To help with your understanding during the experimental tasks, please try again.`
    }
    return status
}

export const submit_training_3 = async (formData: FormData) => {
    await dbConnect()

    const q_responses = [formData.get("q1"), formData.get("q2"), formData.get("q3"), formData.get("q4")]

    const doc = await Question.findOne({ type: "training", index: 3 })
    const answer = doc.answer

    const status = {
        correct: true,
        response: ""
    }

    const wrong = []

    for (let i = 0; i < 4; i++) {
        if (q_responses[i] != answer[i]) {
            status.correct = false
            wrong.push((i + 1).toString())
        }
    }

    if (!status.correct) {
        const ques = wrong.join(", ")
        status.response = `Your answers to ${ques.length > 1 ? "questions" : "question"} ${ques} are incorrect. To help with your understanding during the experimental tasks, please try again.`
    }

    if (status.correct) {
        const session = await getServerSession()
        await User.findOneAndUpdate({ password: session!.user.name }, { trained: true })
    }

    return status
}