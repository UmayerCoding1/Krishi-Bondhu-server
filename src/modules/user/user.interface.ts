import { Types } from "mongoose";


export enum PLANTYPE {
    FREE = "free",
    PREMIUM = "premium",

}

export enum ROLE {
    USER = "user",
    ADMIN = "admin",
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
    isVerified: boolean;
    // plan?: {
    //     type: PLANTYPE;
    //     startDate: Date;
    //     endDate: Date;
    //     token: number;
    //     planId: Types.ObjectId;
    // }
    accessToken?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;

}