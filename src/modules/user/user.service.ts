import httpStatus from 'http-status-codes';
import type { TCreateUser } from "./user.interface"
import User from "./user.model"
import AppError from '@/errorHelper/appError';

const createUser = async (payload: Partial<TCreateUser>) => {
    const isUserExist = await User.findOne({ email: payload.email })

    if (isUserExist) {
        throw new AppError("User already exist", httpStatus.BAD_REQUEST)
    }
    const authProviders = [{ provider: "credentials", providerId: payload.email }]

    // User.create() calls new User(doc).save() internally,
    // which automatically triggers the pre('save') hook to hash the password.
    const user = await User.create({ ...payload, authProviders })
    return user
}

const getAllUser = async () => {
    const users = await User.find()
    const total = await User.countDocuments()

    return {users, total}
}

const getSingleUser = async(id: string) => {
    const user = await User.findById(id)
    return user
}

export const userService = {
    createUser,
    getAllUser,
    getSingleUser
}