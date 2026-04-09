"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crop = void 0;
const mongoose_1 = require("mongoose");
const cropSchema = new mongoose_1.Schema({
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
exports.Crop = mongoose_1.models.Crop || (0, mongoose_1.model)('Crop', cropSchema);
