import AppError from "@/app/errorHelper/appError";
import { USER_STATUS, type TChangePassword, type TCreateUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes"
import createUserTokens from "@/app/utils/createUserTokens";
import { verifyToken } from "@/app/utils/jwt";
import config from "@/app/config/environment";
import type { JwtPayload } from "jsonwebtoken";


const registerUser = async (payload: Partial<TCreateUser>) => {
    const isUserExist = await User.findOne({ email: payload.email })

    if (isUserExist) {
        throw new AppError("User already exist", httpStatus.BAD_REQUEST)
    }
    const authProviders = [{ provider: "credentials", providerId: payload.email }]

    // User.create() calls new User(doc).save() internally,
    // which automatically triggers the pre('save') hook to hash the password.
    const user = await User.create({ ...payload, authProviders })

    const userDoc = user.toObject()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = userDoc
    
    return userWithoutPassword
}

const credentialsLogin = async (payload: Express.User) => {
    const jwtPayload = {
        _id: payload._id,
        email: payload.email,
        role: payload.role,
        name: payload.fullName
    }

    const {accessToken, refreshToken} = createUserTokens(jwtPayload)

    // const {password, ...rest} = payload

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
    resetPassword,
    registerUser
}