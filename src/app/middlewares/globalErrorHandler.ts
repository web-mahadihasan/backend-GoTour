/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/app/config/environment";
import AppError from "@/app/errorHelper/appError";
import type { NextFunction, Request, Response } from "express";
import { ValiError, getDotPath } from "valibot";

const GlobalErrorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = 'Something went wrong!!'
    let err: any = error;

    if (err instanceof ValiError) {
        statusCode = 400
        // Use the first issue's message as the top-level message
        message = err.issues[0]?.message ?? 'Validation error'

        const formattedErrors = err.issues.map((issue) => ({
            field: getDotPath(issue) ?? 'unknown',
            message: issue.message,
        }))

        err = formattedErrors
    }

    if (err instanceof AppError) {
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
        stack: config.IS_DEVELOPMENT ? err.stack : null
    })
}

export default GlobalErrorHandler