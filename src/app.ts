import express, {type Express, type Request, type Response} from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import router from './routes/routes'
import notFoundRoute from './middlewares/notFoundRoute'
import globalErrorHandler from './middlewares/globalErrorHandler'

const app: Express = express()

app.use(
    cors()
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", router)

app.get("/api/v1/health", (req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Health is okay"
    })
})

app.get("/", (req: Request, res: Response) => {
    res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You have hit the root URL. Please use the /api/v1 endpoints for API operations."
    })
})

// Global error handler
app.use(globalErrorHandler)

// catch all other undefined routes
app.use(notFoundRoute)

export default app;