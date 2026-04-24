import { Types } from "mongoose";


export enum PLANTYPE {
    FREE = "free",
    PREMIUM = "premium",

}

export enum ROLE {
    USER = "user",
    ADMIN = "admin",
}

export enum STATUS {
    ACTIVE = "active",
    INACTIVE = "inactive",
    BANNED = "banned",
    BLOCK = "block",
    DELETED = "deleted",
}

export interface IUSer {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    slug?: string;
    avatar?: string;
    role?: ROLE;
    otp?: {
        code: string;
        expiresAt: Date;
        slug: string;
    };
    isTwoFactorEnabled: boolean,
    isVerified: boolean;
    fermaerId?: string;
    system_config: {
        notification: {
            email: boolean,
            system_notification: boolean,
            safety_alert: boolean,
        }
    },
    // plan?: {
    //     type: PLANTYPE;
    //     startDate: Date;
    //     endDate: Date;
    //     token: number;
    //     planId: Types.ObjectId;
    // }
    status: STATUS;
    accessToken?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;

}