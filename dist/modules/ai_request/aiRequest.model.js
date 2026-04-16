"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRequest = void 0;
const mongoose_1 = require("mongoose");
const aiRequest_interface_1 = require("./aiRequest.interface");
const aiRequestSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        enum: aiRequest_interface_1.RequestCategory,
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
        enum: aiRequest_interface_1.AiRequestStatus,
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
exports.AiRequest = mongoose_1.models.AiRequest || (0, mongoose_1.model)("AiRequest", aiRequestSchema);
