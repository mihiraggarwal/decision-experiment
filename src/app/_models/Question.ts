import mongoose from "mongoose"

export interface Questions extends mongoose.Document {
    type: string;
    index: number;
    answer: number[];
    iq_answers: number[]
}

const QuestionSchema = new mongoose.Schema<Questions> ({
    type: {
        type: String
    },
    index: {
        type: Number
    },
    answer: {
        type: [Number]
    },
    iq_answers: {
        type: [Number]
    }
});

export default mongoose.models.Question || mongoose.model<Questions>("Question", QuestionSchema);