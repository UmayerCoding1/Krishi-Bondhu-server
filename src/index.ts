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
import userRouter from "./modules/user/user.route";
import https from 'https';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "https://krishi-bondhu-bd.vercel.app"],
    credentials: true,
}));

setInterval(() => {
    https.get('https://krishi-bondhu-server1.onrender.com/', (res) => {
        console.log('Ping status:', res.statusCode);
    }).on('error', (err) => {
        console.log('Ping error:', err.message);
    })
}, 1000 * 60 * 10); // 10 minutes


connectDB();


app.get("/", (req: Request, res: Response) => {
    res.send("Hello from TypeScript + Express 🚀 ");
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/crop', cropRouter);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/disease', diseaseDetectionRouter);


app.use(globalErrorHandle);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});