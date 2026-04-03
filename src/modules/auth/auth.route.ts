import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { ApiResponse } from "../../utils/ApiResponse";
import { authLimiter } from "../../middlewares/rateLimit.middleware";

const authRoute = Router();

authRoute.post("/register", validateRequest(authValidation.registerSchema), authController.register);
authRoute.post("/verify", validateRequest(authValidation.verifySchema), authController.verifyUser);


export default authRoute;