"use client"

import { useSession } from "next-auth/react"
import { submit_iq } from "../_actions/submit"
import Scroll from "../_components/scroll"
import { FormEvent, useEffect, useRef, useState } from "react"

import Image from "next/image"

const TOTAL_QUESTIONS = 4

export default function IQ() {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const [index, setIndex] = useState(1)
    const [values, setValues] = useState<{ [key: string]: string | number | undefined }>({})

    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(false)

    const start_time = useRef<string>("")
    
    useEffect(() => {
        start_time.current = new Date().toString()
    }, [start])

    const Input = ({placeholder, name, type}: {placeholder: string, name: string, type: string}) => {
        return <input type={type} placeholder={placeholder} name={name} className="text-black p-2 bg-gray-200 rounded-md w-80" required  value={values[name]} autoFocus onChange={(e) => setValues({...values, [name]: e.target.value})}></input>
    }

    const Radio = ({value, label, name}: {value: number, label: string, name: string}) => {
        return (
            <div className="flex flex-row border border-black rounded-md py-2 px-4">
                <label className="">
                    <input type="radio" name={name} value={value} className="mr-4" required onChange={(e) => setValues({...values, [name]: e.target.value})} checked={values[name] == value}></input>{label}
                </label>
            </div>
        )
    }

    const IQ_0 = () => {
        return (
            <div className="flex flex-col gap-10 items-center">
                <p className="text-left w-full">You will now be asked to answer eight further questions, for a potential additional reward of INR 150.</p>
                <p className="text-left w-full">The payment protocol for these questions is as follows. Of the eight questions provided, three will be randomly chosen for payment. You will be paid INR 50 for each of these three questions that you answer correctly.</p>
                <button type="button" onClick={() => {
                    setStart(true)
                }} className="border border-black rounded-md py-2 px-5">Next</button>
            </div>
        )
    }

    const IQ_1 = () => {
        return (
            <>
            <Scroll />
                <div className="flex flex-col gap-5 items-center">
                    <p className="text-left w-full">In a lake, there is a patch of lily pads. Every day, the patch doubles in size. If it takes 48 days for the patch to cover the entire lake, how long would it take for the patch to cover half of the lake?</p>
                    <Input type="number" placeholder="Number of days" name="q1" />
                </div>
            </>
        )
    }
    
    const IQ_2 = () => {
        return (
            <>
            <Scroll />
                <div className="flex flex-col gap-5 items-center">
                    <p className="text-left w-full">A man buys a pig for $60, sells it for $70, buys it back for $80, and sells it finally for $90. How much has he made?</p>
                    <Input type="number" placeholder="Number of dollars" name="q2" />
                </div>
            </>
        )
    }
    
    const IQ_3 = () => {
        return (
            <>
            <Scroll />
                <div className="flex flex-col gap-5 items-center">
                    <p className="text-left w-full">Simon decided to invest $8,000 in the stock market one day early in 2008. Six months after he invested, on July 17, the stocks he had purchased were down 50%. Fortunately for Simon, from July 17 to October 17, the stocks he had purchased went up 75%. At this point, Simon has:</p>
                    <div className="flex flex-col gap-3">
                        <Radio value={0} name="q3" label="broken even in the stock market" />
                        <Radio value={1} name="q3" label="is ahead of where he began" />
                        <Radio value={2} name="q3" label="has lost money" />
                    </div>
                </div>
            </>
        )
    }

    const Question_Image = ({url}: {url: string}) => {
        return (
            <Image 
                src={url}
                alt="Image"
                className=""
                width={0}
                height={0}
                sizes="100vw"
                style={{height: "35vh", width: "auto"}}
            />
        )
    }

    const Option_Image = ({url, name, value}: {url: string, name: string, value: number}) => {
        return (
            <div className="flex flex-row border border-black rounded-md py-2 px-4">
                <label className="">
                    <input type="radio" name={name} value={value} className="mr-4" required onChange={(e) => setValues({...values, [name]: e.target.value})} checked={values[name] == value}></input>
                    <Image 
                        src={url}
                        alt="Image"
                        className=""
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{height: "15vh", width: "auto"}}
                    />
                </label>
            </div>
        )
    }

    const IQ_4 = () => {
        return (
            <>
            <Scroll />
                <div className="flex flex-col gap-20 items-center">
                    <Question_Image url="/assets/urns/CP1_Urn.png" />
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-row gap-5">
                            <Option_Image url="/assets/urns/CP1_Urn.png" value={0} name="q4" />
                            <Option_Image url="/assets/urns/CP1_Urn.png" value={1} name="q4" />
                            <Option_Image url="/assets/urns/CP1_Urn.png" value={2} name="q4" />
                        </div>
                        <div className="flex flex-row gap-5">
                            <Option_Image url="/assets/urns/CP1_Urn.png" value={3} name="q4" />
                            <Option_Image url="/assets/urns/CP1_Urn.png" value={4} name="q4" />
                            <Option_Image url="/assets/urns/CP1_Urn.png" value={5} name="q4" />
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
    
        const formData = new FormData(event.currentTarget);
        console.log(formData)

        const dict = {
            "start_time": formData.get("start_time"),
            "id": formData.get("id"),
            ...values
        }

        await submit_iq(dict)
        setLoading(false)
    }
    
    return (
        <>
            <Scroll />
            <main className="flex min-h-screen flex-col gap-20 p-48 pt-16 items-center">
                <h1 className="text-3xl">Additional Questions</h1>
                {start === false ? (<IQ_0 />) : (
                    <form className="flex flex-col gap-20 items-center" onSubmit={submit}>
                        <input type="hidden" name="start_time" value={start_time.current} />
                        <input type="hidden" name="id" value={session_id} />
                        {index === 1 && <IQ_1 />}
                        {index === 2 && <IQ_2 />}
                        {index === 3 && <IQ_3 />}
                        {index === 4 && <IQ_4 />}
                        <div className="flex flex-row gap-2">
                            <button type="button" onClick={() => {
                                if (index > 1) setIndex(index - 1)
                            }} className="border border-black rounded-md py-2 px-5">Previous</button>
                            <button type="button" onClick={() => {
                                if (index < TOTAL_QUESTIONS) setIndex(index + 1)
                            }} className="border border-black rounded-md py-2 px-5">Next</button>
                        </div>
                        {index === TOTAL_QUESTIONS && (
                            <button type="submit" disabled={loading}>
                                <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
                        </button>
                        )}
                    </form>
                )}
            </main>
        </>
    )
}