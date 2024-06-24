"use client";
import Image from "next/image";

import { signOut, useSession } from "next-auth/react"
import navigate from "../_actions/navigate";
import { FormEvent, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Scroll from "../_components/scroll";
import Img from "../_components/img";
import Radio from "../_components/radio";
import Checkbox from "../_components/checkbox";
import { submit_training_1 } from "../_actions/submit";

export default function Prelim() {

    const {data: session} = useSession()
    const [position, setPosition] = useState(0)

    const [loading, setLoading] = useState(false)

    const proceed = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)

        if (position == 0) {
            setPosition(1)
            setLoading(false)
        }
        else if (position == 1) {

            const verified = await submit_training_1(formData)
            if (verified) {
                setPosition(2)
            }
            else {
                toast.error("Wrong answers")
            }
            setLoading(false)

        }
        else if (position == 2) {
            const response = await fetch("/api/response", {
                method: "POST", 
                body: JSON.stringify({
                    id: formData.get("id")
                })
            })
            if (response.ok) {
                await navigate("/preplay")
            } else {
                toast.error("Something went wrong")
            }

        }
    }

    return (
        <>
            <Scroll />
            {position === 0 && (
                <>
                    <Toaster position="top-right" />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Introduction</h1>
                        <div className="flex flex-col gap-5">
                            <ul className="list-disc list-inside">
                                <li>In this experiment, you will encounter a series of decision problems that feature uncertainty.</li>
                                <li>There are no right or wrong answers to how you assess these problems. Please make these assessments in the way that you think gives you the best chance of maximizing your monetary rewards from the experiment.</li>
                                <li>You will receive a participation fee of INR 100. Additionally, you may earn up to INR 750 depending on the outcomes of your assessments.</li>
                            </ul>
    
                            <p>During the experiment, you will see urns containing coloured balls. Associated with each urn, there will be monetary bets that pay specific monetary amounts based on the colour of the ball that is randomly drawn from the urn by our algorithm. You will be asked to evaluate these bets by stating the minimum amount of money at which you are willing to sell any such bet. Once you have assessed these bets, and made all your decisions, your final payment in the experiment will be determined based on your decisions and the working of chance.</p>
    
                            {/* <Image 
                                src="/vercel.svg"
                                alt="Vercel logo"
                                className=""
                                width={150}
                                height={24}
                            /> */}
    
                            <p>We will now give more details about the structure of the decisions you will encounter so that you can make the best decisions possible based on your subjective assessments.</p>
                        </div>
                        <form onSubmit={proceed}>
                            {/* <input type="hidden" name="id" value={session!.user.id} /> */}
                            <button type="submit" disabled={loading}>
                                <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Loading..." : "Understood"}</div>
                            </button>
                        </form>
                        {/* <button onClick={() => signOut()}>sign out</button> */}
                    </main>
                </>
            )}

            {position === 1 && (
                <>
                    <Scroll />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Types of Urns</h1>
                        <div className="flex flex-col gap-10">
                            <p>You may encounter 3 broad types of urns. We illustrate these with examples.</p>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-2xl">Type 1</h2>
                
                                <p>Shown below is the image of an urn. The urn contains a total of eight balls, with exactly 1 pink, 1 orange, 1 purple, 1 green, 1 red, 1 yellow, and 1 blue ball.</p>
                
                                <div className="flex flex-col gap-5 md:flex-row">
                                    <Img url="/assets/urns/CP3_Urn1.png" /> 
                                </div>
                
                                <p>In this urn, there are 8 balls, one each of the specified colours. You therefore have complete knowledge about the composition of such an urn.</p>
                            </div>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-2xl">Type 2</h2>
                
                                <p>Shown below is the image of an urn. The urn contains exactly 1 purple ball, 1 white ball, and 4 other balls, each of which may be red, yellow, blue, or green. You do not know the exact number of balls that are red, yellow, blue, or green.</p>

                                <div className="flex flex-col gap-5 md:flex-row">
                                    <Img url="/assets/urns/CP1_Urn.png" />
                                </div>
                
                                <p>In this urn, you know the colour of some of the balls for sure, specifically that the urn contains 1 purple ball, and 1 white ball. However, you don’t know the exact colour of the other four balls.   You know that they could be either red, blue, yellow, or green, but you don’t know exactly which.  Therefore, you only have partial knowledge about the composition of this urn as the exact number of red, blue, yellow, and green balls in it is not known to you. Given this information, here are some possibilities for this urn:
                                </p>

                                <div className="flex flex-col gap-5 md:flex-row">
                                    <Img url="/assets/urns/Misc1.png" />
                                </div>

                                <p>As you should be able to verify, these are only some possibilities. Many other colour combinations are possible as well.</p>
                            </div>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-2xl">Type 3</h2>
                
                                <p>Shown below is the image of an urn. The urn contains a total of eight balls, with each ball colored one of pink, orange, purple, green, red, black, yellow, and blue. However, the exact number of balls of each colour is not known.</p>

                                <div className="flex flex-col gap-5 md:flex-row">
                                    <Img url="/assets/urns/CP3_Urn2.png" />
                                </div>
                
                                <p>You have no knowledge about the composition of this urn as you do not know the exact colour of any of the eight balls contained in it.  All you know is that each of the balls could be of any of the eight colours.  Given this information, here are some of the possibilities for this urn:</p>

                                <div className="flex flex-col gap-5 md:flex-row">
                                    <Img url="/assets/urns/Misc2.png" />
                                </div>

                                <p>As you should be able to verify, these are only some possibilities. Many other colour combinations are possible as well.</p>
                            </div>

                            <form onSubmit={proceed} className="flex flex-col gap-10 items-center">

                                <h2 className="text-2xl w-full text-left">Training</h2>

                                <div className="flex flex-col gap-5 items-start">
                                    <p>Q1:</p>
                                    <p>Shown below is the image of an urn. The urn contains exactly 1 purple ball, 1 white ball, and 4 other balls, each of which may be red, yellow, blue, or green. You do not know the exact number of balls that are red, yellow, blue, or green.</p>
                                    <div className="flex flex-col gap-5 md:flex-row">
                                        <Img url="/assets/urns/CP1_Urn.png" />
                                    </div>
                                    <p>In the given urn, which among the following is a possible value for the number of blue balls? Select all that apply:</p>

                                    <Checkbox value={1} label="3" name="q1_1" />
                                    <Checkbox value={1} label="4" name="q1_2" />
                                    <Checkbox value={1} label="5" name="q1_3" />
                                    <Checkbox value={1} label="0" name="q1_4" />
                                </div>
                                
                                <div className="flex flex-col gap-5 items-start">
                                    <p>Q2:</p>
                                    <p>Shown below is the image of an urn. The urn contains exactly 1 blue ball, 1 yellow ball, and 2 other balls, each of which may be either pink or orange. You do not know the exact number of balls that are pink or orange.</p>
                                    <div className="flex flex-col gap-5 md:flex-row">
                                        <Img url="/assets/urns/CP2_Urn.png" />
                                    </div>
                                    <p>In the given urn, which among the following is a possible value for the number of blue balls? Select all that apply:</p>

                                    <Checkbox value={1} label="2" name="q2_1" />
                                    <Checkbox value={1} label="1" name="q2_2" />
                                    <Checkbox value={1} label="3" name="q2_3" />
                                    <Checkbox value={1} label="4" name="q2_4" />
                                </div>
                                
                                <div className="flex flex-col gap-5 items-start">
                                    <p>Q3:</p>
                                    <p>Shown below is the image of an urn. The urn contains a total of eight balls, with each ball colored one of pink, orange, purple, green, red, black, yellow, and blue. However, the exact number of balls of each colour is not known.</p>
                                    <div className="flex flex-col gap-5 md:flex-row">
                                        <Img url="/assets/urns/CP3_Urn2.png" />
                                    </div>
                                    <p>In the given urn, which among the following is a possible value for the number of red balls? Select all that apply:</p>

                                    <Checkbox value={1} label="2" name="q3_1" />
                                    <Checkbox value={1} label="3" name="q3_2" />
                                    <Checkbox value={1} label="8" name="q3_3" />
                                    <Checkbox value={1} label="0" name="q3_4" />
                                </div>

                                <button disabled={loading} className="text-center">
                                    <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
                                </button>
                            </form>

                        </div>
                    </main>
                </>
            )}

            {position === 2 && (
                <form onSubmit={proceed}>
                    <input type="hidden" name="id" value={session!.user.id} />
                    <button type="submit" disabled={loading}>
                        <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Loading..." : "Understood"}</div>
                    </button>
                </form>
            )}
            
        </>
    )
}