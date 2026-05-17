import type mongoose from "mongoose"
import type { TErrorSources, TGenericErrorResponse } from "../interfaces/error.types"

const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
    const errorSources: TErrorSources[] = Object.values(err.errors).map(
        (errorObject: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
            return {
                path: errorObject.path,
                message: errorObject.message
            }
        }
    )

    return {
        statusCode: 400,
        message: "Validation error!", 
        errorSources
    }
}

export default handleValidationError