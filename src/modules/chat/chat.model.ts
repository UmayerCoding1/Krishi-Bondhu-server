import mongoose, { Types } from "mongoose";
import { IChat } from "./chat.interface";

const { Schema, model, models } = mongoose;

const chatSchema = new Schema<IChat>({
    userId: {
        type: Types.ObjectId,
        required: true,
        ref: 'User'
    },
    chatId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    messages: [
        {
            role: {
                type: String,
                require: true
            },
            content: {
                type: String,
                require: true
            }
        }
    ]
}, { timestamps: true });

export const Chat = models.Chat || model<IChat>('Chat', chatSchema);