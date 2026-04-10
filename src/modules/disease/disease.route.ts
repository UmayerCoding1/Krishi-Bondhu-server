import { Router } from "express";
import { diseaseController } from "./disease.controller";


const diseaseDetectionRouter = Router();

diseaseDetectionRouter.post("/", diseaseController.diseaseDetection);

export default diseaseDetectionRouter;