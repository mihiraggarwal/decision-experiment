import { getServerSession } from "next-auth";
import User from "../_models/User";
import dbConnect from "../_config/db";
import Page from "./content";

const TOTAL_CP = 4;

const QUE_CP1 = 8;
const QUE_CP2 = 8;
const QUE_CP3 = 3;
const QUE_CP4 = 4;

const BETS: { [key: string]: number[] } = {
    "1": [1, 1, 2, 3, 3, 1, 1, 1],
    "2": [1, 1, 2, 3, 3, 1, 1, 1],
    "3": [1, 1, 2],
    "4": [1, 1, 2, 2],
}

const genRandom = async (otp: string) => {
    let final_order = [];
    let total_bets = 0;

    const genPermutations = (arr: number[]): number[][] => {
        if (arr.length === 1) {
            return [arr];
        }
        const permutations: number[][] = [];
        for (let i = 0; i < arr.length; i++) {
            const currentNum = arr[i];
            const remainingNums = arr.filter((_, index) => index !== i);
            const subPermutations = genPermutations(remainingNums);
            for (let j = 0; j < subPermutations.length; j++) {
                permutations.push([currentNum, ...subPermutations[j]]);
            }
        }
        return permutations;
    };

    const getTreatment = (qnum: number) => {
        let q;
        if (qnum == 1) {
            q = Array.from({length: QUE_CP1}, (_, i) => i + 1)[Math.floor(Math.random() * QUE_CP1)];
        }
        else if (qnum == 2) {
            q = Array.from({length: QUE_CP2}, (_, i) => i + 1)[Math.floor(Math.random() * QUE_CP2)];
        }
        else if (qnum == 3) {
            q = Array.from({length: QUE_CP3}, (_, i) => i + 1)[Math.floor(Math.random() * QUE_CP3)];
        }
        else {
            q = Array.from({length: QUE_CP4}, (_, i) => i + 1)[Math.floor(Math.random() * QUE_CP4)];
        }
        return q;
    }

    const numbers = Array.from({length: TOTAL_CP}, (_, i) => i + 1);
    const permutations = genPermutations(numbers);
    const randomElement = permutations[Math.floor(Math.random() * TOTAL_CP)];

    for (let i = 0; i < TOTAL_CP; i++) {
        const cp = randomElement[i];
        const part = getTreatment(cp);
        final_order.push({
            cp: cp,
            part: part
        });
        total_bets += BETS[cp][part-1];
    }

    await dbConnect();
    const user = await User.findOne({
        password: otp
    })
    
    if (user.order == null || user.order.length < TOTAL_CP) {
        user.order = final_order;
        user.total_bets = total_bets
        await user.save();
    }
    else {
        return -1;
    }

    return total_bets
}

export default async function Preplay() {
    const session = await getServerSession()
    const otp = session?.user.name

    const total_bets = await genRandom(otp);

    return <Page total_bets={total_bets} />
}
