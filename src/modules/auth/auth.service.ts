import AppError from "@/errorHelper/appError";
import type { TCreateUser } from "../user/user.interface";
import User from "../user/user.model";
import httpStatus from "http-status-codes"
import { generateToken } from "@/utils/jwt";

const credentialsLogin = async (payload: Partial<TCreateUser>) => {
    const {email, password} = payload
    
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
    
    const jwtPayload = {
        _id: userDoc._id,
        email: userDoc.email,
        role: userDoc.role
    }

    const token = generateToken(jwtPayload)

    // To return the user without the password, convert the Mongoose doc to a plain JS object first
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const { password: _, ...userWithoutPassword } = userDoc

    // Return the sanitized user (or JWT token)
    return {accessToken: token}
}

export const authService = {
    credentialsLogin
}