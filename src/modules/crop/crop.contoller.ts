import { asyncHandler } from "../../utils/asyncHandler";
import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GAN_AI_API_KEY!);

export const getCropDataInAi = asyncHandler(async (req: Request, res: Response) => {
    const { location, season, soil } = req.body;
    console.log(location, season, soil)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
Tumi ekjon Bangladesh er krishi poramorshok/scientist.

Location: ${location}
Season: ${season}
Soil: ${soil}

response like this: 
1:Crop name Bangla: (Short, simple Bangla te 4-5 ta crop suggestion dao.)
1:Crop name English: base on crop name bangla and i was search in this english name in google and find this crop real image.
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


    res.status(200).json({
        success: true,
        data: text
    });
});

