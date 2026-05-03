import type { Request, Response, NextFunction } from "express"
import * as v from "valibot"

// GenericSchema is Valibot's equivalent of Zod's ZodTypeAny
// request body validation middleware 
const validateRequestBody = (schema: v.GenericSchema) => {
    return async (req: Request, _res: Response, next: NextFunction) => {
        try {
            req.body = await v.parseAsync(schema, req.body)
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default validateRequestBody;