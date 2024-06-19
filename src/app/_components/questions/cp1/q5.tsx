"use client";

import Input from '../../input'
import Prompt from '../../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../../dialog';

import { cp1_bet1, cp1_bet2, cp1_bet3, cp1_bet4 } from '../../../_assets/bets'
import Img from '../../img';

export default function CP1_Q5({submit, bets_order}: {submit: ((formData: FormData) => void), bets_order: number[]}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const [dialog, setDialog] = useState(false)
    
    const cp_bets: number[][] = []
    const statements: string[] = []
    bets_order.forEach(i => {
        switch(i) {
            case 1:
                cp_bets.push(cp1_bet1)
                statements.push(`${cp1_bet1[0]} if the drawn ball is purple or white`)
                break
            case 2:
                cp_bets.push(cp1_bet2)
                statements.push(`${cp1_bet2[4]} if the drawn ball is blue or green`)
                break
            case 3:
                cp_bets.push(cp1_bet3)
                statements.push(`${cp1_bet3[5]} if the drawn ball is green`)
                break
            case 4:
                cp_bets.push(cp1_bet4)
                statements.push(`${cp1_bet4[3]} if the drawn ball is yellow`)
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

            <p>You are offered one of three tickets, ticket A, B and C, for a game that plays out as follows. First, you must draw a ball from the urn without looking. If you have ticket A, you receive INR {statements[0]} and nothing otherwise. If you have ticket B, you receive INR {statements[1]} and nothing otherwise. If you have ticket C, you receive INR {statements[2]} and nothing otherwise.</p>

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
                        <th>Ticket A</th>
                        <Bets bet={cp_bets[0]} />
                    </tr>
                    <tr>
                        <th>Ticket B</th>
                        <Bets bet={cp_bets[1]} />
                    </tr>
                    <tr>
                        <th>Ticket C</th>
                        <Bets bet={cp_bets[2]} />
                    </tr>
                </tbody>
            </table>

            <Prompt plural={true} />

            <form className="flex flex-col gap-10 items-center mt-5" action={submit}>
                <input type="hidden" name="num" value={3} />
                <input type="hidden" name="id" value={session_id} />
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which I would sell ticket A is:</div>
                    <Input type="number" placeholder="Price" name="price1" />
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which I would sell ticket B is:</div>
                    <Input type="number" placeholder="Price" name="price2" />
                </div>
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which I would sell ticket C is:</div>
                    <Input type="number" placeholder="Price" name="price3" />
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