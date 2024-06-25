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

export default function CP4({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

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
                cp_bets.push(cp4_bet1)
                singular.push(`green, the bet pays INR ${cp4_bet1[0]}`)
                statements.push(`INR ${cp4_bet1[0]} if the drawn ball is green`)
                break
            case 2:
                cp_bets.push(cp4_bet2)
                singular.push(`red, the bet pays INR ${cp4_bet2[1]}`)
                statements.push(`INR ${cp4_bet2[1]} if the drawn ball is red`)
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
                    <th>Bet</th>
                    {entries}
                </tr>)    
            }
            else {
                final.push(<tr>
                    <th>Bet {dict[index+1]}</th>
                    {entries}
                </tr>)
            }
        })
        return (<>{final}</>)
    }

    const Ticket = () => {
        switch (total) {
            case 1:
                return(<p>The following bet is placed on a random draw of a ball from this urn. If the drawn ball is {singular[0]}. If a ball of any other color is drawn, it pays nothing.</p>)
            case 2:
                return(<>
                    <p className="w-full text-left">There are two bets placed on a random draw of a ball from this urn.</p>
                    <ul className="list-disc list-inside w-full px-8">
                        <li><span className="font-bold">Bet A</span> pays INR {statements[0]}. If the drawn ball is of any other color, it pays nothing.</li>
                        <li><span className="font-bold">Bet B</span> pays INR {statements[1]}. If the drawn ball is of any other color, it pays nothing.</li>
                    </ul>
                    </>)
        }
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
            <p>Shown below is the image of an urn. The urn contains a total of 3 balls. There is 1 green ball. Each of the other 2 balls could be red or purple. However, the exact number of balls of these two colors is not known.</p>

            <div className="flex flex-col gap-5 md:flex-row">
                <Img url="/assets/urns/CP4_Urn2.png" />
            </div>

            <Ticket />

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
                <div><span className="font-bold">*Note</span>: Recall that it is in your own interest to state this truthfully.</div>
                <button className="px-2 border-2 border-black rounded-full" onClick={() => setDialog(x => !x)}>?</button>
            </div>

            {dialog && 
                <Dialog />
            }
        </div>
    )
}