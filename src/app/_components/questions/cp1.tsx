"use client";

import Input from '../input'
import Prompt from '../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../dialog';

import { cp1_bet1, cp1_bet2, cp1_bet3, cp1_bet4 } from '../../_assets/bets'
import Img from '../img';
import Radio from '../radio';
import SubmitBtn from '../submitBtn';

export default function CP1({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const start_time = new Date().toString()

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

    const dict: { [key: number]: string } = {1: "A", 2: "B", 3: "C", 4: "D"}

    const Bets = () => {
        const final: JSX.Element[] = []
        cp_bets.forEach((bet, index) => {
            const entries: JSX.Element[] = []
            bet.forEach(i => {
                entries.push(<td>{i}</td>)
            });
            if (cp_bets.length == 1) {
                final.push(<tr>
                    <th>Reward</th>
                    {entries}
                </tr>)    
            }
            else {
                final.push(<tr>
                    <th>Ticket {dict[index+1]}</th>
                    {entries}
                </tr>)
            }
        })
        return (<>{final}</>)
    }

    const Ticket = () => {
        switch (total) {
            case 1:
                return(<p>You are offered a ticket, for a game that plays out as follows. First, you must draw a ball from the urn without looking. You receive INR {statements[0]} and nothing otherwise.</p>)
            case 2:
                return(<p>You are offered one of two tickets, ticket A and B, for a game that plays out as follows. First, you must draw a ball from the urn without looking. If you have ticket A, you receive INR {statements[0]} and nothing otherwise. If you have ticket B, you receive INR {statements[1]} and nothing otherwise.</p>)
            case 3:
                return(<p>You are offered one of three tickets, ticket A, B and C, for a game that plays out as follows. First, you must draw a ball from the urn without looking. If you have ticket A, you receive INR {statements[0]} and nothing otherwise. If you have ticket B, you receive INR {statements[1]} and nothing otherwise. If you have ticket C, you receive INR {statements[2]} and nothing otherwise.</p>)
        }
    }

    const Answer = () => {
        const final: JSX.Element[] = []
        if (!radio) {
            Array.from({length: total}, (x, i) => {
                final.push(
                    <div className="flex flex-col gap-1 items-center">
                        <div className="font-bold text-center">The lowest price at which I would sell ticket {dict[i+1]} is:</div>
                        <Input type="number" placeholder="Price" name={`price${i+1}`} />
                    </div>
                )
            });
        }
        else {
            Array.from({length: total}, (x, i) => {
                final.push(
                    <div className="flex flex-col gap-1 items-center">
                        <Radio value={1} label={`Ticket ${dict[i+1]}`} />
                    </div>
                )
            });
        }
        return(<>{final}</>)
    }

    return (
        <div className="flex flex-col gap-5 items-center">
            <p>Shown below is the image of an urn. The urn contains exactly 1 purple ball, 1 white ball, and 4 balls that may each be one of red, blue, yellow, and green. You do not know the exact number of balls that are red, blue, yellow, or green.</p>

            <div className="flex flex-col gap-5 md:flex-row">
                <Img url="/assets/urns/CP1_Urn.png" />
            </div>

            <Ticket />

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

                    <Bets />

                </tbody>
            </table>

            {total == 1 &&
                <Prompt plural={false} radio={radio} />
            }
            {total > 1 &&
                <Prompt plural={true} radio={radio} />
            }

            <form className="flex flex-col gap-10 items-center mt-5" action={submit}>
                <input type="hidden" name="num" value={total} />
                <input type="hidden" name="type" value="box" />
                <input type="hidden" name="start_time" value={start_time} />
                <input type="hidden" name="id" value={session_id} />
                
                <Answer />

                <SubmitBtn />
            </form>

            <div className="flex flex-row items-center gap-3">
                <div><span className="font-bold">*Note</span>: It is in your interest to specify the above correctly</div>
                <button className="px-2 border-2 border-black rounded-full" onClick={() => setDialog(x => !x)}>?</button>
            </div>

            {dialog && 
                <Dialog />
            }
        </div>
    )
}