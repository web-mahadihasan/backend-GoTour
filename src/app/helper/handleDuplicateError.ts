import type { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"

interface TDuplicateError {
    message: string;
    keyValue?: Record<string, string>;
}

const handleDuplicateError = (error: TDuplicateError): TGenericErrorResponse => {
    const match = error.message.match(/"([^"]*)"/)
    
    const statusCode = 400
    const message = `Duplicate key error. ${match ? match[1] : 'Unknown'} already exists`

    const errorSources: TErrorSources[] = [
        {
            path: error.keyValue ? Object.keys(error.keyValue)[0] : '',
            message: message,
        },
    ]

    return {
        statusCode,
        message,
        errorSources,
    }
}
export default handleDuplicateError