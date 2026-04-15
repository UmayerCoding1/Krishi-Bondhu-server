import { Router } from "express";
import { userControllers } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { verifyRole } from "../../middlewares/verifyRole";
import { ROLE } from "../user/user.interface";

const userRouter = Router();

userRouter.get("/", authMiddleware, verifyRole(ROLE.ADMIN), userControllers.getAllUsers);

export default userRouter;