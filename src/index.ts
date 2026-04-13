import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { globalErrorHandle } from "./middlewares/error.middleware";
import authRoute from "./modules/auth/auth.route";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from 'cors';
import cropRouter from "./modules/crop/crop.route";
import chatRoute from "./modules/chat/chat.route";
import diseaseDetectionRouter from "./modules/disease/disease.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://krishi-bondhu-bd.vercel.app"],
    credentials: true,
}));

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from TypeScript + Express 🚀");
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/crop', cropRouter);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/disease', diseaseDetectionRouter);

app.use(globalErrorHandle);

export default app;


// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });