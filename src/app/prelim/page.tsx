"use client";
import Image from "next/image";

import { signOut, useSession } from "next-auth/react"
import navigate from "../_actions/navigate";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Scroll from "../_components/scroll";

export default function Prelim() {

    const {data: session} = useSession()
    const [position, setPosition] = useState(0)

    const [loading, setLoading] = useState(false)

    const proceed = async (id: string) => {
        setLoading(true)
        if (position == 0) {
            const response = await fetch("/api/response", {
                method: "POST", 
                body: JSON.stringify({
                    id: id
                })
            })
            if (response.ok) {
                setPosition(1)
            } else {
                toast.error("Something went wrong")
            }
            setLoading(false)
        }
        else await navigate("/preplay")
    }

    return (
        <>
            <Scroll />
            {position === 0 && (
                <>
                    <Toaster position="top-right" />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Experiment Instructions</h1>
                        <div className="flex flex-col gap-5 items-center">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet libero viverra, euismod erat eget, fermentum turpis. Nam egestas risus eros, in convallis mi sodales eget. Maecenas consectetur nisl dui, quis vestibulum erat laoreet eu. Integer vel nulla non diam sodales efficitur. Phasellus sit amet elementum felis. Aenean risus nulla, commodo non urna nec, commodo elementum risus. Vestibulum pellentesque semper mauris, vitae hendrerit enim hendrerit ac. Maecenas mattis mi eget efficitur maximus. Donec ullamcorper sodales nisi ut luctus.</p>
    
                            <p>Cras at condimentum mauris. Sed at egestas mi. In sit amet nibh tempor, efficitur magna eu, finibus quam. Nunc dapibus vulputate mauris a porta. Sed id quam dapibus, aliquet est sit amet, ullamcorper justo. Nulla pellentesque aliquam est. Aenean pharetra, magna euismod placerat aliquet, purus diam aliquam lectus, sed facilisis elit felis eget tortor.</p>
    
                            <Image 
                                src="/vercel.svg"
                                alt="Vercel logo"
                                className=""
                                width={150}
                                height={24}
                            />
    
                            <p>Nulla non ex non sapien ultricies bibendum. Fusce non ipsum condimentum, posuere tellus a, blandit ante. Ut ut aliquam risus. Aenean porta metus eu elit tristique, non bibendum nulla sagittis. Proin vel sem at ante efficitur condimentum. Proin vestibulum sollicitudin tortor, a accumsan eros bibendum quis. Praesent mattis magna vitae rhoncus scelerisque. In hac habitasse platea dictumst.</p>
                        </div>
                        <button onClick={() => proceed(session!.user.id)} disabled={loading}>
                            <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Loading..." : "Understood"}</div>
                        </button>
                        <button onClick={() => signOut()}>sign out</button>
                    </main>
                </>
            )}
            {position === 1 && (
                <>
                <Scroll />
                <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                    <h1 className="text-3xl">Payment protocols</h1>
                    <div className="flex flex-col gap-5 items-center">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sit amet libero viverra, euismod erat eget, fermentum turpis. Nam egestas risus eros, in convallis mi sodales eget. Maecenas consectetur nisl dui, quis vestibulum erat laoreet eu. Integer vel nulla non diam sodales efficitur. Phasellus sit amet elementum felis. Aenean risus nulla, commodo non urna nec, commodo elementum risus. Vestibulum pellentesque semper mauris, vitae hendrerit enim hendrerit ac. Maecenas mattis mi eget efficitur maximus. Donec ullamcorper sodales nisi ut luctus.</p>
        
                        <p>Cras at condimentum mauris. Sed at egestas mi. In sit amet nibh tempor, efficitur magna eu, finibus quam. Nunc dapibus vulputate mauris a porta. Sed id quam dapibus, aliquet est sit amet, ullamcorper justo. Nulla pellentesque aliquam est. Aenean pharetra, magna euismod placerat aliquet, purus diam aliquam lectus, sed facilisis elit felis eget tortor.</p>
        
                        <Image 
                            src="/vercel.svg"
                            alt="Vercel logo"
                            className=""
                            width={150}
                            height={24}
                        />
        
                        <p>Nulla non ex non sapien ultricies bibendum. Fusce non ipsum condimentum, posuere tellus a, blandit ante. Ut ut aliquam risus. Aenean porta metus eu elit tristique, non bibendum nulla sagittis. Proin vel sem at ante efficitur condimentum. Proin vestibulum sollicitudin tortor, a accumsan eros bibendum quis. Praesent mattis magna vitae rhoncus scelerisque. In hac habitasse platea dictumst.</p>
                    </div>
                    <button onClick={() => proceed(session!.user.id)} disabled={loading}>
                        <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Loading..." : "Understood"}</div>
                    </button>
                </main>
                </>
            )}
            
        </>
    )
}