
import jwt from 'jsonwebtoken';



export const generateToken = async (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const generateAccessToken = async (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "5h" });
};


export const generateRefreshToken = async (payload: any) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = async (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
};