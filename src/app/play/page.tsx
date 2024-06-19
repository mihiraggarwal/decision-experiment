"use server";

import User from "../_models/User"

import CP1_Q1 from "../_components/questions/cp1/q1"
import CP1_Q2 from "../_components/questions/cp1/q2"

import { getServerSession } from "next-auth"
import dbConnect from "../_config/db"
import Response from "../_models/Response"
import toast, { Toaster } from "react-hot-toast"
import navigate from "../_actions/navigate"
import CP1_Q3 from "../_components/questions/cp1/q3";
import CP1_Q4 from "../_components/questions/cp1/q4";
import CP1_Q5 from "../_components/questions/cp1/q5";
import CP1_Q6 from "../_components/questions/cp1/q6";
import CP1_Q7 from "../_components/questions/cp1/q7";
import CP1_Q8 from "../_components/questions/cp1/q8";

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
    const type = formData.get("type")

    console.log(type)

    let answers: { [key: string]: number } = {}

    for (let i = 0; i < Number(total!); i++) {
        const key = `${i}`
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
            question_type: type,
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

    switch (question_num.cp) {
        case 1:
            switch (question_num.part) {
                case 1:
                    return <CP1_Q1 submit={submit} bets_order={question_num.bets_order} />;
                case 2:
                    return <CP1_Q2 submit={submit} bets_order={question_num.bets_order} />;
                case 3:
                    return <CP1_Q3 submit={submit} bets_order={question_num.bets_order} />;
                case 4:
                    return <CP1_Q4 submit={submit} bets_order={question_num.bets_order} />;
                case 5:
                    return <CP1_Q5 submit={submit} bets_order={question_num.bets_order} />;
                case 6:
                    return <CP1_Q6 submit={submit} bets_order={question_num.bets_order} />;
                case 7:
                    return <CP1_Q7 submit={submit} bets_order={question_num.bets_order} />;
                case 8:
                    return <CP1_Q8 submit={submit} bets_order={question_num.bets_order} />;
            }
        default:
            return <CP1_Q3 submit={submit} bets_order={question_num.bets_order} />;
    }
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