"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validateRequest_1 = require("../../middlewares/validateRequest");
const auth_validation_1 = require("./auth.validation");
const authMiddleware_1 = require("../../middlewares/authMiddleware");
const user_model_1 = require("../user/user.model");
const authRoute = (0, express_1.Router)();
authRoute.post("/register", (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.registerSchema), auth_controller_1.authController.register);
authRoute.post("/verify", (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.verifySchema), auth_controller_1.authController.verifyUser);
authRoute.post("/login", (0, validateRequest_1.validateRequest)(auth_validation_1.authValidation.loginSchema), auth_controller_1.authController.login);
authRoute.post("/logout", authMiddleware_1.authMiddleware, auth_controller_1.authController.logout);
authRoute.get("/me", authMiddleware_1.authMiddleware, auth_controller_1.authController.getCurrentUser);
authRoute.get('/users', async (req, res) => {
    try {
        const users = await user_model_1.User.find();
        res.json(users);
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = authRoute;
