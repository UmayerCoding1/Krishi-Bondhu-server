import mongoose, { Schema, model, models } from "mongoose";
import { AiRequestStatus, IAiRequest, RequestCategory } from "./aiRequest.interface";

const aiRequestSchema = new Schema<IAiRequest>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user_prompt: {
        type: String,
        required: true,
    },
    ai_response: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: RequestCategory,
        required: true,
    },

    // token info
    request_tokens: {
        type: Number,
        required: true,
    },
    response_tokens: {
        type: Number,
        required: true,
    },
    total_tokens: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: AiRequestStatus,
        required: true,
    },
    error_message: {
        type: String,
    },
    model_used: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
    },
    location: {
        type: {
            district: String,
            division: String,
        },
    },
    is_helpful: {
        type: Boolean,
    },
    rating: {
        type: Number,
    },
    feedback_text: {
        type: String,
    },
    ip_address: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const AiRequest = models.AiRequest || model<IAiRequest>("AiRequest", aiRequestSchema);