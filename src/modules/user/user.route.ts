import { Router, } from "express"
import { userController } from "./user.controller";
const userRouter = Router()

userRouter.route("/get/all")
    .get(userController.getAllUser)

userRouter.route("/get/:id")
    .get(userController.getSingleUser)

userRouter.route("/register")
    .post(userController.createUser)

export default userRouter;