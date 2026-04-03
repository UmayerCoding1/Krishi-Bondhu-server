import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("MongoDB connecting", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};