import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import { globalErrorHandle } from "./middlewares/error.middleware";
import authRoute from "./modules/auth/auth.route";
import { connectDB } from "./config/db";

const app = express();
const PORT = 8000;

app.use(express.json());

connectDB();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from TypeScript + Express 🚀");
});


app.use('/api/v1', authRoute);





app.use(globalErrorHandle)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});