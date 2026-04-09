"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCropDataInAi = void 0;
const asyncHandler_1 = require("../../utils/asyncHandler");
const generative_ai_1 = require("@google/generative-ai");
const axios_1 = __importDefault(require("axios"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GAN_AI_API_KEY);
exports.getCropDataInAi = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { location, season, soil } = req.body;
    console.log(location, season, soil);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
Tumi ekjon Bangladesh er krishi poramorshok/scientist.

Location: ${location}
Season: ${season}
Soil: ${soil}

response like this: 
1:Crop name Bangla: (Short, simple Bangla te 4-5 ta crop suggestion dao.)
2:Explination :(keno ai crop ta ai doroner matitir jono valo),
3:Expected propit: {bace on Bangladesh marker value}
4:rating: (1-10) {for best crop }
this response send a array of object an json format

Bullet point use koro.
Beshi kotha na.
`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    if (text) {
        const cleanString = text
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();
        const dataArray = JSON.parse(cleanString);
        const cropsWithImages = await Promise.all(dataArray.map(async (crop) => {
            try {
                const pexelsRes = await axios_1.default.get("https://api.pexels.com/v1/search", {
                    params: {
                        query: crop['Crop name Bangla'],
                        per_page: 1
                    },
                    headers: {
                        Authorization: process.env.PEXELS_API_KEY
                    }
                });
                console.log(pexelsRes);
                const imageUrl = pexelsRes.data.photos[0]?.src?.original;
                return { ...crop, image: imageUrl };
            }
            catch (error) {
                console.error('Error fetching image for', crop['Crop name'], error);
                return { ...crop, image: '' };
            }
        }));
        const maxRating = Math.max(...cropsWithImages.map((c) => c.Rating));
        const bestCrop = cropsWithImages.find((c) => c.Rating === maxRating);
        return res.status(200).json({
            success: true,
            data: {
                cropsWithImages,
                bestCrop
            }
        });
    }
    return res.status(500).json({
        success: false,
        message: "Something went wrong"
    });
});
