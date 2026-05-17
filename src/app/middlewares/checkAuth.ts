import config from "@/app/config/environment"
import AppError from "@/app/errorHelper/appError"
import jwt, { type JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status-codes"
import type { NextFunction, Request, Response } from "express"

const checkAuth = (...authRoles: string[]) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.accessToken
        if (!token) {
            throw new AppError("Unauthorized access", httpStatus.UNAUTHORIZED)
        }
        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload

        if(!authRoles.includes(decoded.role)) {
            throw new AppError("Unauthorized access", httpStatus.UNAUTHORIZED)
        }
        
        req.user = decoded as Express.User
        next()
    } catch (error) {
        next(error)
    }
}

export default checkAuth;