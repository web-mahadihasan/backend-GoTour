import { Router } from "express"
import userRouter from "../modules/user/user.route"
import authRouter from "../modules/auth/auth.route"

const routes = [
    { path: "/user", router: userRouter },
    { path: "/auth", router: authRouter },
    // add more modules here, e.g: { path: "/tour", router: tourRouter }
]

const router = Router()

routes.forEach(({ path, router: moduleRouter }) => router.use(path, moduleRouter))

export default router
