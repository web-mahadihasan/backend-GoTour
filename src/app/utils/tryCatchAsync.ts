import type { NextFunction, Request, Response } from "express"

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

const tryCatchAsync = (fn: AsyncHandler) => async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err: unknown) => next(err))
}

export default tryCatchAsync