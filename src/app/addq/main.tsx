"use client"

import { useSession } from "next-auth/react"
import { submit_iq } from "../_actions/submit"
import Scroll from "../_components/scroll"
import { FormEvent, useEffect, useRef, useState } from "react"

import Image from "next/image"
import Timer from "../_components/timer"

const TOTAL_QUESTIONS = 8

export default function IQ() {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const [index, setIndex] = useState(1)
    const [values, setValues] = useState<{ [key: string]: string | number | undefined }>({})

    const [loading, setLoading] = useState(false)
    const [start, setStart] = useState(false)

    let timeStamp = new Date()
    if (start === true) {
        const seconds = 600
        timeStamp = new Date(Date.now() + seconds * 1000)

        // setTimeout(async () => {
        //     console.log("why is this called rn")
        //     await forceSubmit()
        // }, (seconds * 1000))

        // const delay = (ms: number) => {
        //     return new Promise(resolve => setTimeout(resolve, ms))
        // }

        // delay(10000).then(async () => {
        //     console.log("why is this called rn")
        //     await forceSubmit()
        // });
    }

    const start_time = useRef<string>("")
    
    useEffect(() => {
        start_time.current = new Date().toString()
    }, [start])

    const Input = ({placeholder, name, type}: {placeholder: string, name: string, type: string}) => {
        return <input type={type} placeholder={placeholder} name={name} className="text-black p-2 bg-gray-200 rounded-md w-80" value={values[name]} autoFocus onChange={(e) => setValues({...values, [name]: e.target.value})}></input>
    }

    const Radio = ({value, label, name}: {value: number, label: string, name: string}) => {
        return (
            <div className="flex flex-row border border-black rounded-md py-2 px-4">
                <label className="">
                    <input type="radio" name={name} value={value} className="mr-4" onChange={(e) => setValues({...values, [name]: e.target.value})} checked={values[name] == value}></input>{label}
                </label>
            </div>
        )
    }

    const IQ_0 = () => {
        return (
            <div className="flex flex-col gap-10 items-center">
                <p className="text-left w-full">You will now be asked to answer eight further questions, for a potential additional reward of INR 150.</p>
                <p className="text-left w-full">The payment protocol for these questions is as follows. Of the eight questions you are asked, three will be randomly chosen for payment. You will be paid INR 50 for each of these three questions that you answer correctly.</p>
                <p className="text-left w-full">You will have 10 minutes to answer these questions. <span className="font-bold">Make sure to submit your responses on the final screen before time runs out. Otherwise, your answers will be discarded.</span></p>
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
                    <p className="text-left w-full">In a pond, there is a patch of algae. Every day, the patch doubles in size. If it takes 38 days for the patch to cover the entire pond, how long would it take for the patch to cover half of the pond?</p>
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
                    <p className="text-left w-full">A man buys a long lost piece of art for INR 150000, sells it for INR 160000, buys it back for INR 170000, and sells it finally for INR 180000. How much has he made?</p>
                    <Input type="number" placeholder="Number of rupees" name="q2" />
                </div>
            </>
        )
    }
    
    const IQ_3 = () => {
        return (
            <>
            <Scroll />
                <div className="flex flex-col gap-5 items-center">
                    <p className="text-left w-full">Mihir decided to invest INR 10,000 in the stock market late in 2021. Six months after he invested, on May 23, the stocks he had purchased were down 50%. Fortunately for Mihir, from May 23 to August 23, the stocks he had purchased went up 75%. At this point, Mihir has:</p>
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
                style={{height: "45vh", width: "auto"}}
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

    const IQ_Matrix = ({num}: {num: number}) => {
        return (
            <>
            {/* <Scroll /> */}
                <div className="flex flex-col gap-20 items-center">
                    <div className="flex flex-col gap-5 items-center">
                        <p><b>Complete the following image</b>:</p>
                        <Question_Image url={`/assets/matrices/Q${num-3}.png`} />
                    </div>
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-row gap-5">
                            <Option_Image url={`/assets/matrices/Q${num-3}_a.png`} value={0} name={`q${num}`} />
                            <Option_Image url={`/assets/matrices/Q${num-3}_b.png`} value={1} name={`q${num}`} />
                            <Option_Image url={`/assets/matrices/Q${num-3}_c.png`} value={2} name={`q${num}`} />
                            <Option_Image url={`/assets/matrices/Q${num-3}_d.png`} value={3} name={`q${num}`} />
                        </div>
                        <div className="flex flex-row gap-5">
                            <Option_Image url={`/assets/matrices/Q${num-3}_e.png`} value={4} name={`q${num}`} />
                            <Option_Image url={`/assets/matrices/Q${num-3}_f.png`} value={5} name={`q${num}`} />
                            <Option_Image url={`/assets/matrices/Q${num-3}_g.png`} value={6} name={`q${num}`} />
                            <Option_Image url={`/assets/matrices/Q${num-3}_h.png`} value={7} name={`q${num}`} />
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

    const forceSubmit = async () => {
        // setLoading(true)
    
        const dict = {
            "start_time": start_time.current,
            "id": session_id,
            ...values
        }

        await submit_iq(dict)
        // setLoading(false)
    }

    return (
        <>
            <Scroll />
            <main className="flex min-h-screen flex-col gap-20 p-48 pt-16 items-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl">Additional Questions</h1>
                    {start === true && <Timer expiryTimestamp={timeStamp} />}
                </div>
                {start === false ? (<IQ_0 />) : (
                    <form className="flex flex-col gap-20 items-center" onSubmit={submit} id="form">
                        <input type="hidden" name="start_time" value={start_time.current} />
                        <input type="hidden" name="id" value={session_id} />
                        {index === 1 && <IQ_1 />}
                        {index === 2 && <IQ_2 />}
                        {index === 3 && <IQ_3 />}
                        <div className="flex flex-row justify-between w-full">
                            <button type="button" disabled={index==1} onClick={() => {
                                if (index > 1) setIndex(index - 1)
                            }} className={`border border-black rounded-md py-2 px-5 ${index == 1 ? "bg-gray-200" : "bg-white"}`}>Previous</button>
                            <button type="button" disabled={index==TOTAL_QUESTIONS} onClick={() => {
                                if (index < TOTAL_QUESTIONS) setIndex(index + 1)
                            }} className={`border border-black rounded-md py-2 px-5 ${index == TOTAL_QUESTIONS ? "bg-gray-200" : "bg-white"}`}>Next</button>
                        </div>
                        {index === 4 && <IQ_Matrix num={4} />}
                        {index === 5 && <IQ_Matrix num={5} />}
                        {index === 6 && <IQ_Matrix num={6} />}
                        {index === 7 && <IQ_Matrix num={7} />}
                        {index === 8 && <IQ_Matrix num={8} />}
                        {index === TOTAL_QUESTIONS && (
                            <button type="submit" disabled={loading}>
                                <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-200" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
                        </button>
                        )}
                    </form>
                )}
            </main>
        </>
    )
}