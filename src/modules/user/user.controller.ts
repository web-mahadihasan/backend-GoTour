import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import tryCatchAsync from "@/utils/tryCatchAsync";
import AppError from "@/errorHelper/appError";
import SendResponse from "@/utils/sendResponse";

const createUser = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const result = await userService.createUser(body)
    
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

const getAllUser = tryCatchAsync(async (_req: Request, res: Response) => {
    const data = await userService.getAllUser()
    
    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "All users retrieve successfully",
        data: data.users,
        meta: {
            total: data.total
        }            
    })
})

const getSingleUser = tryCatchAsync(async (req: Request, res: Response) => {
    const {id} = req.params
    const result = await userService.getSingleUser(id as string)
    if(!result) {
        throw new AppError("user not found", httpStatus.NOT_FOUND)
    }
    
    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "user retrieve successfully",
        data: result
    })
})

export const userController = {
    createUser,
    getAllUser,
    getSingleUser
}