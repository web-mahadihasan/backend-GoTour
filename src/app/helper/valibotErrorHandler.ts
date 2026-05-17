import { ValiError, getDotPath, type GenericSchema } from "valibot";
import type { TErrorSources } from "../interfaces/error.types";

const valibotErrorHandler = (err: ValiError<GenericSchema>) => {
    const message = err.issues[0]?.message ?? 'Validation error'

    const formattedErrors: TErrorSources[] = err.issues.map((issue) => ({
        path: getDotPath(issue) ?? 'unknown',
        message: issue.message,
    }))

    return {message, formattedErrors}
}

export default valibotErrorHandler;