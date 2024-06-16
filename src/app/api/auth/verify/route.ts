import User from "@/app/_models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    console.log("function started")
    const body = await req.json()
    console.log("function running")
    try {
        const existing = await User.findOne({ upi: body.upi })
        console.log("existing", existing)
        if (existing != null) {
            console.log("in existing")
            return NextResponse.json({
                error: "User already exists",
            }, {
                status: 401
            })
        }
    } catch (e) {
        console.log("user find error", e)
    }

    console.log("reached after")
    const user = await User.findOne({
        password: body.otp,
    });
    console.log("user", user)
    if (user == null) {
        console.log("in user null")
        return NextResponse.json({
            error: "Incorrect password",
        }, {
            status: 401
        })
    }

    console.log("final")
    return NextResponse.json({}, {
        status: 200
    })
}