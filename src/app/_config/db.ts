'use server'

import "dotenv/config";
import mongoose from "mongoose";

declare global {
    var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local",
    );
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async () => {
    if (cached.conn) {
        console.log("Mongodb connected")
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("Mongodb connected")
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    if (cached.conn != null) {
        console.log("Mongodb connected")
    }
}

export default dbConnect