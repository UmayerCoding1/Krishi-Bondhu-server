
import jwt, { JwtPayload } from 'jsonwebtoken';

interface IJwtPayload extends JwtPayload {
    _id: string;
}

export const generateToken = async (payload: { _id: string, role: string }) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const generateAccessToken = async (payload: { _id: string, role: string }) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};


export const generateRefreshToken = async (payload: { _id: string, role: string }) => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export const verifyToken = async (token: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJwtPayload;
    console.log(decoded, "token decoded")
    return decoded;
};