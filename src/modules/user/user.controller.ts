import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import tryCatchAsync from "@/utils/tryCatchAsync";
import appError from "@/errorHelper/appError";

const createUser = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const result = await userService.createUser(body)
    
    if (!result) {
        throw new appError("user not created", httpStatus.BAD_REQUEST)
    }
    
    res.status(httpStatus.CREATED).json({
        success: true,
        message: "user create successfully",
        data: result
    })
})

const getAllUser = tryCatchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUser()
    
    res.status(httpStatus.OK).json({
        success: true,
        message: "user get successfully",
        data: result
    })
})

const getSingleUser = tryCatchAsync(async (req: Request, res: Response) => {
    const {id} = req.params
    const result = await userService.getSingleUser(id as string)
    if(!result) {
        throw new appError("user not found", httpStatus.NOT_FOUND)
    }
    
    res.status(httpStatus.OK).json({
        success: true,
        message: "user get successfully",
        data: result
    })
})

export const userController = {
    createUser,
    getAllUser,
    getSingleUser
}