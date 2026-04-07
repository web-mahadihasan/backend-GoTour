import { Router } from "express"
import userRouter from "../modules/user/user.route"

const routes = [
    { path: "/user", router: userRouter },
    // add more modules here, e.g: { path: "/tour", router: tourRouter }
]

const router = Router()

routes.forEach(({ path, router: moduleRouter }) => router.use(path, moduleRouter))

export default router
