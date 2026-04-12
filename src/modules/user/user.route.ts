import { Router } from "express"
import { userController } from "./user.controller"
import validateRequestBody from "../../middlewares/validateRequestBody"
import { CreateUserSchema } from "./user.interface"
import checkAuth from "@/middlewares/checkAuth"

const userRouter = Router()

userRouter.route("/get/all")
    .get(checkAuth("admin", "super_admin"), userController.getAllUser)

userRouter.route("/get/:id")
    .get(userController.getSingleUser)

userRouter.route("/register")
    .post(validateRequestBody(CreateUserSchema), userController.createUser)

export default userRouter