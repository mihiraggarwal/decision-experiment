"use client";

import Input from '../input'
import Prompt from '../prompt'
import { useSession } from 'next-auth/react'
import { JSX, useState } from 'react';
import Dialog from '../dialog';

import { cp3_bet1, cp3_bet2 } from '../../_assets/bets'
import Img from '../img';
import Radio from '../radio';
import SubmitBtn from '../submitBtn';
import Scroll from '../scroll';

export default function CP3({submit, bets_order, total, radio}: {submit: ((formData: FormData) => void), bets_order: number[], total: number, radio: boolean}) {

    const { data: session } = useSession()
    const session_id = session?.user.id

    const start_time = new Date().toString()

    const [dialog, setDialog] = useState(false)

    const f = <span className="font-bold">not known.</span>
    const statements = [<>, with exactly 1 pink, 1 orange, 1 purple, 1 green, 1 red, 1 black, 1 yellow, and 1 blue ball</>, <>. Each of these balls is either pink, orange, purple, green, red, black, yellow, or blue. However, the exact number of balls of these eight colors is not known</>]


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
                                    <th>Bet</th>
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
                                    <th>Bet</th>
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
                                    <th colSpan={2}>8 balls</th>
                                </tr>
                                <tr>
                                    <td></td>
                                    <th>Chosen Color</th>
                                    <th>Other Colors</th>
                                </tr>
                                <tr>
                                    <th>Bet {dict[index+1]}</th>
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
                return(<p>The following bet is placed on a random draw of a ball from this urn. First, you choose one of the eight colors. If the color of the drawn ball is the same as the color you chose, it pays INR {cp3_bet1[0]}. If the drawn ball is of any other color, it pays nothing.</p>)
            case 2:
                return(<>
                <p className="w-full text-left">The following two bets are placed on a random draw of a ball from urn 1 and urn 2, respectively.</p>
                    
                <ul className="list-disc list-inside w-full px-8">
                    <li><span className="font-bold">Bet A</span> is placed on a draw from urn 1. First, you choose one of the eight colors. If the color of the drawn ball from urn 1 is the same as the color you chose, it pays INR {cp3_bet1[0]}. If the drawn ball is of any other color, it pays nothing.</li>
                    <li><span className="font-bold">Bet B</span> is placed on a draw from urn 2. First, you choose one of the eight colors. If the color of the drawn ball from urn 2 is the same as the color you chose, it pays INR {cp3_bet1[0]}. If the drawn ball is of any other color, it pays nothing.</li>
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

    const Initial = () => {
        switch (total) {
            case 1:
                if (bets_order[0] == 1) {
                    return (<p>Shown below is the image of an urn. The urn contains a total of 8 balls, with exactly 1 pink, 1 orange, 1 purple, 1 green, 1 red, 1 black, 1 yellow, and 1 blue ball.</p>)
                }
                else {
                    return (<p>Shown below is the image of an urn. The urn contains a total of 8 balls. Each of these balls is either pink, orange, purple, green, red, black, yellow, or blue. However, the exact number of balls of these eight colors is not known.</p>)
                }
            default:
                return (<p>Shown below are the images of two urns. Urn 1 contains a total of 8 balls{statements[bets_order[0]-1]}. Urn 2 also contains a total of 8 balls{statements[bets_order[1]-1]}.</p>)
        }
    }

    const Imgs = () => {
        const final: JSX.Element[] = []
        if (total == 1) {
            Array.from({length: total}, (x, i) => {
                final.push(
                    <div className="flex flex-col gap-5 items-center">
                        <Img url={`/assets/urns/CP3_Urn${bets_order[i]}.png`} />
                    </div>
                )
            });
        }
        else {
            Array.from({length: total}, (x, i) => {
                final.push(
                    <div className="flex flex-col gap-5 items-center">
                        <Img url={`/assets/urns/CP3_Urn${bets_order[i]}.png`} />
                        <div>Urn {i+1}</div>
                    </div>
                )
            });
        }
        return final
    }

    return (
        <div className="flex flex-col gap-5 items-center">
            <Scroll />
            <Initial />

            <div className="flex flex-col gap-10 md:flex-row md:gap-20">
                <Imgs />
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