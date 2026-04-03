import express, { Request, Response } from "express";
import { globalErrorHandle } from "./middlewares/error.middleware";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello from TypeScript + Express 🚀");
});








app.use(globalErrorHandle)


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});