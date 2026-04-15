"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const db_1 = require("./config/db");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const crop_route_1 = __importDefault(require("./modules/crop/crop.route"));
const chat_route_1 = __importDefault(require("./modules/chat/chat.route"));
const disease_route_1 = __importDefault(require("./modules/disease/disease.route"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://krishi-bondhu-bd.vercel.app"],
    credentials: true,
}));
(0, db_1.connectDB)();
app.get("/", (req, res) => {
    res.send("Hello from TypeScript + Express 🚀 ");
});
app.use('/api/v1/auth', auth_route_1.default);
app.use('/api/v1/users', user_route_1.default);
app.use('/api/v1/crop', crop_route_1.default);
app.use('/api/v1/chat', chat_route_1.default);
app.use('/api/v1/disease', disease_route_1.default);
app.use(error_middleware_1.globalErrorHandle);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
