import SendResponse from "@/utils/sendResponse";
import tryCatchAsync from "@/utils/tryCatchAsync";
import type { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { authService } from "./auth.service";

const credentialsLogin = tryCatchAsync(async (req: Request, res: Response) => {
    const body = req.body
    const token = await authService.credentialsLogin(body)
    
    SendResponse(res, {
        StatusCode: httpStatus.OK,
        success: true,
        message: "user login successfully",
        data: token
    })

})

export const authController = {
    credentialsLogin
}