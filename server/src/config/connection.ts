import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

console.log(`🔌 Connecting to MongoDB at: ${MONGODB_URI}`);

export function connectToDatabase() {
    return mongoose.connect(MONGODB_URI);
}