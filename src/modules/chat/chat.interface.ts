import { Types } from "mongoose";

export interface IChat {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    messages: [
        {
            role: String,
            content: String,
        },
    ],
    createdAt?: Date;
    updatedAt?: Date
}