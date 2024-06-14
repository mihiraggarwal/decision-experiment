import { NextResponse, type NextRequest } from "next/server";
import User from "../../_models/User"

export const POST = async (req: NextRequest) => {
    const body = await req.json();

    const existing = await User.findOne({ upi: body.upi })
    if (existing != null) return NextResponse.json({
        error: "User already exists"
    }, {
        status: 404
    })

    const user = await User.findOne({
        password: body.otp,
    });
    if (user == null) return NextResponse.json({
        error: "Incorrect password"
    }, {
        status: 404
    })

    try {
        user.upi = body.upi
        await user.save()
        return NextResponse.json({}, {
            status: 200
        })
    }
    catch (e) {
        console.log(e)
        return NextResponse.json({
            error: "Something went wrong!"
        }, {
            status: 404
        })
    }
}