import config from "@/app/config/environment";
import AppError from "@/app/errorHelper/appError";
import createUserTokens from "@/app/utils/createUserTokens";
import SendResponse from "@/app/utils/sendResponse";
import setAuthCookie from "@/app/utils/setAuthCookie";
import tryCatchAsync from "@/app/utils/tryCatchAsync";
import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import type { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { authService } from "./auth.service";

const credentialsLogin = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const data = await authService.credentialsLogin(body)

    if(!data.token.refreshToken || !data.token.accessToken) {
        throw new AppError("Login failed! please try again", httpStatus.BAD_REQUEST)
    }
    
    // Set cookie in browser
    setAuthCookie(res, data.token.accessToken, data.token.refreshToken)
    
    // throw new AppError("Login failed! please try again", httpStatus.BAD_REQUEST)
    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "user login successfully",
        data: data
    })

})

const refreshToken = tryCatchAsync(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken as string

    const newToken = await authService.refreshToken(token)
    
    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "token refreshed successfully",
        data: newToken
    })
})

const resetPassword = tryCatchAsync(async (req: Request, res: Response) => {
    const user = req.user
    const body = req.body

    if (!user) {
        throw new AppError("You are not authorized", httpStatus.UNAUTHORIZED)
    }

    const result = await authService.resetPassword(user._id, body)

    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: `${result.message}`,
        data: null
    })
})

const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {scope: ["profile", "email"]})(req, res, next)
}

const googleLoginCallback = async (req: Request, res: Response) => {
    const user = req.user as Express.User
    
    if(!user) {
        throw new AppError("User not found", httpStatus.NOT_FOUND)
    }

    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.fullName
    }

    const {accessToken, refreshToken} = createUserTokens(jwtPayload as JwtPayload)

    setAuthCookie(res, accessToken, refreshToken)
    
    res.redirect(`${config.FRONTEND_URL}`)
    
}

export const authController = {
    credentialsLogin,
    refreshToken,
    resetPassword,
    googleLogin,
    googleLoginCallback
}