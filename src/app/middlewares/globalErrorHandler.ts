/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from "@/app/config/environment";
import AppError from "@/app/errorHelper/appError";
import type { NextFunction, Request, Response } from "express";
import { ValiError } from "valibot";
import type { TErrorSources } from "../interfaces/error.types";
import valibotErrorHandler from "../helper/valibotErrorHandler";
import handleCastError from "../helper/handleCastError";
import handleDuplicateError from "../helper/handleDuplicateError";
import handleValidationError from "../helper/handleValidationError";


const GlobalErrorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
    let statusCode = 500;
    let message = 'Something went wrong!!'
    let errorSources: TErrorSources[] = error;

    if (error instanceof ValiError) {
        statusCode = 400
        const {message: valibotMessage, formattedErrors} = valibotErrorHandler(error)

        message = valibotMessage
        errorSources = formattedErrors

    } else if (error?.code === 11000) {
        const duplicateError = handleDuplicateError(error)

        statusCode = duplicateError.statusCode
        message = duplicateError.message
        errorSources = duplicateError.errorSources as TErrorSources[]

    } else if (error?.name === "CastError") {
        const castError = handleCastError(error)

        statusCode = castError.statusCode
        message = castError.message

    } else if (error.name === "ValidationError") {
        const validationError = handleValidationError(error)

        statusCode = validationError.statusCode || 400
        message = validationError.message
        errorSources = validationError.errorSources as TErrorSources[]


    } else if (error instanceof AppError) {
        statusCode = error.statusCode
        message = error.message

    } else if (error instanceof Error) {
        statusCode = 500
        message = error.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        error: errorSources,
        stack: config.IS_DEVELOPMENT ? error.stack : null
    })
}

export default GlobalErrorHandler