import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions)
}

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret) as JwtPayload
}