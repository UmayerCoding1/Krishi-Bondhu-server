import mongoose, { Schema, model, models } from "mongoose";
import { IUSer, PLANTYPE } from "./user.interface";

const userSchema = new Schema<IUSer>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    attempt: {
        type: Number,
        default: 2
    }
    // plan: {
    //     type: {
    //         type: String,
    //         enum: PLANTYPE,
    //         default: PLANTYPE.FREE
    //     },
    //     startDate: {
    //         type: Date,

    //     },
    //     endDate: {
    //         type: Date,
    //     },
    //     token: {
    //         type: Number,
    //         default: 0
    //     },
    //     planId: {
    //         type: Schema.Types.ObjectId,
    //         ref: "Plan"
    //     }
    // }
}, { timestamps: true });

export const User = models.User || model<IUSer>("User", userSchema);
