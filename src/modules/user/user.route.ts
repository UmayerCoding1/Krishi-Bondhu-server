import { Router } from "express";
import { userControllers } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { verifyRole } from "../../middlewares/verifyRole";
import { ROLE } from "../user/user.interface";
import { Uploader } from "../../utils/uploader";

const userRouter = Router();

userRouter.get("/", authMiddleware, verifyRole(ROLE.ADMIN), userControllers.getAllUsers);
userRouter.patch('/me/avatar', authMiddleware, Uploader.single('avatar'), userControllers.updateUserAvatar);

export default userRouter;