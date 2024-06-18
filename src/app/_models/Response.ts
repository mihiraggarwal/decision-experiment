import mongoose from "mongoose"

export interface Responses extends mongoose.Document {
    session_id: string;
    response: object[];
}

const ResponseSchema = new mongoose.Schema<Responses> ({
    session_id: {
        type: String
    },
    response: {
        type: [{
            question_index: Number,
            answer: Number
        }]
    },
});

export default mongoose.models.Response || mongoose.model<Responses>("Response", ResponseSchema);