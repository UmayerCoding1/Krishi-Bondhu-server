"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crop_contoller_1 = require("./crop.contoller");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const cropRouter = (0, express_1.Router)();
cropRouter.post("/", authMiddleware_1.authMiddleware, crop_contoller_1.getCropDataInAi);
exports.default = cropRouter;
