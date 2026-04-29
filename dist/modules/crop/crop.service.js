"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cropService = void 0;
const generative_ai_1 = require("@google/generative-ai");
const aiRequest_interface_1 = require("../ai_request/aiRequest.interface");
const aiRequest_model_1 = require("../ai_request/aiRequest.model");
const axios_1 = __importDefault(require("axios"));
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GAN_AI_API_KEY);
exports.cropService = {
    getCropDataOnAi: async (req, res) => {
        const { location, season, soil, userId } = req.body;
        console.log(location);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
        Frist check this location is valid for Bangladesh or not..
        if not valid for Bangladesh then return error message.  like this : {"error":"This location is not valid for Bangladesh"}.
        if valid for Bangladesh then return crop suggestions.

Tumi ekjon Bangladesh er krishi poramorshok/scientist.
Return ONLY valid JSON. No markdown, no explanation.

Format:
[
 {
  "Crop name Bangla": "",
  "Explanation": "",
  "Expected profit": "",
  "rating": number
 }
]



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
        const usageMetadata = response.usageMetadata;
        const tokenUsage = {
            request_tokens: usageMetadata?.promptTokenCount ?? 0,
            response_tokens: usageMetadata?.candidatesTokenCount ?? 0,
            total_tokens: usageMetadata?.totalTokenCount ?? 0,
        };
        if (text) {
            const cleanString = text
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .trim();
            const dataArray = JSON.parse(cleanString);
            console.log('dataArray', dataArray);
            if (dataArray.error) {
                const aiRequest = new aiRequest_model_1.AiRequest({
                    user: req._id,
                    user_prompt: JSON.stringify({
                        location: location,
                        season: season,
                        soil: soil
                    }),
                    ai_response: text,
                    category: aiRequest_interface_1.RequestCategory.CROP_ADVICE,
                    tokenUsage,
                    status: aiRequest_interface_1.AiRequestStatus.FAILED,
                    model_used: "gemini-2.5-flash",
                    request_tokens: tokenUsage.request_tokens,
                    response_tokens: tokenUsage.response_tokens,
                    total_tokens: tokenUsage.total_tokens,
                    ip_address: req.ip,
                    // location: {
                    //     district: location.district,
                    //     division: location.division,
                    // },
                });
                await aiRequest.save();
                return res.status(400).json({
                    success: false,
                    message: dataArray.error
                });
            }
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
            const aiRequest = new aiRequest_model_1.AiRequest({
                user: req._id,
                user_prompt: prompt,
                ai_response: text,
                category: aiRequest_interface_1.RequestCategory.CROP_ADVICE,
                tokenUsage,
                status: aiRequest_interface_1.AiRequestStatus.SUCCESS,
                model_used: "gemini-2.5-flash",
                request_tokens: tokenUsage.request_tokens,
                response_tokens: tokenUsage.response_tokens,
                total_tokens: tokenUsage.total_tokens,
                ip_address: req.ip,
                // location: {
                //     district: location.district,
                //     division: location.division,
                // },
            });
            await aiRequest.save();
            return res.status(200).json({
                success: true,
                data: {
                    cropsWithImages,
                    bestCrop,
                    requestId: aiRequest._id
                }
            });
        }
        const aiRequest = new aiRequest_model_1.AiRequest({
            user: req._id,
            user_prompt: prompt,
            ai_response: text,
            category: aiRequest_interface_1.RequestCategory.CROP_ADVICE,
            tokenUsage,
            status: aiRequest_interface_1.AiRequestStatus.FAILED,
            model_used: "gemini-2.5-flash",
            request_tokens: tokenUsage.request_tokens,
            response_tokens: tokenUsage.response_tokens,
            total_tokens: tokenUsage.total_tokens,
            ip_address: req.ip,
            // location: {
            //     district: location.district,
            //     division: location.division,
            // },
        });
        await aiRequest.save();
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
};
