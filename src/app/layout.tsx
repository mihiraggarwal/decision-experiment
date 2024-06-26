import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SessionProvider from "./_components/session"
import { getServerSession } from "next-auth";
import Scroll from "./_components/scroll";

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decisions Experiments",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <Scroll />
      <body className={inter.className}>
        <Analytics />
        <SpeedInsights />
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
