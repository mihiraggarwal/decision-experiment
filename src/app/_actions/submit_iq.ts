"use server";

import { getServerSession } from "next-auth";
import dbConnect from "../_config/db";

import Response from "../_models/Response";
import navigate from "./navigate";

export default async function submit_iq(formData: FormData) {

    const id = formData.get("id")

    let answers = []
    for (let i = 0; i < 4; i++) {
        answers.push(formData.get(`q${i+1}`))
    }
    
    const session = await getServerSession()
    const password = session?.user.name

    await dbConnect()

    const response = await Response.findOne({ session_id: id })
    if (response == null) {
        console.log("null response")
    }
    else {
        response.iq = answers
        
        await response.save()
        await navigate("/results")
    }
}