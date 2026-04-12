import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import config from "@/config/environment";

export const generateToken = (payload: JwtPayload) => {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET, { expiresIn: config.JWT_ACCESS_EXPIRES } as SignOptions)
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload
}