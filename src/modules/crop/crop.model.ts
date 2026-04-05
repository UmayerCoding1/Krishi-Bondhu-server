import mongoose, { Schema, model, models } from "mongoose";
import { ICrop } from "./crop.interface";

const cropSchema = new Schema<ICrop>({
    location: {
        type: String,
        required: true
    },
    soilType: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },

}, { timestamps: true });

export const Crop = models.Crop || model<ICrop>('Crop', cropSchema);
