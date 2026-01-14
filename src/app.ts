import express, {type Express} from 'express'
import cors from 'cors'
import router from './routes/routes'
const app: Express = express()

app.use(
    cors()
)

app.use('/api/v1', router)

export default app;