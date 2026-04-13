"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const disease_controller_1 = require("./disease.controller");
const uploader_1 = require("../../utils/uploader");
const rateLimit_middleware_1 = require("../../middlewares/rateLimit.middleware");
const diseaseDetectionRouter = (0, express_1.Router)();
diseaseDetectionRouter.post("/detect", rateLimit_middleware_1.diseaseLimiter, uploader_1.Uploader.single('disease_crop'), disease_controller_1.diseaseController.diseaseDetection);
exports.default = diseaseDetectionRouter;
