import dbConnect from "./_config/db";
import Landing from "./_components/landing";

export default async function Home() {
  await dbConnect()

  return <Landing />
}