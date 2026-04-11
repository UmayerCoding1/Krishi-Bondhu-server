import { Router } from "express";
import { diseaseController } from "./disease.controller";
import { Uploader } from "../../utils/uploader";
import { diseaseLimiter } from "../../middlewares/rateLimit.middleware";


const diseaseDetectionRouter = Router();

diseaseDetectionRouter.post("/detect", diseaseLimiter, Uploader.single('disease_crop'), diseaseController.diseaseDetection);

export default diseaseDetectionRouter;