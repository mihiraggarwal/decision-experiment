import dbConnect from "@/app/_config/db";
import { NextRequest, NextResponse } from "next/server";
import Response from "@/app/_models/Response";

export const POST = async (req: NextRequest) => {
    const body = await req.json()
    await dbConnect()
    const existing = await Response.findOne({ session_id: body.id })
    if (existing != null) {
        return NextResponse.json({}, {
            status: 401
        })
    }
    const response = new Response({
        session_id: body.id
    })
    await response.save()
    return NextResponse.json({}, {
        status: 200
    })
}