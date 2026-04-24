import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { User } from "../user/user.model";


const authRoute = Router();

authRoute.post("/register", validateRequest(authValidation.registerSchema), authController.register);
authRoute.post("/verify", validateRequest(authValidation.verifySchema), authController.verifyUser);
authRoute.post("/login", validateRequest(authValidation.loginSchema), authController.login);
authRoute.post("/resend-otp", authController.resendOTP);
authRoute.patch("/change-password", authMiddleware, validateRequest(authValidation.changePasswordSchema), authController.changePassword);
authRoute.post("/logout", authMiddleware, authController.logout);
authRoute.get("/me", authMiddleware, authController.getCurrentUser);
authRoute.patch("/toggle-two-factor", authMiddleware, authController.toggleTwoFactor);
authRoute.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error)
    }
})


export default authRoute;