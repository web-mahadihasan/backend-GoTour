import express, {type Express, type Request, type Response} from 'express'
import cors from 'cors'
import { StatusCodes } from 'http-status-codes'
import router from './app/routes/routes'
import notFoundRoute from './app/middlewares/notFoundRoute'
import GlobalErrorHandler from './app/middlewares/globalErrorHandler'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import expressSession from 'express-session'
import config from './app/config/environment'
import "./app/config/passport"

const app: Express = express()

app.use(expressSession({
    secret: config.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(
    cors()
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1", router)

app.get("/api/v1/health", (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Health is okay"
    })
})

app.get("/", (_req: Request, res: Response) => {
    res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You have hit the root URL. Please use the /api/v1 endpoints for API operations."
    })
})

// Global error handler
app.use(GlobalErrorHandler)

// catch all other undefined routes
app.use(notFoundRoute)

export default app;