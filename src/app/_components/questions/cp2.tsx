"use client";

import Input from '../input'
import Prompt from '../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../dialog';

import { cp2_bet1, cp2_bet2, cp2_bet3, cp2_bet4 } from '../../_assets/bets'
import Img from '../img';
import Radio from '../radio';
import SubmitBtn from '../submitBtn';
import Scroll from '../scroll';

export default function CP2({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const start_time = new Date().toString()

    const [dialog, setDialog] = useState(false)

    const cp_bets: number[][] = []
    const statements: string[] = []
    const singular: string[] = []

    bets_order.forEach(i => {
        switch(i) {
            case 1:
                cp_bets.push(cp2_bet1)
                singular.push(`If the drawn ball is blue, you receive INR ${cp2_bet1[0]}. If it is pink, you receive INR ${cp2_bet1[2]}`)
                statements.push(`INR ${cp2_bet1[0]} if the drawn ball is blue, INR ${cp2_bet1[2]} if it is pink,`)
                break
            case 2:
                cp_bets.push(cp2_bet2)
                singular.push(`If the drawn ball is orange, you receive INR ${cp2_bet2[3]}. If it is yellow, you receive INR ${cp2_bet2[1]}`)
                statements.push(`INR ${cp2_bet2[3]} if the drawn ball is orange, INR ${cp2_bet2[1]} if it is yellow,`)
                break
            case 3:
                cp_bets.push(cp2_bet3)
                singular.push(`If the drawn ball is blue, you receive INR ${cp2_bet3[0]}`)
                statements.push(`INR ${cp2_bet3[0]} if the drawn ball is blue`)
                break
            case 4:
                cp_bets.push(cp2_bet4)
                singular.push(`If the drawn ball is yellow, you receive INR ${cp2_bet4[1]}`)
                statements.push(`INR ${cp2_bet4[1]} if the drawn ball is yellow`)
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
                return(<p>You are offered a ticket, for a game that plays out as follows. First, you must draw a ball from the urn without looking. {singular[0]}. Else, you receive nothing.</p>)
            case 2:
                return(<p>You are offered one of two tickets, ticket A and B, for a game that plays out as follows. First, a ball is drawn from the urn at random. If you were offered ticket A, you receive {statements[0]} and nothing otherwise. If you were offered ticket B, you receive {statements[1]} and nothing otherwise.</p>)
            case 3:
                return(<p>You are offered one of three tickets, ticket A, B, and C, for a game that plays out as follows. First, a ball is drawn from the urn at random. If you were offered ticket A, you receive {statements[0]} and nothing otherwise. If you were offered ticket B, you receive {statements[1]} and nothing otherwise. If you were offered ticket C, you receive {statements[2]} and nothing otherwise.</p>)
        }
    }

    const Answer = () => {
        if (total == 1) {
            return (
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which I would sell this ticket is:</div>
                    <Input type="number" placeholder="Price" name={`price1`} />
                </div>
            )
        }
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
            <Scroll />
            <p>Shown below is the image of an urn. The urn contains exactly 1 blue ball, 1 yellow ball, and 2 other balls, each of which may be either pink or orange. You do not know the exact number of balls that are pink or orange.</p>

            <div className="flex flex-col gap-5 md:flex-row">
                <Img url="/assets/urns/CP2_Urn.png" />
            </div>

            <Ticket />

            <table> 
                <tbody>
                    <tr>
                        <td></td>
                        <th>1 ball</th>
                        <th>1 ball</th>
                        <th colSpan={2}>2 balls</th>
                    </tr>
                    <tr>
                        <td></td>
                        <th>Blue</th>
                        <th>Yellow</th>
                        <th>Pink</th>
                        <th>Orange</th>
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