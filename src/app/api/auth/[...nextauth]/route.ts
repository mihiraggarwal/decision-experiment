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
    pages: {
        signIn: "/"
    },
    callbacks: {
        jwt({ token, account, user }) {
            if (account) {
              token.accessToken = account.access_token
              token.id = user?.id
            }
            return token
          },
          session({ session, token }) {
              session.user.id = token.id;
              return session;
            },
      },
      session: {
        strategy: 'jwt',
      },
})

export { handler as GET, handler as POST }