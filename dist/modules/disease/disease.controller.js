"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diseaseController = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const disease_service_1 = require("./disease.service");
exports.diseaseController = {
    diseaseDetection: (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const result = await disease_service_1.diseaseServices.diseaseDetection(req);
        res.status(result?.success ? 200 : 400).json({
            success: result?.success,
            message: result?.message,
            data: result?.data
        });
    })
};
