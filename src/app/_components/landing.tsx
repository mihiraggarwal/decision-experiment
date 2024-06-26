"use client"

import { FormEvent, useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import navigate from "../_actions/navigate"

import { signIn } from "next-auth/react"

export default function Landing() {

  const [loading, setLoading] = useState(false)

  const authorize = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget);
  
    const rawBody = {
      upi: formData.get("upi"),
      otp: formData.get("otp")
    }
  
    const verify = await fetch("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify(rawBody)
    })
  
    if (!verify.ok) {
      const error = await verify.json()
      toast.error(error.error)
      setLoading(false)
    }
    else {
      const res = await signIn("credentials", {
        redirect: false,
        otp: formData.get("otp"),
        upi: formData.get("upi")
      })
    
      if (res!.ok) {
        toast.success("Authenticated")
        await navigate("/prelim")
      } else {
        toast.error("Something went wrong")
        setLoading(false)
      }
    }
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
        <h1 className="text-3xl">Welcome!</h1>
        <div className="flex flex-col gap-5">
          <p>This study is part of a research project to understand people&apos;s behavior when faced with uncertainty. Your participation in this research study is voluntary. You may choose not to participate. If you decide to participate, you may withdraw at any time.</p>

          <p>The tasks that you will need to perform will be explained through instructions at the beginning of the study. After you perform these tasks, you will be asked to solve some additional problems. Your participation should not require more than 25 to 30 minutes. Should you take more than an hour to complete the study, you will be automatically logged out and will not be able to continue or restart it. If you will not be able to spend an uninterrupted 30 minutes, please abandon the study by closing this window.</p>

          <p><span className="font-bold">Note</span>: Please make sure that your internet connection remains stable and uninterrupted for the next 30 minutes. Any disruptions will result in you being automatically logged out, rendering you unable to complete the study.</p>

          <p>For your participation in this study, you will receive a fixed fee of INR 100 on completion. You can earn an additional INR 750 through the experimental tasks, the specifics of which will be explained in the instructions to follow. All payments will be made electronically within the next few days. To process payments, we need your UPI ID.</p>

          <p className="underline text-center">CONSENT</p>

          <p className="italic">I am at least 18 years of age. I understand that all the data collected from my responses will only be used for research. My identity will be kept anonymous. My UPI ID or any identifying information will not be linked to my responses in the tasks.</p>

          <p>By entering your UPI ID and clicking on submit, you consent to the above.</p>
        </div>
        <form onSubmit={authorize} className="flex flex-col gap-10 items-center">
          <div className="flex flex-col gap-2">
            <input type="text" name="otp" placeholder="One time password" className="text-black p-2 bg-gray-200 rounded-md w-80" required></input>
            <input type="text" name="upi" placeholder="UPI ID" className="text-black p-2 bg-gray-200 rounded-md w-80" required></input>
          </div>
          <button type="submit" disabled={loading}>
            <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
          </button>
        </form>
      </main>
    </>
  );
}