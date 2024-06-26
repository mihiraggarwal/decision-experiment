import dbConnect from "@/app/_config/db";
import { NextRequest, NextResponse } from "next/server";
import Response from "@/app/_models/Response";

export const POST = async (req: NextRequest) => {
    const body = await req.json()
    console.log(body)
    await dbConnect()
    const existing = await Response.findOne({ session_id: body.id })
    console.log(existing)
    if (existing != null) {
        console.log("existing not null")
        return NextResponse.json({}, {
            status: 401
        })
    }
    const response = new Response({
        session_id: body.id,
        train_price: body.train_price
    })
    console.log(response)
    await response.save()
    console.log("saved")
    return NextResponse.json({}, {
        status: 200
    })
}