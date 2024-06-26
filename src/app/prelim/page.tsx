"use client";

import { signOut, useSession } from "next-auth/react"
import navigate from "../_actions/navigate";
import { FormEvent, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Scroll from "../_components/scroll";
import Img from "../_components/img";
import Radio from "../_components/radio";
import Checkbox from "../_components/checkbox";
import { submit_training_1, submit_training_2, submit_training_3 } from "../_actions/submit";
import Note from "../_components/note";

export default function Prelim() {

    const {data: session} = useSession()
    const [position, setPosition] = useState(0)

    const [loading, setLoading] = useState(false)

    const [errorq1, setErrorq1] = useState("")
    const [errorq2, setErrorq2] = useState("")
    const [errorq3, setErrorq3] = useState("")

    const randomIndex = useRef<number>(0)

    useEffect(() => {
        randomIndex.current = Math.floor(Math.random() * 3);
    }, [])

    const train_price = [120, 150, 180][randomIndex.current]

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
            if (verified.correct) {
                setPosition(2)
            }
            else {
                setErrorq1(verified.response)
            }
            setLoading(false)
        }

        else if (position == 2) {
            const verified = await submit_training_2(formData)
            if (verified.correct) {
                setPosition(3)
            }
            else {
                setErrorq2(verified.response)
            }
            setLoading(false)
        }

        else if (position == 3) {
            const verified = await submit_training_3(formData)
            if (verified.correct) {
                console.log(formData.get("id"))
                const response = await fetch("/api/response", {
                    method: "POST", 
                    body: JSON.stringify({
                        id: formData.get("id"),
                        train_price: train_price
                    })
                })
                if (response.ok) {
                    await navigate("/preplay")
                } else {
                    toast.error("Something went wrong")
                }
            }
            else {
                setErrorq3(verified.response)
            }
        }
        setLoading(false)
    }

    return (
        <>
            <Scroll />
            {position === 0 && (
                <>
                    <Toaster position="bottom-center" />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Introduction</h1>
                        <div className="flex flex-col gap-5">
                            <ul className="list-disc list-inside px-8">
                                <li>In this experiment, you will encounter a series of decision problems that feature uncertainty.</li>
                                <li>There are no right or wrong answers to how you assess these problems. Please make these assessments the way you think will give you the best chance of maximizing your monetary rewards from the experiment.</li>
                                <li>You will receive a guaranteed participation fee of INR 100. Additionally, you may earn up to INR 600 depending on the decisions you encounter, your assessments in them, and how uncertainty resolves.</li>
                                <li>You can earn a further INR 150 from solving a few fun problems.</li>
                            </ul>
    
                            <p>During the experiment, you will see urns containing colored balls. Associated with each urn, there will be monetary bets that pay specific amounts based on the color of the ball that will be <span className="italic">randomly</span> drawn from the urn by our algorithm. You will be asked to evaluate these bets by stating the minimum price at which you would be willing to sell any such bet. Once you have assessed these bets, and made all your decisions, your final payment in the experiment will be determined based on these decisions and the working of chance.</p>
    
                            <p>We will now give more details about the structure of the decisions you will encounter so that you can make the best possible decisions according to your <span className="italic">subjective</span> assessment.</p>
                        </div>
                        <form onSubmit={proceed}>
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
                    <Toaster position="bottom-center" />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Types of Urns</h1>
                        <div className="flex flex-col gap-10">
                            <p>You may encounter 3 broad types of urns on which bets are placed. We illustrate these with examples.</p>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-2xl">Type 1</h2>
                
                                <p>Shown below is the image of an urn. The urn contains a total of 8 balls, with exactly 1 pink, 1 orange, 1 purple, 1 green, 1 red, 1 black, 1 yellow, and 1 blue ball.</p>
                
                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/CP3_Urn1.png" /> 
                                </div>
                
                                <p>In this urn, there are 8 balls, one each of the specified colors. You therefore have completed knowledge about the composition of such an urn.</p>
                            </div>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-2xl">Type 2</h2>
                
                                <p>Shown below is the image of an urn. The urn contains a total of 6 balls. There is 1 purple ball and 1 white ball. Each of the other 4 balls could be red, yellow, blue, or green. However, the exact number of balls of these four colors is <span className="font-bold">not known</span>.</p>

                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/CP1_Urn.png" />
                                </div>
                
                                <p>In this urn, you know the exact number of balls of some colors, specifically that the urn contains 1 purple and 1 white ball. However, you don&apos;t know the color composition of the remaining four balls. You know that each of those balls could be red, yellow, blue, or green, but have no further information. Thus, the exact number of balls of these four colors is not known to you. Given this information, here are some possibilities for this urn&apos;s composition:</p>

                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/mixed_urn1.png" />
                                    <Img url="/assets/urns/mixed_urn2.png" />
                                    <Img url="/assets/urns/mixed_urn3.png" />
                                    <Img url="/assets/urns/mixed_urn4.png" />
                                </div>

                                <p>Of course, this list is not exhaustive. There are many other color compositions that fit this description.</p>
                            </div>

                            <div className="flex flex-col gap-5">
                                <h2 className="text-2xl">Type 3</h2>
                
                                <p>Shown below is the image of an urn. The urn contains a total of 8 balls. Each of these balls is either pink, orange, purple, green, red, black, yellow, or blue. However, the exact number of balls of these eight colors is <span className="font-bold">not known</span>.</p>

                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/CP3_Urn2.png" />
                                </div>
                
                                <p>You have almost no knowledge about the composition of this urn. All you know is that each of the balls could be of any of the eight colors listed. Given this information, here are some possibilities for this urn&apos;s composition:</p>

                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/amb_urn1.png" />
                                    <Img url="/assets/urns/amb_urn2.png" />
                                    <Img url="/assets/urns/amb_urn3.png" />
                                    <Img url="/assets/urns/amb_urn4.png" />
                                </div>

                                <p>Again, this list is not exhaustive. There are many other color compositions that fit this description.</p>
                            </div>

                            <form onSubmit={proceed} className="flex flex-col gap-10 items-center">

                                <h2 className="text-2xl w-full text-left">Practice Questions</h2>

                                <p className="w-full text-left">We now present a few questions that should help you verify whether you are clear on the composition of urns you may encounter</p>

                                <div className="flex flex-col gap-5 items-start">
                                    <p>Q1. Shown below is the image of an urn. The urn contains a total of 6 balls. There is 1 purple ball and 1 white ball. Each of the other 4 balls could be red, yellow, blue, or green. However, the exact number of balls of these four colors is <span className="font-bold">not known</span>.</p>
                                    <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                        <Img url="/assets/urns/CP1_Urn.png" />
                                    </div>
                                    <p>In the given urn, which among the following is a possible value for the number of blue balls? <span className="font-bold">Select all that apply</span>:</p>

                                    <Checkbox value={1} label="3" name="q1_1" />
                                    <Checkbox value={1} label="4" name="q1_2" />
                                    <Checkbox value={1} label="5" name="q1_3" />
                                    <Checkbox value={1} label="0" name="q1_4" />
                                </div>
                                
                                <div className="flex flex-col gap-5 items-start">
                                    <p>Q2. Shown below is the image of an urn. The urn contains a total of 4 balls. There is 1 blue ball and 1 yellow ball. Each of the other 2 balls could be pink or orange. However, the exact number of balls of these two colors is <span className="font-bold">not known</span>.</p>
                                    <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                        <Img url="/assets/urns/CP2_Urn.png" />
                                    </div>
                                    <p>In the given urn, which among the following is a possible value for the number of blue balls? <span className="font-bold">Select all that apply</span></p>

                                    <Checkbox value={1} label="2" name="q2_1" />
                                    <Checkbox value={1} label="1" name="q2_2" />
                                    <Checkbox value={1} label="3" name="q2_3" />
                                    <Checkbox value={1} label="4" name="q2_4" />
                                </div>
                                
                                <div className="flex flex-col gap-5 items-start">
                                    <p>Q3. Shown below is the image of an urn. The urn contains a total of 8 balls. Each of these balls is either pink, orange, purple, green, red, black, yellow, or blue. However, the exact number of balls of these eight colors is <span className="font-bold">not known</span>.</p>
                                    <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                        <Img url="/assets/urns/CP3_Urn2.png" />
                                    </div>
                                    <p>In the given urn, which among the following is a possible value for the number of red balls? <span className="font-bold">Select all that apply</span>:</p>

                                    <Checkbox value={1} label="2" name="q3_1" />
                                    <Checkbox value={1} label="3" name="q3_2" />
                                    <Checkbox value={1} label="8" name="q3_3" />
                                    <Checkbox value={1} label="0" name="q3_4" />
                                </div>

                                {errorq1 != "" && <p className="text-red-500">{errorq1}</p>}

                                <button disabled={loading} className="text-center">
                                    <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
                                </button>
                            </form>

                        </div>
                    </main>
                </>
            )}

            {position === 2 && (
                <>
                    <Scroll />
                    <Toaster position="bottom-center" />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Bets and Evaluations</h1>
                        <div className="flex flex-col gap-10">
                            <p>During the experiment, you will encounter bets that pay stated monetary amounts based on the color of a ball that is <span className="underline">randomly</span> drawn by our algorithm from the urn on which this bet is placed. By <span className="underline">randomly</span> drawn what is meant is that each ball in the urn has an equal chance of being picked. It is like when you roll a fair die. Each side of the die has an equal chance of coming up. Our algorithm is coded to do exactly that when randomly drawing a ball from an urn.</p>

                            <p>We now show you an example of such a bet to familiarize you with them:</p>

                            <div className="flex flex-col gap-5 items-center">
                
                                <p>Shown below is the image of an urn. The urn contains a total of 5 balls. There is 1 black ball and 1 red ball. Each of the other 3 balls could be yellow, blue or green. However, the exact number of balls of these three colors is <span className="font-bold">not known</span>.</p>
                
                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/training.png" /> 
                                </div>
                
                                <p className="w-full text-left">The following two bets are placed on the urn.</p>

                                <table>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <th>1 ball</th>
                                            <th>1 ball</th>
                                            <th colSpan={3}>3 balls</th>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <th>Black</th>
                                            <th>Red</th>
                                            <th>Yellow</th>
                                            <th>Blue</th>
                                            <th>Green</th>
                                        </tr>
                                        <tr>
                                            <th>Bet A</th>
                                            <td>300</td>
                                            <td>300</td>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>0</td>
                                        </tr>
                                        <tr>
                                            <th>Bet B</th>
                                            <td>0</td>
                                            <td>0</td>
                                            <td>300</td>
                                            <td>300</td>
                                            <td>0</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <ul className="list-disc list-inside px-8">
                                    <li><span className="font-bold">Bet A</span> wins you INR 300 if the randomly drawn ball is either Black or Red. However, you earn nothing if it is of any other color (Yellow, Blue, or Green).</li>
                                    <li><span className="font-bold">Bet B</span> wins you INR 300 if the randomly drawn ball is either Yellow or Blue. However, you earn nothing if it is of any other color (Black, Red, or Green).</li>
                                </ul>

                            </div>

                            <form onSubmit={proceed} className="flex flex-col gap-10 items-center">

                                <h2 className="text-2xl w-full text-left">Practice Questions</h2>

                                <p className="w-full text-left">We now present a few questions that should help you verify whether you are clear on the structure of bets.</p>

                                <div className="flex flex-col gap-5 items-start">
                                    <p>Shown below is the image of an urn. The urn contains a total of 5 balls. There is 1 black ball and 1 red ball. Each of the other 3 balls could be yellow, blue or green. However, the exact number of balls of these three colors is <span className="font-bold">not known</span>.</p>
                                    <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                        <Img url="/assets/urns/training.png" />
                                    </div>
                                    <p>The following two bets are placed on this urn:</p>

                                    <div className="flex flex-col w-full items-center">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <th>1 ball</th>
                                                    <th>1 ball</th>
                                                    <th colSpan={3}>3 balls</th>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <th>Black</th>
                                                    <th>Red</th>
                                                    <th>Yellow</th>
                                                    <th>Blue</th>
                                                    <th>Green</th>
                                                </tr>
                                                <tr>
                                                    <th>Bet A</th>
                                                    <td>300</td>
                                                    <td>100</td>
                                                    <td>0</td>
                                                    <td>0</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <th>Bet B</th>
                                                    <td>0</td>
                                                    <td>200</td>
                                                    <td>200</td>
                                                    <td>0</td>
                                                    <td>0</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <p>Q1. If our algorithm were to randomly draw a <span className="font-bold">Black</span> ball from this urn, how much would bet A pay?</p>

                                    <Radio value={0} label="INR 100" name="q1" />
                                    <Radio value={1} label="INR 300" name="q1" />
                                    <Radio value={2} label="INR 200" name="q1" />
                                    <Radio value={3} label="INR 0" name="q1" />

                                    <p>Q2. If our algorithm were to randomly draw a <span className="font-bold">Yellow</span> ball from this urn, how much would bet B pay?</p>

                                    <Radio value={0} label="INR 100" name="q2" />
                                    <Radio value={1} label="INR 300" name="q2" />
                                    <Radio value={2} label="INR 0" name="q2" />
                                    <Radio value={3} label="INR 200" name="q2" />
                                </div>
                                
                                {errorq2 != "" && <p className="text-red-500">{errorq2}</p>}

                                <button disabled={loading} className="text-center">
                                    <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
                                </button>
                            </form>

                        </div>
                    </main>
                </>
            )}

            {position === 3 && (
                <>
                    <Scroll />
                    <Toaster position="bottom-center" />
                    <main className="flex min-h-screen flex-col items-center gap-10 p-24 pt-16">
                        <h1 className="text-3xl">Payment</h1>
                        <div className="flex flex-col gap-10">
                            <p>In each of the decisions you face, you will be offered a bet and asked to assess its value to you. To do so, you will have to state the lowest price at which you are willing to sell that bet. Think of it as that price such that if offered an amount less than this, you would prefer to play the bet instead of selling it. The payment protocol that we have designed, which we describe below, is such that it is in your own interest to truthfully state this lowest selling price in order to maximize your earnings from the experiment. Here is how the payment protocol works for any given bet:</p>

                            <ul className="list-disc list-inside px-8">
                                <li>First, you state the lowest price at which you are willing to sell the bet.</li>
                                <li>Our algorithm randomly generates a buying price between the lowest and highest amount that the bet offers. Random generation guarantees that, with positive probability, the buying price can be any number in this range.</li>
                                <li>If the buying price generated by our algorithm is greater than or equal to the lowest selling price you stated, your bet will be sold at the price generated by the algorithm, and you will earn that amount.</li>
                                <li>If the buying price generated by our algorithm is less than the lowest selling price you stated, your bet will not be sold. If so, you will play the bet and earn the amount that it yields. That is, a ball will be randomly drawn from the associated urn, and you will earn the amount that the bet offers based on its color.</li>
                            </ul>

                            <p>We now explain using an example why stating your lowest selling price truthfully is in your own interest.</p>
                            
                            <h2 className="text-2xl w-full text-left">Example</h2>

                            <div className="flex flex-col gap-5">
                
                                <p>Shown below is the image of an urn. The urn contains a total of 5 balls. There is 1 black ball and 1 red ball. Each of the other 3 balls could be yellow, blue, or green. However, the exact number of balls of these three colors is <span className="font-bold">not known</span>.</p>
                
                                <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                    <Img url="/assets/urns/training.png" /> 
                                </div>
                
                                <p>The following bet is placed on a random draw of a ball from this urn. If the drawn ball is yellow or blue, the bet pays INR 500. If the drawn ball is of any other color, it pays nothing.</p>

                                <div className="flex flex-col w-full items-center">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <th>1 ball</th>
                                                <th>1 ball</th>
                                                <th colSpan={3}>3 balls</th>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <th>Black</th>
                                                <th>Red</th>
                                                <th>Yellow</th>
                                                <th>Blue</th>
                                                <th>Green</th>
                                            </tr>
                                            <tr>
                                                <th>Bet A</th>
                                                <td>0</td>
                                                <td>0</td>
                                                <td>500</td>
                                                <td>500</td>
                                                <td>0</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p>Suppose you could sell this bet instead of playing it out. What is the lowest price at which you would be willing to sell it?</p>

                            </div>

                            <Note />

                            <form onSubmit={proceed} className="flex flex-col gap-10 items-center">

                                <input type="hidden" name="id" value={session!.user.id} />
                                <h2 className="text-2xl w-full text-left">Practice Questions</h2>

                                <p className="w-full text-left">We now present a few questions that should help you verify whether you are clear on this aspect of the payment protocol.</p>

                                <div className="flex flex-col gap-5 items-start">
                                    <p>Consider the following urn and bet</p>
                                    <p>Shown below is the image of an urn. The urn contains a total of 7 balls. There is 1 red, 1 blue, and 1 green ball. Each of the other 4 balls could be yellow, pink, orange, or black. However, the exact number of balls of these four colors is <span className="font-bold">not known</span>.</p>
                                    <div className="flex flex-col gap-5 md:flex-row w-full justify-center">
                                        <Img url="/assets/urns/payment_urn.png" />
                                    </div>
                                    <p>The following bet is placed on this urn:</p>

                                    <div className="flex flex-col w-full items-center">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                    <th>1 ball</th>
                                                    <th>1 ball</th>
                                                    <th>1 ball</th>
                                                    <th colSpan={4}>4 balls</th>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <th>Red</th>
                                                    <th>Blue</th>
                                                    <th>Green</th>
                                                    <th>Yellow</th>
                                                    <th>Pink</th>
                                                    <th>Orange</th>
                                                    <th>Black</th>
                                                </tr>
                                                <tr>
                                                    <th>Bet A</th>
                                                    <td>100</td>
                                                    <td>200</td>
                                                    <td>150</td>
                                                    <td>50</td>
                                                    <td>100</td>
                                                    <td>400</td>
                                                    <td>50</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <p>Q1. The buying price that can be randomly generated by our algorithm for this bet can be between:</p>

                                    <Radio value={0} label="50 to 300" name="q1" />
                                    <Radio value={1} label="0 to 300" name="q1" />
                                    <Radio value={2} label="50 to 400" name="q1" />
                                    <Radio value={3} label="0 to 500" name="q1" />

                                    <p>Q2. Suppose someone states INR {train_price} as the lowest price at which they are willing to sell the above bet, and the random buying price generated by our algorithm is INR 250. What would be the earnings of this person from this decision?</p>

                                    <Radio value={0} label="INR 150" name="q2" />
                                    <Radio value={1} label="INR 250" name="q2" />
                                    <Radio value={2} label="INR 100" name="q2" />
                                    <Radio value={3} label="INR 600" name="q2" />
                                    <Radio value={4} label="INR 0" name="q2" />

                                    <p>Q3. Suppose someone states INR {train_price} as the lowest price at which they are willing to sell the above bet, and the random buying price generated by our algorithm is INR 100. What would be the earnings of this person from this decision?</p>

                                    <Radio value={0} label="INR 0" name="q3" />
                                    <Radio value={1} label="INR 100" name="q3" />
                                    <Radio value={2} label="INR 600" name="q3" />
                                    <Radio value={3} label="Determined by the random draw from the urn" name="q3" />

                                    <p>Q4. Suppose someone states INR {train_price} as the lowest price at which they are willing to sell the above bet, and the random buying price generated by our algorithm is INR 80. In that case the bet is unsold and, a ball is randomly drawn from the urn by our algorithm. Suppose the color of the drawn ball is Red. What would be the earnings of this person from this decision?</p>

                                    <Radio value={0} label="INR 50" name="q4" />
                                    <Radio value={1} label="INR 100" name="q4" />
                                    <Radio value={2} label="INR 200" name="q4" />
                                    <Radio value={3} label="INR 150" name="q4" />
                                </div>

                                {errorq3 != "" && <p className="text-red-500">{errorq3}</p>}
                                
                                <button disabled={loading} className="text-center">
                                    <div className={`border border-black rounded-md py-2 px-5 ${loading ? "bg-gray-400" : "bg-white"}`}>{loading ? "Submitting..." : "Submit"}</div>
                                </button>
                            </form>

                        </div>
                    </main>
                </>
            )}
        </>
    )
}