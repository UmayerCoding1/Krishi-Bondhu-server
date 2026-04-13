"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diseaseServices = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GAN_AI_API_KEY);
console.log(process.env.GAN_AI_API_KEY);
function fileToGenerativePart(file) {
    return {
        inlineData: {
            data: file.buffer.toString("base64"),
            mimeType: "image/jpeg",
        },
    };
}
exports.diseaseServices = {
    diseaseDetection: async (req) => {
        const file = req.file;
        if (!file) {
            throw new Error("File is required");
        }
        try {
            const model = genAI.getGenerativeModel({
                // model: "gemini-1.5-flash",
                model: 'gemini-2.5-flash'
                // model: "gemini-1.5-flash-001",
            });
            const imagePart = fileToGenerativePart(file);
            const result = await model.generateContent([
                {
                    text: `
                    Analyze this plant leaf image carefully.

                    1. Detect if there is any disease
                    2. If yes, give the disease name
                    3. Provide a short explanation
                    4. Suggest a simple solution

                    response like this: 
                    {
                        "disease": "disease name",                        
                        "solution":{
                            "chemical": "chemical solution",
                            "organic": "organic solution"
                        },
                        "Accuracy": "1-100"
                    } 
                    Keep answer in Bangla language short and clear.
                    `,
                },
                imagePart,
            ]);
            const response = await result.response;
            return {
                success: true,
                data: response.text(),
                message: 'Disease detection successful'
            };
        }
        catch (error) {
            console.error("Gemini Error:", error);
            throw new Error("Disease detection failed");
        }
    },
};
