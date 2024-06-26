"use server";
import { getServerSession } from "next-auth"
import toast, { Toaster } from "react-hot-toast"

import User from "../_models/User"
import Response from "../_models/Response"

import dbConnect from "../_config/db"
import navigate from "../_actions/navigate"

import CP2 from "../_components/questions/cp2";
import CP1 from "../_components/questions/cp1";
import CP3 from "../_components/questions/cp3";
import CP4 from "../_components/questions/cp4";
import CP4_Q4 from "../_components/questions/cp4_q4";
import Scroll from "../_components/scroll";

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

    const end_time = new Date()

    const total = formData.get("num")
    const id = formData.get("id")
    const type = formData.get("type")
    const start_time = new Date(formData.get("start_time") as string)

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
        console.log("null response")
        // toast.error("Something went wrong!")
        return "error"
    }
    else {
        response.response.push({
            start_time: start_time,
            end_time: end_time,
            question_type: type,
            question_index: ques_object,
            answer: answers
        })

        await response.save()

        user.current_question_index = qindex + 1
        await user.save()

        // toast.success("Response submitted!")
        if (qindex + 1 == user.order.length) {
            await navigate("/addq")
        }
        await navigate("/play")
    }
}

const QuestionComp = async ({otp}: {otp: string}) => {
    const question_num = await qnum(otp)
    const bets_order = question_num.bets_order

    switch (question_num.cp) {
        case 1:
            if (question_num.part <= 5) {
                return <CP1 submit={submit} bets_order={bets_order} total={bets_order.length} radio={false} />
            }
            else {
                return <CP1 submit={submit} bets_order={bets_order} total={bets_order.length} radio={true} />
            }
        case 2:
            if (question_num.part <= 5) {
                return <CP2 submit={submit} bets_order={bets_order} total={bets_order.length} radio={false} />
            }
            else {
                return <CP2 submit={submit} bets_order={bets_order} total={bets_order.length} radio={true} />
            }
        case 3:
            return <CP3 submit={submit} bets_order={bets_order} total={bets_order.length} radio={false} />
        case 4:
            if (question_num.part <= 3) {
                return <CP4 submit={submit} bets_order={bets_order} total={bets_order.length} radio={false} />
            }
            else {
                return <CP4_Q4 submit={submit} bets_order={bets_order} total={bets_order.length} radio={false} />
            }
    }
}

export default async function Play() {
    const session = await getServerSession()
    const otp = session?.user.name

    return (
        <>
            <Scroll />
            <Toaster position="bottom-center" />
            <div className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                <h1 className="text-3xl">Question</h1>
                <QuestionComp otp={otp} />
            </div>
        </>
    )
}