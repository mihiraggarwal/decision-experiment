import dbConnect from "@/app/_config/db";
import User from "@/app/_models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json()
    console.log(body)
    await dbConnect()
    try {
        const existing = await User.findOne({ upi: body.upi })
        if (existing != null) {
            return NextResponse.json({
                error: "User already exists",
            }, {
                status: 401
            })
        }
    } catch (e) {
        console.log("error finding user:", e)
    }

    const user = await User.findOne({
        password: body.otp,
    });
    if (user == null) {
        return NextResponse.json({
            error: "Incorrect password",
        }, {
            status: 401
        })
    }

    if (user.upi != null) {
        return NextResponse.json({
            error: "User already exists",
        }, {
            status: 401
        })
    }

    return NextResponse.json({}, {
        status: 200
    })
}