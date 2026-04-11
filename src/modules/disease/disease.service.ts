import { Request } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GAN_AI_API_KEY as string);
console.log(process.env.GAN_AI_API_KEY);

function fileToGenerativePart(file: Express.Multer.File) {
    return {
        inlineData: {
            data: file.buffer.toString("base64"),
            mimeType: "image/jpeg",
        },
    };
}

export const diseaseServices = {
    diseaseDetection: async (req: Request) => {
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

        } catch (error: any) {
            console.error("Gemini Error:", error);

            throw new Error("Disease detection failed");
        }
    },
};