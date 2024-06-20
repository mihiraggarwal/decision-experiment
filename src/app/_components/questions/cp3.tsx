"use client";

import Input from '../input'
import Prompt from '../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../dialog';

import { cp3_bet1, cp3_bet2 } from '../../_assets/bets'
import Img from '../img';
import Radio from '../radio';

export default function CP3({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const start_time = new Date().toString()

    const [dialog, setDialog] = useState(false)

    const cp_bets: number[][] = []
    bets_order.forEach(i => {
        switch(i) {
            case 1:
                cp_bets.push(cp3_bet1)
                break
            case 2:
                cp_bets.push(cp3_bet2)
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
                if (bets_order[0] == 1) {
                    final.push(
                        <table> 
                            <tbody>
                                <tr>
                                    <td></td>
                                    <th>1 ball</th>
                                    <th>7 balls</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Chosen Color</th>
                                    <th>Other Colors</th>
                                </tr>
                                <tr>
                                    <th>Reward</th>
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
                                    <th colSpan={2}>8 balls</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Chosen Color</th>
                                    <th>Other Colors</th>
                                </tr>
                                <tr>
                                    <th>Reward</th>
                                    {entries}
                                </tr>
                            </tbody>
                        </table>
                    )
                }
            }
            else {
                if (bets_order[index] == 1) {
                    final.push(
                        <table> 
                            <tbody>
                                <tr>
                                    <td></td>
                                    <th>1 ball</th>
                                    <th>7 balls</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Chosen Color</th>
                                    <th>Other Colors</th>
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
                                    <th colSpan={2}>8 balls</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Chosen Color</th>
                                    <th>Other Colors</th>
                                </tr>
                                <tr>
                                    <th>Ticket {dict[index+1]}</th>
                                    {entries}
                                </tr>
                            </tbody>
                        </table>
                    )
                }
            }
        })
        return (
            final
        )
    }

    const Ticket = () => {
        switch (total) {
            case 1:
                return(<p>You are offered a ticket for a game that plays out as follows. First, you choose one of the eight colors. Then, you must draw a ball from the urn without looking. If the color of the drawn ball is the same as the color you chose, you receive INR {cp3_bet1[0]}. If not, you receive nothing.</p>)
            case 2:
                return(<p>You are offered one of two tickets, ticket A and B, for a game that plays out as follows. First, you choose one of the eight colors. Then, if you have ticket A, you must draw a ball from urn 1 without looking. If you have ticket B, you must draw a ball from urn 2 without looking. In both cases, if the color of the drawn ball is the same as the color you chose, you receive INR {cp3_bet1[0]}. If not, you receive nothing.</p>)
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

    const Initial = () => {
        switch (total) {
            case 1:
                if (bets_order[0] == 1) {
                    return (<p>There is an urn placed in front of you. The urn contains a total of eight balls, with exactly 1 ball colored purple (P), cyan (C), brown (Br), green (G), blue (B), red (R), maroon (M), and yellow (Y) each.</p>)
                }
                else {
                    return (<p>There is an urn placed in front of you. The urn contains a total of eight balls, each ball colored one of purple (P), cyan (C), brown (Br), green (G), blue (B), red (R), maroon (M), and yellow (Y). However, the exact number of balls of each colour is not known.</p>)
                }
            default:
                return (<p>There are two urns placed in front of you. Urn 1 contains eight balls, with 1 ball colored purple (P), cyan (C), brown (Br), green (G), blue (B), red (R), maroon (M), and yellow (Y) each. Urn 2 also contains eight balls, each of which is of one of the above eight colors. However, the exact number of balls of each colour in urn 2 is not known.</p>)
        }
    }

    return (
        <div className="flex flex-col gap-5 items-center">
            <Initial />

            <div className="flex flex-col gap-5 md:flex-row">
                <Img url="/assets/urns/CP1_Urn.png" />
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

                <button type="submit" className="">
                    <div className="border border-black rounded-md py-2 px-5">Submit</div>
                </button>
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