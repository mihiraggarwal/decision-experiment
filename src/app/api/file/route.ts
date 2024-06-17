import PDFDocument from "pdfkit"
import blobStream from "blob-stream"

const getPdf = async () => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({font: "public/assets/fonts/AirbnbCerealBook.ttf", userPassword: "lmao"})
    const stream = doc.pipe(blobStream())

    doc.fontSize(25).text('Testing', 100, 80);
    doc.end()

    stream.on("finish", async () => {
        const final = await stream.toBlob("application/pdf")
        return resolve(final)
    })
  })
}

export async function GET() {
  const buffer = await getPdf() as Blob

  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="choice.pdf"');
  headers.append("Content-Type", "application/pdf");

  return new Response(buffer, {
    headers,
  });
}