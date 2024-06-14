import mongoose from "mongoose"

export interface Users extends mongoose.Document {
    name: string;
    password: string;
    upi: string;
    amount: number;
}

const UserSchema = new mongoose.Schema<Users> ({
    name: {
        type: String,
    },
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
    }
});

export default mongoose.models.User || mongoose.model<Users>("User", UserSchema);