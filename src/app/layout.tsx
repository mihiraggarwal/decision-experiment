import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import SessionProvider from "./_components/session"
import { getServerSession } from "next-auth";
import Scroll from "./_components/scroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Comparative Ambiguity Experiment",
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
        <SessionProvider session={session} refetchOnWindowFocus={false}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
