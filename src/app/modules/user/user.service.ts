import httpStatus from 'http-status-codes';
import { USER_ROLES, type TUpdateUser } from "./user.interface"
import User from "./user.model"
import AppError from '@/app/errorHelper/appError';
import type { JwtPayload } from 'jsonwebtoken';

const getAllUser = async () => {
    const users = await User.find()
    const total = await User.countDocuments()

    return {users, total}
}

const getSingleUser = async(id: string) => {
    const user = await User.findById(id)
    return user
}

const updateSingleUser = async (id: string, payload: Partial<TUpdateUser>, user: JwtPayload) => {
    
    // Authorization: Only user themselves or Admins can update
    if (!user || (user.userId !== id && user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.SUPER_ADMIN)) {
        throw new AppError("You are not authorized to update this user", httpStatus.UNAUTHORIZED)
    }  
    // Role update restrictions
    if (payload.role && user.role !== USER_ROLES.ADMIN && user.role !== USER_ROLES.SUPER_ADMIN) {
        throw new AppError("You are not authorized to change roles", httpStatus.UNAUTHORIZED)
    }
    
    if (payload.role === USER_ROLES.ADMIN && user.role !== USER_ROLES.SUPER_ADMIN) {
        throw new AppError("Only Super Admins can assign Admin role", httpStatus.UNAUTHORIZED)
    }

    const isUserExist = await User.findById(id)
    if (!isUserExist) {
        throw new AppError("User not found", httpStatus.NOT_FOUND)
    }

    Object.assign(isUserExist, payload)

    const updatedUser = await isUserExist.save()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = updatedUser.toObject()
    return userWithoutPassword
}

export const userService = {
    getAllUser,
    getSingleUser,
    updateSingleUser
}