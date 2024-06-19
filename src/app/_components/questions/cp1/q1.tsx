"use client";

import Image from 'next/image'
import Input from '../../input'
import Prompt from '../../prompt'
import { useSession } from 'next-auth/react'

export default function CP1_Q1({submit}: {submit: ((formData: FormData) => void)}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    return (
        <div className="flex flex-col gap-5 items-center">
            <p>There is an urn placed in front of you. The urn contains exactly 1 purple ball, 1 white ball, and 4 balls that may each be one of red, blue, yellow, and green. You do not know the exact number of balls that are red, blue, yellow, or green.</p>

            <div className="flex flex-col gap-5 md:flex-row">
            <Image 
                src="/Untitled1.png"
                alt="Vercel logo"
                className=""
                width={150}
                height={24}
            />
            <Image 
                src="/vercel.svg"
                alt="Vercel logo"
                className=""
                width={150}
                height={24}
            />
            </div>

            <p>You are offered a ticket for a game that plays out as follows. First, you must draw a ball from the urn without looking. If the drawn ball is purple or white, you receive INR 500. Else, you receive nothing.</p>

            <table> 
                <tbody>
                    <tr>
                        <td></td>
                        <th>1 ball</th>
                        <th>1 ball</th>
                        <th colSpan={4}>4 balls</th>
                    </tr>
                    <tr>
                        <td></td>
                        <th>Purple</th>
                        <th>White</th>
                        <th>Red</th>
                        <th>Yellow</th>
                        <th>Blue</th>
                        <th>Green</th>
                    </tr>
                    <tr>
                        <th>Rewards</th>
                        <td>500</td>
                        <td>500</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>

            <Prompt plural={false} />

            <form className="flex flex-col gap-10 items-center mt-5" action={submit}>
                <input type="hidden" name="num" value={1} />
                <input type="hidden" name="id" value={session_id} />
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which I would sell this ticket is:</div>
                    <Input type="number" placeholder="Price" name="price1" />
                </div>
                <button type="submit" className="">
                    <div className="border border-black rounded-md py-2 px-5">Submit</div>
                </button>
            </form>
        </div>
    )
}