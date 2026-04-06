import { Router } from "express";
import { getCropDataInAi } from "./crop.contoller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const cropRouter = Router();

cropRouter.post("/", authMiddleware, getCropDataInAi);

export default cropRouter;
