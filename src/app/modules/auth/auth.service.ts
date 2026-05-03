import AppError from "@/app/errorHelper/appError";
import { USER_STATUS, type TChangePassword, type TCreateUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes"
import createUserTokens from "@/app/utils/createUserTokens";
import { verifyToken } from "@/app/utils/jwt";
import config from "@/app/config/environment";
import type { JwtPayload } from "jsonwebtoken";

const credentialsLogin = async (payload: Partial<TCreateUser>) => {
    const {email, password} = payload || {}
    
    const isUserExist = await User.findOne({email})

    if(!isUserExist) {
        throw new AppError("User not found", httpStatus.NOT_FOUND)
    }
    // If no password is provided in payload
    if (!password) {
        throw new AppError("Password is required", httpStatus.BAD_REQUEST)
    }

    // Call the instance method directly on the returned mongoose document
    const isPasswordMatched = await isUserExist.comparePassword(password)

    if (!isPasswordMatched) {
        throw new AppError("Invalid credentials", httpStatus.UNAUTHORIZED)
    }
    const userDoc = isUserExist.toObject()
    // const { password: _, ...userWithoutPassword } = userDoc
    
    const jwtPayload = {
        _id: userDoc._id,
        email: userDoc.email,
        role: userDoc.role,
        name: userDoc.fullName
    }

    const {accessToken, refreshToken} = createUserTokens(jwtPayload)

    // Return the sanitized user (or JWT token)
    return {token: {accessToken, refreshToken}, user: jwtPayload}
}

const refreshToken = async (token: string) => {
    
    const decodedToken = verifyToken(token, config.JWT_REFRESH_SECRET) as JwtPayload

    if(!decodedToken) {
        throw new AppError("Invalid refresh token", httpStatus.UNAUTHORIZED)
    }

    const user = await User.findById(decodedToken._id)
    if(!user) {
        throw new AppError("User not found", httpStatus.NOT_FOUND)
    }

    if(user.isDeleted || user.isActive === USER_STATUS.BLOCKED || user.isActive === USER_STATUS.INACTIVE) {
        throw new AppError("User is not active", httpStatus.UNAUTHORIZED)
    }

    const userDoc = user.toObject()
    const jwtPayload = {
        _id: userDoc._id,
        email: userDoc.email,
        role: userDoc.role,
        name: userDoc.fullName
    }
    const {accessToken, refreshToken} = createUserTokens(jwtPayload)
    return {token: {accessToken, refreshToken}, user: jwtPayload}
}

const resetPassword = async (id: string, payload: TChangePassword) => {
    const user = await User.findById(id)
    if (!user) {
        throw new AppError("User not found", httpStatus.NOT_FOUND)
    }

    const isPasswordMatch = await user.comparePassword(payload.oldPassword)
    if (!isPasswordMatch) {
        throw new AppError("Old password is incorrect", httpStatus.BAD_REQUEST)
    }

    user.password = payload.newPassword
    await user.save()

    return { message: "Password changed successfully" }
}

export const authService = {
    credentialsLogin,
    refreshToken,
    resetPassword
}