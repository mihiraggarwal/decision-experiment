import mongoose from "mongoose"

export interface Responses extends mongoose.Document {
    session_id: string;
    order: object[];
    response: object[];
    current_slug: string;
    current_question_num: number;
}

const ResponseSchema = new mongoose.Schema<Responses> ({
    session_id: {
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
    current_slug: {
        type: String
    },
    current_question_num: {
        type: Number
    }
});

export default mongoose.models.Response || mongoose.model<Responses>("Response", ResponseSchema);