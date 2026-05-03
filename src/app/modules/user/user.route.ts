import { Router } from "express"
import { userController } from "./user.controller"
import validateRequestBody from "../../middlewares/validateRequestBody"
import { CreateUserSchema, UpdateUserSchema, USER_ROLES } from "./user.interface"
import checkAuth from "@/app/middlewares/checkAuth"

const userRouter = Router()

userRouter.route("/get/all")
    .get(checkAuth("admin", "super_admin"), userController.getAllUser)

userRouter.route("/get/:id")
    .get(userController.getSingleUser)

userRouter.route("/register")
    .post(validateRequestBody(CreateUserSchema), userController.createUser)

userRouter.route("/update/:id")
    .patch(checkAuth(...Object.values(USER_ROLES)), validateRequestBody(UpdateUserSchema), userController.updateSingleUser)

// userRouter.route("/change-password")
//     .post(checkAuth(...Object.values(USER_ROLES)), validateRequestBody(ChangePasswordSchema), userController.changePassword)

export default userRouter