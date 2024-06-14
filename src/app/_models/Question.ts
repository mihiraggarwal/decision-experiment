import mongoose from "mongoose"

export interface Questions extends mongoose.Document {
    cp: number;
    part: number;
    subpart: number;
    question: string;
    status: boolean;
}

const QuestionSchema = new mongoose.Schema<Questions> ({
    cp: {
        type: Number,
        required: true,
    },
    part: {
        type: Number,
        required: true,
    },
    subpart: {
        type: Number,
    },
    question: {
        type: String,
        required: true,
    },
});

export default mongoose.models.Question || mongoose.model<Questions>("Question", QuestionSchema);