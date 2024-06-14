import mongoose from "mongoose"

export interface Responses extends mongoose.Document {
    index: number;
    password: string;
    order: object[];
    response: object[];
}

const ResponseSchema = new mongoose.Schema<Responses> ({
    index: {
        type: Number,
        required: true,
        unique: true,
    },
    password: {
        type: String
    },
    order: {
        type: [{
            cp: Number,
            part: Number,
            subpart: Number,
            bets_order: Array<Number>
        }]
    },
    response: {
        type: [{
            question_index: Number,
            answer: Number
        }]
    },
});

export default mongoose.models.Response || mongoose.model<Responses>("Response", ResponseSchema);