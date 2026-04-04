import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { globalErrorHandle } from "./middlewares/error.middleware";
import authRoute from "./modules/auth/auth.route";
import { connectDB } from "./config/db";
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from TypeScript + Express 🚀");
});


app.use('/api/v1/auth', authRoute);





app.use(globalErrorHandle)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});