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

const registerUser = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const result = await authService.registerUser(body)
    
    if (!result) {
        throw new AppError("user not created", httpStatus.BAD_REQUEST)
    }
    
    SendResponse(res, {
        StatusCode: httpStatus.CREATED,
        success: true,
        message: "user create successfully",
        data: result
    })

})

const credentialsLogin = tryCatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
    passport.authenticate("local", async (err: Error | null, user: Express.User | false | undefined, info: {message: string}) => {
        
        if (err) return next(new AppError(err.message, httpStatus.BAD_REQUEST))
        if (!user) return next(new AppError(info.message, httpStatus.UNAUTHORIZED))
        
        const data = await authService.credentialsLogin(user.toObject())

        setAuthCookie(res, data.token.accessToken, data.token.refreshToken)

        SendResponse(res, {
            StatusCode: httpStatus.OK,
            success: true,
            message: "Login successful",
            data: data.user
        })
    })(req, res, next)

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
    const redirectUrl = req.query.redirect as string || "/"
    passport.authenticate("google", {scope: ["profile", "email"], state: redirectUrl})(req, res, next)
}

const googleLoginCallback = async (req: Request, res: Response) => {
    const user = req.user as Express.User
    let redirectTo = req.query.state as string || "/"

    if(redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    
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
    
    res.redirect(`${config.FRONTEND_URL}/${redirectTo}`)
    
}

const userLogout = async (_req: Request, res: Response) => {
    // res.clearCookie("accessToken", {
    //     httpOnly: true,
    //     secure: config.IS_PRODUCTION,
    //     sameSite: "strict",
    //     maxAge: 24 * 60 * 60 * 1000
    // })

    res.clearCookie("accessToken")
    res.clearCookie("refreshToken")

    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "User Logout successful",
        data: null
    })
}

export const authController = {
    credentialsLogin,
    refreshToken,
    resetPassword,
    googleLogin,
    googleLoginCallback,
    userLogout,
    registerUser
}