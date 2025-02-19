import mongoose from "mongoose"

export interface Users extends mongoose.Document {
    password: string;
    upi: string;
    total_amount: number;
    amount_iq: number;
    amount_bet: number;
    chosen_bet: number;
    order: object[];
    current_slug: string;
    current_question_index: number;
    pdf_pass: string;
    total_bets: number;
    price: number;
    seenIq: boolean;
    trained: boolean;
    fin: boolean;
    seenBet: boolean;
}

const UserSchema = new mongoose.Schema<Users> ({
    password: {
        type: String,
        required: true
    },
    upi: {
        type: String,
    },
    total_amount: {
        type: Number,
    },
    amount_iq: {
        type: Number
    },
    amount_bet: {
        type: Number
    },
    chosen_bet: {
        type: Number
    },
    order: {
        type: [{
            cp: Number,
            part: Number,
            bets_order: Array<Number>
        }]
    },
    current_slug: {
        type: String
    },
    current_question_index: {
        type: Number
    },
    pdf_pass: {
        type: String
    },
    total_bets: {
        type: Number
    },
    price: {
        type: Number
    },
    seenIq: {
        type: Boolean
    },
    trained: {
        type: Boolean
    },
    fin: {
        type: Boolean
    },
    seenBet: {
        type: Boolean
    }
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);