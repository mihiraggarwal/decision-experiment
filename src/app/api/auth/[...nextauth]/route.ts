import CredentialsProvider from "next-auth/providers/credentials"
import User from "../../../_models/User"
import NextAuth from "next-auth"

const handler = NextAuth({
    debug: process.env.NODE_ENV !== "production" ? true : false,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                upi: {
                    label: "UPI ID",
                    type: "text",
                    placeholder: "UPI ID"
                },
                otp: {
                    label: "OTP",
                    type: "password",
                    placeholder: "One time password"
                }
            },
            async authorize(credentials) {
                const user = await User.findOne({
                    password: credentials!.otp,
                });
                try {
                    user.upi = credentials!.upi
                    await user.save()
                    
                    const body = {
                        upi: credentials!.upi,
                        otp: credentials!.otp
                    }
                    return {
                        id: user._id,
                        ...body,
                        name: credentials!.otp
                    }
                }
                catch (e) {
                    console.log(e)
                    return null
                }
            }
        })
    ],
})

export { handler as GET, handler as POST }