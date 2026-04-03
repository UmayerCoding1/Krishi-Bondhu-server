import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const authRoute = Router();

authRoute.post("/register", validateRequest(authValidation.registerSchema), authController.register);

export default authRoute;