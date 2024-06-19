"use server";

import User from "../_models/User"

import CP1_Q1 from "../_components/questions/cp1/q1"
import CP1_Q2 from "../_components/questions/cp1/q2"

import { getServerSession } from "next-auth"
import dbConnect from "../_config/db"
import Response from "../_models/Response"
import toast, { Toaster } from "react-hot-toast"
import navigate from "../_actions/navigate"

const qnum = async (otp: string) => {    
    await dbConnect()
    const user = await User.findOne({
        password: otp
    })
    
    try {
        let qindex = user.current_question_index
        if (qindex == null) qindex = 0

        const order = user.order
        const ques_object = order[qindex]

        return ques_object
    }
    catch (e) {
        console.log(e)
    }
}

const submit = async (formData: FormData) => {
    "use server"
    const total = formData.get("num")
    const id = formData.get("id")

    let answers: { [key: string]: number } = {}

    for (let i = 0; i < Number(total!); i++) {
        const key = `${i+1}`
        answers[key] = Number(formData.get(`price${i+1}`))
    }

    const session = await getServerSession()
    const password = session?.user.name

    await dbConnect()
    const user = await User.findOne({ password: password })

    let qindex = user.current_question_index
    if (qindex == null) qindex = 0

    const order = user.order
    const ques_object = order[qindex]

    const response = await Response.findOne({ session_id: id })
    if (response == null) {
        // toast.error("Something went wrong!")
        return "error"
    }
    else {
        response.response.push({
            question_index: ques_object,
            answer: answers
        })

        await response.save()

        user.current_question_index = qindex + 1
        await user.save()

        // toast.success("Response submitted!")
        await navigate("/play")
    }
}

const QuestionComp = async ({otp}: {otp: string}) => {
    const question_num = await qnum(otp)
    if (question_num.cp == 1) {
        if (question_num.part == 1) {
            return <CP1_Q1 submit={submit} />
        }
        else if (question_num.part == 2) {
            return <CP1_Q2 submit={submit} />
        }
        return <CP1_Q2 submit={submit} />
    }
    return <CP1_Q2 submit={submit} />
}

export default async function Play() {
    const session = await getServerSession()
    const otp = session?.user.name

    return (
        <>
            <Toaster position="top-right" />
            <div className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                <h1 className="text-3xl">Question</h1>
                <QuestionComp otp={otp} />
            </div>
        </>
    )
}