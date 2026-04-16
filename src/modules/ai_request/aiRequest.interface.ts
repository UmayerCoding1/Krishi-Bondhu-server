import mongoose from "mongoose";

export enum RequestCategory {
    DISEASE_DETECTION = "disease_detection",
    CROP_ADVICE = "crop_advice",
    CHAT_WITH_AI = "chat_with_ai",
    OTHER = "other",
}

export enum AiRequestStatus {
    SUCCESS = "success",
    FAILED = "failed",
}

export interface IAiRequest {
    _id?: mongoose.Schema.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    user_prompt: string;
    ai_response: string;
    category: RequestCategory;
    request_tokens: number;
    response_tokens: number;
    total_tokens: number;
    status: AiRequestStatus;
    error_message?: string;
    model_used: string;
    image_url?: string;
    location?: {
        district: string;
        division: string;
    }

    is_helpful?: boolean;
    rating?: number;
    feedback_text?: string;
    ip_address: string;
    createdAt?: Date;
    updatedAt?: Date;
}
