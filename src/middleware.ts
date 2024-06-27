// export { default } from "next-auth/middleware"

// export const config = {
//     matcher: ["/((?!fin).+)"]
// }

import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
const MAINTENANCE = process.env.MAINTENANCE

export function middleware(request: NextRequest, event: NextFetchEvent) {
    if (MAINTENANCE == "true") return NextResponse.redirect(new URL("/maintenance", request.url));
}