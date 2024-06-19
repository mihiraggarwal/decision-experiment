"use client";

import Input from '../../input'
import Prompt from '../../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../../dialog';

import { cp1_bet1, cp1_bet2, cp1_bet3, cp1_bet4 } from '../../../_assets/bets'
import Img from '../../img';

export default function CP1_Q2({submit, bets_order}: {submit: ((formData: FormData) => void), bets_order: number[]}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const [dialog, setDialog] = useState(false)

    const cp_bets: number[][] = []
    bets_order.forEach(i => {
        switch(i) {
            case 1:
                cp_bets.push(cp1_bet1)
                break
            case 2:
                cp_bets.push(cp1_bet2)
                break
            case 3:
                cp_bets.push(cp1_bet3)
                break
            case 4:
                cp_bets.push(cp1_bet4)
                break
        }
    })

    const Bets = ({bet}: {bet: number[]}) => {
        const entries: JSX.Element[] = []
        bet.forEach(i => {
            entries.push(<td>{i}</td>)
        });
        return <>{entries}</>
    }

    return (
        <div className="flex flex-col gap-5 items-center">
            <p>There is an urn placed in front of you. The urn contains exactly 1 purple ball, 1 white ball, and 4 balls that may each be one of red, blue, yellow, and green. You do not know the exact number of balls that are red, blue, yellow, or green.</p>

            <div className="flex flex-col gap-5 md:flex-row">
            <Img url="/assets/urns/CP1_Urn.png" />
            </div>

            <p>You are offered a ticket for a game that plays out as follows. First, you must draw a ball from the urn without looking. If the drawn ball is blue or green, you receive INR {cp_bets[0][4]}. Else, you receive nothing.</p>

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
                        <Bets bet={cp_bets[0]} />
                    </tr>
                </tbody>
            </table>

            <Prompt plural={false} />

            <form className="flex flex-col gap-10 items-center mt-5" action={submit}>
                <input type="hidden" name="num" value={1} />
                <input type="hidden" name="type" value="box" />
                <input type="hidden" name="id" value={session_id} />
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which I would sell this ticket is:</div>
                    <Input type="number" placeholder="Price" name="price1" />
                </div>
                <button type="submit" className="">
                    <div className="border border-black rounded-md py-2 px-5">Submit</div>
                </button>
            </form>

            <div className="flex flex-row items-center gap-3">
                <div><span className="font-bold">*Note</span>: It is in your interest to specify the above value correctly</div>
                <button className="px-2 border-2 border-black rounded-full" onClick={() => setDialog(x => !x)}>?</button>
            </div>

            {dialog && 
                <Dialog />
            }
        </div>
    )
}