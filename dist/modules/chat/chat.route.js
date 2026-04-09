"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const chatRoute = (0, express_1.Router)();
chatRoute.post('/', chat_controller_1.ChatController.sendMessage);
chatRoute.post('/stream', chat_controller_1.ChatController.streamAI);
exports.default = chatRoute;
