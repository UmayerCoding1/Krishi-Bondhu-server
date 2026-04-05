import { Types } from "mongoose";


export interface ICrop {
    _id?: Types.ObjectId;
    location: string;
    soilType: string;
    season: string;
    createdAt?: Date;
    updatedAt?: Date;
} 