import { Router } from "express";
import { getCropDataInAi } from "./crop.contoller";

const cropRouter = Router();

cropRouter.post("/", getCropDataInAi);

export default cropRouter;
