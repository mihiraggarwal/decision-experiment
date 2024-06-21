import mongoose from "mongoose"

export interface Users extends mongoose.Document {
    password: string;
    upi: string;
    amount: number;
    chosen_bet: number;
    order: object[];
    current_slug: string;
    current_question_index: number;
    pdf_pass: string;
    total_bets: number;
    price: number;
}

const UserSchema = new mongoose.Schema<Users> ({
    password: {
        type: String,
        required: true
    },
    upi: {
        type: String,
    },
    amount: {
        type: Number,
        default: 0
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
    }
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);