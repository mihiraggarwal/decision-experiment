import PDFDocument from "pdfkit"
import blobStream from "blob-stream"
import dbConnect from "@/app/_config/db"
import { getServerSession } from "next-auth"
import User from "@/app/_models/User"
import path from "path"

const getPdf = async (bet: number, pass: string) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({font: path.join(process.cwd(), "public/assets/fonts/AirbnbCerealBook.ttf"), userPassword: pass})
    const stream = doc.pipe(blobStream())

    doc.fontSize(25).text(`Your chosen bet: Bet ${bet}`, 100, 80);
    doc.end()

    stream.on("finish", async () => {
        const final = stream.toBlob("application/pdf")
        return resolve(final)
    })
  })
}

export async function GET() {
  const session = await getServerSession()
  console.log(session)

  await dbConnect()
  const user = await User.findOne({ password: session?.user.name })
  const bets = user.total_bets

  const chosen_bet = Math.floor(Math.random() * bets) + 1

  const randomString = (length: number, chars: string) => {
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }
  
  const pass = randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  const buffer = await getPdf(chosen_bet, pass) as Blob

  user.pdf_pass = pass
  await user.save()

  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="choice.pdf"');
  headers.append("Content-Type", "application/pdf");

  return new Response(buffer, {
    headers,
  });
}