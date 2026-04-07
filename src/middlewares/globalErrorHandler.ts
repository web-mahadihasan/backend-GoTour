import config from "@/config/environment";
import appError from "@/errorHelper/appError";
import type { NextFunction, Request, Response } from "express";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let message = 'Something went wrong!!'

    if(err instanceof appError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err?.name === "CastError") {
        statusCode = 400
        message = "Invalid ID!"
    } else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: err,
        stack: config.isDevelopment ? err.stack : null
    })
}

export default globalErrorHandler