"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCropDataInAi = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const crop_service_1 = require("./crop.service");
exports.getCropDataInAi = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await crop_service_1.cropService.getCropDataOnAi(req, res);
});
