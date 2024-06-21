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
      <Toaster position="top-right" />
      <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
        <h1 className="text-3xl">Consent Form</h1>
        <div className="flex flex-col gap-5">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet libero viverra, euismod erat eget, fermentum turpis. Nam egestas risus eros, in convallis mi sodales eget. Maecenas consectetur nisl dui, quis vestibulum erat laoreet eu. Integer vel nulla non diam sodales efficitur. Phasellus sit amet elementum felis. Aenean risus nulla, commodo non urna nec, commodo elementum risus. Vestibulum pellentesque semper mauris, vitae hendrerit enim hendrerit ac. Maecenas mattis mi eget efficitur maximus. Donec ullamcorper sodales nisi ut luctus.</p>

          <p>Cras at condimentum mauris. Sed at egestas mi. In sit amet nibh tempor, efficitur magna eu, finibus quam. Nunc dapibus vulputate mauris a porta. Sed id quam dapibus, aliquet est sit amet, ullamcorper justo. Nulla pellentesque aliquam est. Aenean pharetra, magna euismod placerat aliquet, purus diam aliquam lectus, sed facilisis elit felis eget tortor.</p>

          <p>Nulla non ex non sapien ultricies bibendum. Fusce non ipsum condimentum, posuere tellus a, blandit ante. Ut ut aliquam risus. Aenean porta metus eu elit tristique, non bibendum nulla sagittis. Proin vel sem at ante efficitur condimentum. Proin vestibulum sollicitudin tortor, a accumsan eros bibendum quis. Praesent mattis magna vitae rhoncus scelerisque. In hac habitasse platea dictumst.</p>

          <p>By entering my UPI ID below and clicking Submit, I consent to lorem ipsum</p>
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