import mongoose from "mongoose"

export interface Responses extends mongoose.Document {
    session_id: string;
    response: object[];
    iq: object;
    train_price: number;
    fin: boolean
}

const ResponseSchema = new mongoose.Schema<Responses> ({
    session_id: {
        type: String
    },
    response: {
        type: [{
            start_time: Date,
            end_time: Date,
            question_type: String,
            question_index: Object,
            answer: Object
        }]
    },
    iq: {
        type: {
            start_time: Date,
            end_time: Date,
            response: [Number]
        }
    },
    train_price: {
        type: Number
    },
    fin: {
        type: Boolean
    }
});

export default mongoose.models.Response || mongoose.model<Responses>("Response", ResponseSchema);