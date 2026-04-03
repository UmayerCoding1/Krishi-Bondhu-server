import { Types } from "mongoose";


export enum PLANTYPE {
    FREE = "free",
    PREMIUM = "premium",

}

export interface IUSer {
    name: string;
    email: string;
    password: string;
    slug?: string;
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

}