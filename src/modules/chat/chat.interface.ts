import { Types } from "mongoose";

export interface IChat {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    chatId: string;
    title: string;
    messages: [
        {
            role: String,
            content: String,
        },
    ],
    createdAt?: Date;
    updatedAt?: Date
}