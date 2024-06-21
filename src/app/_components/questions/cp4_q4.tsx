"use client";

import Input from '../input'
import Prompt from '../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../dialog';

import { cp4_bet1, cp4_bet2, cp4_bet3 } from '../../_assets/bets'
import Img from '../img';
import Radio from '../radio';
import SubmitBtn from '../submitBtn';

export default function CP4_Q4({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const start_time = new Date().toString()

    const [dialog, setDialog] = useState(false)

    const cp_bets: number[][] = []
    const statements: string[] = []
    bets_order.forEach(i => {
        switch(i) {
            case 1:
                cp_bets.push(cp4_bet1)
                statements.push(`${cp4_bet1[0]} if the drawn ball is green`)
                break
            case 2:
                cp_bets.push(cp4_bet2)
                statements.push(`${cp4_bet2[1]} if the drawn ball is red`)
                break
            case 3:
                cp_bets.push(cp4_bet3)
                statements.push(`${cp4_bet3[0]} if the drawn ball is yellow`)
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
            if (bets_order[index] == 1) {
                final.push(
                    <table> 
                        <tbody>
                            <tr>
                                <td></td>
                                <th>1 ball</th>
                                <th colSpan={2}>2 balls</th>
                            </tr>
                            <tr>
                                <td></td>
                                <th>Green</th>
                                <th>Red</th>
                                <th>Purple</th>
                            </tr>
                            <tr>
                                <th>Ticket {dict[index+1]}</th>
                                {entries}
                            </tr>
                        </tbody>
                    </table>
                )
            }
            else {
                final.push(
                    <table> 
                        <tbody>
                            <tr>
                                <td></td>
                                <th>1 ball</th>
                                <th>1 ball</th>
                            </tr>
                            <tr>
                                <td></td>
                                <th>Yellow</th>
                                <th>Cyan</th>
                            </tr>
                            <tr>
                                <th>Ticket {dict[index+1]}</th>
                                {entries}
                            </tr>
                        </tbody>
                    </table>
                )
            }
        })
        return (
            final
        )
    }

    const Ticket = () => {
        return(
            <p>You are offered one of two tickets, ticket A and B, for a game that plays out as follows. If you have ticket A, you must draw a ball from urn 1 without looking. If you have ticket A, you draw a ball from urn 1 and receive INR {statements[0]} and nothing otherwise. If you have ticket B, you draw a ball from urn 2 and receive INR {statements[1]} and nothing otherwise.</p>
        )
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
            <p>There are two urns placed in front of you. Urn 1 contains exactly 1 green ball and 2 balls that may each be either red or purple. You do not know the exact number of balls that are red or purple. Urn 2 contains exactly 1 yellow ball and 1 cyan ball.</p>

            <div className="flex flex-col gap-10 md:flex-row md:gap-20">
                <div className="flex flex-col gap-5 items-center">
                    <Img url={`/assets/urns/CP4_Urn${bets_order[0]}.png`} />
                    <div>Urn A</div>
                </div>
                <div className="flex flex-col gap-5 items-center">
                    <Img url={`/assets/urns/CP4_Urn${bets_order[1]}.png`} />
                    <div>Urn B</div>
                </div>
            </div>

            <Ticket />

            <div className="flex flex-col gap-10">
                <Bets />
            </div>

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