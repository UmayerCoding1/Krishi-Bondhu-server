import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authMiddleware } from "../../middlewares/authMiddleware";


const authRoute = Router();

authRoute.post("/register", validateRequest(authValidation.registerSchema), authController.register);
authRoute.post("/verify", validateRequest(authValidation.verifySchema), authController.verifyUser);
authRoute.post("/login", validateRequest(authValidation.loginSchema), authController.login);
authRoute.post("/logout", authMiddleware, authController.logout);
authRoute.get("/me", authMiddleware, authController.getCurrentUser);


export default authRoute;