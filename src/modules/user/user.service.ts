import type { TCreateUser } from "./user.interface"
import User from "./user.model"

const createUser = async (payload: Partial<TCreateUser>) => {
    const {name, email, phone} = payload 
    const user = await User.create({name, email, phone})
    return user   
}

const getAllUser = async() => {
    const users = await User.find()
    return users
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