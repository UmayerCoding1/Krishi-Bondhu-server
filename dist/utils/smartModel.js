"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmartModels = void 0;
const getSmartModels = (message) => {
    if (message.length < 50) {
        return [
            'openai/gpt-oss-120b:free',
            "google/gemma-4-31b-it:free",
        ];
    }
    return [
        'openai/gpt-oss-120b:free',
        "google/gemma-4-31b-it:free",
    ];
};
exports.getSmartModels = getSmartModels;
