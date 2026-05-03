import type { Response } from "express"

interface TMeta {
    page?: number
    limit?: number
    total?: number
}

export interface TSendResponse<T> {
    StatusCode: number
    success: boolean
    message: string
    data: T
    meta?: TMeta
}

const SendResponse = <T>(res: Response, data: TSendResponse<T>) => {
    res.status(data.StatusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        meta: data.meta,
    })
}

export default SendResponse;