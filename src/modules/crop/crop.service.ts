import { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiRequestStatus, RequestCategory } from "../ai_request/aiRequest.interface";
import { AiRequest } from "../ai_request/aiRequest.model";
import axios from "axios";
const genAI = new GoogleGenerativeAI(process.env.GAN_AI_API_KEY!);

export const cropService = {
    getCropDataOnAi: async (req: Request, res: Response) => {
        const { location, season, soil, userId } = req.body;
        console.log(location)
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

        const fallbackCrops = [
            {
                "Crop name Bangla": "ধান",
                "Explanation": "বাংলাদেশের বেশিরভাগ মাটির জন্য উপযোগী",
                "Expected profit": "মাঝারি লাভ",
                "rating": 9
            },
            {
                "Crop name Bangla": "পাট",
                "Explanation": "আর্দ্র মাটিতে ভালো হয়",
                "Expected profit": "উচ্চ লাভ",
                "rating": 8
            }
        ];

        try {
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
                    .trim()

                const dataArray = JSON.parse(cleanString);
                console.log('dataArray', dataArray)

                if (dataArray.error) {
                    const aiRequest = new AiRequest({
                        user: req._id,
                        user_prompt: JSON.stringify({
                            location: location,
                            season: season,
                            soil: soil
                        }),
                        ai_response: text,
                        category: RequestCategory.CROP_ADVICE,
                        tokenUsage,
                        status: AiRequestStatus.FAILED,
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
                    })
                }


                const cropsWithImages = await Promise.all(
                    dataArray.map(async (crop: any) => {
                        try {

                            const pexelsRes = await axios.get(
                                "https://api.pexels.com/v1/search",
                                {
                                    params: {
                                        query: crop['Crop name Bangla'],
                                        per_page: 1
                                    },
                                    headers: {
                                        Authorization: process.env.PEXELS_API_KEY
                                    }
                                }
                            );

                            const imageUrl = pexelsRes.data.photos[0]?.src?.original
                            return { ...crop, image: imageUrl }
                        } catch (error) {
                            console.error('Error fetching image for', crop['Crop name'], error)
                            return { ...crop, image: '' }
                        }
                    })
                )

                const maxRating = Math.max(...cropsWithImages.map((c: any) => c.Rating))
                const bestCrop = cropsWithImages.find((c: any) => c.Rating === maxRating);

                const aiRequest = new AiRequest({
                    user: req._id,
                    user_prompt: prompt,
                    ai_response: text,
                    category: RequestCategory.CROP_ADVICE,
                    tokenUsage,
                    status: AiRequestStatus.SUCCESS,
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

            if (!text) {
                const aiRequest = new AiRequest({
                    user: req._id,
                    user_prompt: prompt,
                    ai_response: text,
                    category: RequestCategory.CROP_ADVICE,
                    tokenUsage,
                    status: AiRequestStatus.FAILED,
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
                console.log('no text')

                await aiRequest.save();


                return res.status(200).json({
                    success: true,
                    data: {
                        cropsWithImages: fallbackCrops,
                        bestCrop: fallbackCrops[0],
                        requestId: aiRequest._id
                    }
                });
            }
        } catch (error) {
            const aiRequest = new AiRequest({
                user: req._id,
                user_prompt: prompt,
                ai_response: "",
                category: RequestCategory.CROP_ADVICE,
                tokenUsage: 0,
                status: AiRequestStatus.FAILED,
                model_used: "gemini-2.5-flash",
                request_tokens: 0,
                response_tokens: 0,
                total_tokens: 0,
                ip_address: req.ip,

                // location: {
                //     district: location.district,
                //     division: location.division,
                // },
            });
            await aiRequest.save();
            console.log('weeoer')

            return res.status(200).json({
                success: true,
                data: {
                    cropsWithImages: fallbackCrops,
                    bestCrop: fallbackCrops[0]
                }
            });
        }






    }
}