import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { userService } from "./user.service";
import tryCatchAsync from "@/app/utils/tryCatchAsync";
import AppError from "@/app/errorHelper/appError";
import SendResponse from "@/app/utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

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

const updateSingleUser = tryCatchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const body = req.body
    const user = req.user

    const result = await userService.updateSingleUser(id as string, body, user as JwtPayload)

    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "User updated successfully",
        data: result
    })
})



export const userController = {
    createUser,
    getAllUser,
    getSingleUser,
    updateSingleUser,
}