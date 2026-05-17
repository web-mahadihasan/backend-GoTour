import type mongoose from "mongoose"

const handleCastError = (error: mongoose.Error.CastError) => {
    return {
        message: `Invalid ${error.value} mongodb object ID. Provide valid ID!`,
        statusCode: 400,
    }
}

export default handleCastError;