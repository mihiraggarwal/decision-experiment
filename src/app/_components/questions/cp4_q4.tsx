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
import Scroll from '../scroll';

export default function CP4_Q4({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const start_time = new Date().toString()

    const [dialog, setDialog] = useState(false)
    
    const initials = [<>3 balls. There is 1 green ball. Each of the other 2 balls could be red or purple. However, the exact number of balls of these two colors is not known</>, <>2 balls, exactly 1 yellow ball and 1 cyan ball</>]
    const cp_bets: number[][] = []
    const statements: string[] = []
    
    bets_order.forEach(i => {
        switch(i) {
            case 1:
                cp_bets.push(cp4_bet1)
                statements.push(`green, the bet pays INR ${cp4_bet1[0]}. If the drawn ball is of any other color, it pays nothing`)
                break
            case 2:
                cp_bets.push(cp4_bet2)
                statements.push(`red, the bet pays INR ${cp4_bet2[1]}. If the drawn ball is of any other color, it pays nothing`)
                break
            case 3:
                cp_bets.push(cp4_bet3)
                statements.push(`yellow, the bet pays INR ${cp4_bet3[0]}. If not, it pays nothing`)
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
            if (bets_order[index] == 2) {
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
                                <th>Bet {dict[index+1]}</th>
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
                                <th>Bet {dict[index+1]}</th>
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
        return(<>
            <p className="w-full text-left">The following two bets are placed on a random draw of a ball from one of these two urns.</p>
                
            <ul className="list-disc list-inside w-full px-8">
                <li><span className="font-bold">Bet A</span> is placed on a draw from urn 1. If the color of the drawn ball is {statements[0]}.</li>
                <li><span className="font-bold">Bet B</span> is placed on a draw from urn 2. If the color of the drawn ball is {statements[1]}.</li>
            </ul>
            </>
        )
    }

    const Answer = () => {
        if (total == 1) {
            return (
                <div className="flex flex-col gap-1 items-center">
                    <div className="font-bold text-center">The lowest price at which you would sell this bet is:</div>
                    <Input type="number" placeholder="Price" name={`price1`} />
                </div>
            )
        }
        const final: JSX.Element[] = []
        if (!radio) {
            Array.from({length: total}, (x, i) => {
                final.push(
                    <div className="flex flex-col gap-1 items-center">
                        <div className="font-bold text-center">The lowest price at which you would sell bet {dict[i+1]} is:</div>
                        <Input type="number" placeholder="Price" name={`price${i+1}`} />
                    </div>
                )
            });
        }
        else {
            Array.from({length: total}, (x, i) => {
                final.push(
                    <div className="flex flex-col gap-1 items-center">
                        <Radio value={1} label={`Bet ${dict[i+1]}`} />
                    </div>
                )
            });
        }
        return(<>{final}</>)
    }

    return (
        <div className="flex flex-col gap-5 items-center">
            <Scroll />
            <p>Shown below are the images of two urns. Urn 1 contains a total of {initials[bets_order[0]-2]}. Urn 2 contains a total of {initials[bets_order[1]-2]}.</p>

            <div className="flex flex-col gap-10 md:flex-row md:gap-20">
                <div className="flex flex-col gap-5 items-center">
                    <Img url={`/assets/urns/CP4_Urn${bets_order[0]}.png`} />
                    <div>Urn 1</div>
                </div>
                <div className="flex flex-col gap-5 items-center">
                    <Img url={`/assets/urns/CP4_Urn${bets_order[1]}.png`} />
                    <div>Urn 2</div>
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
                <div><span className="font-bold">*Note</span>: Recall that it is in your own interest to state this truthfully.</div>
                <button className="px-2 border-2 border-black rounded-full" onClick={() => setDialog(x => !x)}>?</button>
            </div>

            {dialog && 
                <Dialog />
            }
        </div>
    )
}