"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
const connectDB = async () => {
    if (isConnected)
        return;
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB connected");
    }
    catch (error) {
        console.error("DB connection failed:", error);
        throw error;
    }
};
exports.connectDB = connectDB;
