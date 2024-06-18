import { useSession } from "next-auth/react"
import Question from "../_models/Question"
import User from "../_models/User"
import Response from "../_models/Response"
import navigate from "../_actions/navigate"
import Input from "../_components/input"

import CP1_Q1a from "../_components/questions/cp1/q1a"
import CP1_Q1b from "../_components/questions/cp1/q1b"

import { getServerSession } from "next-auth"
import dbConnect from "../_config/db"

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

const submit = async () => {
    "use server"
}

const QuestionComp = async ({otp}: {otp: string}) => {
    const question_num = await qnum(otp)
    if (question_num.cp == 1) {
        if (question_num.part == 1) {
            if (question_num.subpart == 1) {
                return <CP1_Q1a />
            }
            return <CP1_Q1b />
        }
        return <CP1_Q1b />
    }
}

export default async function Play() {
    const session = await getServerSession()
    const otp = session?.user.name

    return (
        <div className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
            <h1 className="text-3xl">Question</h1>
            <QuestionComp otp={otp} />
            <form action={submit} className="flex flex-row gap-1">
                <Input type="number" placeholder="Price" name="price" />
                <button type="submit">
                    <div className="border border-black rounded-md py-2 px-5">Submit</div>
                </button>
            </form>
        </div>
    )
}